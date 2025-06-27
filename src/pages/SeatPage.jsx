import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { localhost } from '../config/localhost';
import { useBooking } from '../context/BookingContext';
import { useSeats } from '../context/SeatContext';

export default function SeatPage() {
    const navigate = useNavigate();
    const [seatsData, setSeatsData] = useState([]);
    const [bookedSeatIds, setBookedSeatIds] = useState([]);
    const { scheduleId, setIdBooking } = useBooking();
    const location = useLocation();
    const quantity = location.state;
    const rows = 'ABCDEFGHIJ'.split('');
    const { selectedSeats, toggleSeat } = useSeats();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const [isLoadingSeats, setIsLoadingSeats] = useState(true);


    useEffect(() => {
        if (!scheduleId || !scheduleId.studio_id) return;

        setIsLoadingSeats(true);

        // Ambil kursi studio
        const fetchSeats = fetch(`${localhost}/seats/studio/${scheduleId.studio_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => res.json());

        // Ambil kursi yang sudah dipesan untuk jadwal tersebut
        const fetchBookedSeats = fetch(`${localhost}/reservation/schedule/${scheduleId.id}/booked-seats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => res.json());

        Promise.all([fetchSeats, fetchBookedSeats])
            .then(([seatsRes, bookedSeatsRes]) => {
                setSeatsData(seatsRes.seats || []);
                setBookedSeatIds(bookedSeatsRes || []);
            })
            .catch(err => {
                console.error('Gagal memuat data kursi:', err);
                setError('Gagal memuat data kursi');
            })
            .finally(() => {
                setIsLoadingSeats(false);
            });
    }, [scheduleId, token]);

    const toggleSeatSelection = (seat) => {
        toggleSeat({
            id: seat.id.toString(),
            row: seat.row,
            seat_number: seat.seat_number
        }, quantity);
    };

    const handleNext = async () => {
        if (selectedSeats.length === quantity) {
            setIsLoading(true);
            try {
                const totalPrice = scheduleId.price * quantity;
                const response = await fetch(`${localhost}/bookings/add-booking`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        schedule_id: scheduleId.id,
                        total_price: totalPrice
                    })
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                const bookingId = data.bookings.id;
                setIdBooking(bookingId);

                navigate('/checkout', {
                    state: {
                        selectedSeats,
                        quantity,
                        totalPrice,
                    },
                });
            } catch (error) {
                console.error('Gagal booking:', error);
                alert('Gagal melakukan booking. Coba lagi.');
            } finally {
                setIsLoading(false);
            }
        } else {
            alert(`Silahkan pilih tepat ${quantity} kursi untuk pemesanan ini.`);
        }
    };

    const seatsByRow = seatsData.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    const totalPrice = scheduleId?.price ? scheduleId.price * quantity : 0;

    if (!scheduleId) {
        return (
            <Container className="my-5 text-center">
                <p>Loading...</p>
            </Container>
        );
    }

    if (isLoadingSeats) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" role="status" />
                <p className="mt-2">Memuat data kursi...</p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            {error && (
                <Row className="mb-3">
                    <Col>
                        <div className="alert alert-danger">{error}</div>
                    </Col>
                </Row>
            )}

            <Row>
                <Col md={8}>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/quantity-seats')}
                        className="mb-3"
                        disabled={isLoading}
                    >
                        ← Kembali ke pilihan jumlah
                    </Button>

                    <h2>Pilih Kursi Anda</h2>
                    <p className="text-muted">
                        Terpilih: {selectedSeats.length} / {quantity} kursi
                    </p>

                    <div className="mt-4">
                        {rows.map(row => {
                            const seats = seatsByRow[row] || [];
                            const sortedSeats = seats.slice().sort((a, b) => a.seat_number - b.seat_number);

                            if (sortedSeats.length === 0) return null;

                            return (
                                <Row key={row} className="mb-2 align-items-center">
                                    <Col xs="auto">
                                        <strong className="fs-5">{row}</strong>
                                    </Col>
                                    <Col>
                                        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                            {sortedSeats.map(seat => {
                                                const seatId = seat.id.toString();
                                                const isSelected = selectedSeats.some(s => s.id === seatId);
                                                const isBooked = bookedSeatIds.includes(seatId);
                                                const isDisabled = isBooked || (!isSelected && selectedSeats.length >= quantity) || isLoading;

                                                return (
                                                    <Button
                                                        key={seatId}
                                                        variant={
                                                            isBooked
                                                                ? 'secondary'
                                                                : isSelected
                                                                    ? 'danger'
                                                                    : 'outline-secondary'
                                                        }
                                                        className="me-2 mb-2 rounded-circle"
                                                        style={{
                                                            width: 36,
                                                            height: 36,
                                                            padding: 0,
                                                            display: 'inline-block',
                                                            opacity: isBooked ? 0.5 : 1,
                                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                        }}
                                                        onClick={() => !isDisabled && toggleSeatSelection(seat)}
                                                        disabled={isDisabled}
                                                        aria-pressed={isSelected}
                                                        title={isBooked ? 'Kursi sudah dipesan' : `Kursi ${seat.seat_number}`}
                                                    >
                                                        {seat.seat_number}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </Col>
                                </Row>
                            );
                        })}
                    </div>

                    <div className="mt-4 d-flex justify-content-center gap-4">
                        <div className="d-flex align-items-center">
                            <Button variant="outline-secondary" className="rounded-circle me-2" style={{ width: 30, height: 30 }} disabled />
                            <small>Tersedia</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <Button variant="danger" className="rounded-circle me-2" style={{ width: 30, height: 30 }} disabled />
                            <small>Dipilih</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <Button variant="secondary" className="rounded-circle me-2" style={{ width: 30, height: 30, opacity: 0.5 }} disabled />
                            <small>Sudah Dipesan</small>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleNext}
                            disabled={selectedSeats.length !== quantity || isLoading}
                        >
                            {isLoading ? 'Memproses...' : `Lanjut (${selectedSeats.length}/${quantity} terpilih)`}
                        </Button>
                    </div>
                </Col>

                <Col md={4}>
                    {quantity > 0 && scheduleId && (
                        <Card className="mt-5" style={{ backgroundColor: '#f7f7f7' }}>
                            <Card.Body>
                                <Card.Title>RINGKASAN PESANAN</Card.Title>
                                <div>
                                    <strong>{scheduleId.movie_title} - {scheduleId.studio_name}</strong>
                                    <br />
                                    <hr />
                                    <strong>Jumlah: {quantity}</strong>
                                    <br />
                                    <strong>Kursi Terpilih: </strong>
                                    {selectedSeats.length > 0 ? (
                                        <ul>
                                            {selectedSeats.map(seat => (
                                                <li key={seat.id}>{seat.row}{seat.seat_number}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted">Belum ada kursi dipilih</p>
                                    )}
                                    <strong>Total Harga: Rp {totalPrice.toLocaleString('id-ID')}</strong>
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
