import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { localhost } from '../config/localhost';
import TimeFormater from '../utils/TimeFormater';

export default function ReceiptPage() {
    const [reservationData, setReservationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { idBooking } = useParams();

    // Memoized function untuk fetch data
    const fetchReservationData = useCallback(async () => {
        if (!idBooking) {
            setError('Booking ID tidak ditemukan');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');

            if (!token) {
                setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
                setLoading(false);
                return;
            }

            const response = await fetch(`${localhost}/reservation/booking/${encodeURIComponent(idBooking)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
                } else if (response.status === 404) {
                    throw new Error('Data reservasi tidak ditemukan.');
                } else {
                    throw new Error(`Gagal mengambil data reservasi (${response.status})`);
                }
            }

            const data = await response.json();

            console.log(data);

            if (!data || !data.reservations || !Array.isArray(data.reservations)) {
                throw new Error('Format data tidak valid');
            }

            // Filter dan group data reservasi berdasarkan booking_id
            const decodedBookingId = decodeURIComponent(idBooking);
            const filteredReservations = data.reservations.filter(
                reservation => reservation.booking_id === decodedBookingId
            );

            if (filteredReservations.length === 0) {
                setError('Tidak ada data reservasi ditemukan untuk booking ID ini.');
                return;
            }

            const groupedData = filteredReservations.reduce((acc, reservation) => {
                const key = `${reservation.movie_id}-${reservation.show_time}-${reservation.studio_name}`;
                if (!acc[key]) {
                    acc[key] = {
                        ...reservation,
                        seats: [],
                        seatCount: 0
                    };
                }
                acc[key].seats.push(`${reservation.seat_row}${reservation.seat_number}`);
                acc[key].seatCount++;
                return acc;
            }, {});

            const processedData = Object.values(groupedData);
            setReservationData(processedData);

        } catch (err) {
            console.error('Error fetching reservation data:', err);
            setError(err.message || 'Terjadi kesalahan saat mengambil data reservasi');
        } finally {
            setLoading(false);
        }
    }, [idBooking]);

    useEffect(() => {
        fetchReservationData();
    }, [fetchReservationData]);

    // Handler untuk retry
    const handleRetry = () => {
        fetchReservationData();
    };

    // Handler untuk kembali ke history
    const handleBackToHistory = useCallback(() => {
        navigate('/history');
    }, [navigate]);

    // Render barcode yang lebih robust
    const renderBarcode = (reservationId) => {
        if (!reservationId) return null;

        const cleanId = reservationId.toString().replace(/[^0-9a-f]/gi, '').toLowerCase();
        const barcodeData = cleanId.split('').slice(0, 20);

        return (
            <div className="mt-4">
                <div className="d-flex justify-content-center mb-2" style={{ height: 50 }}>
                    {barcodeData.map((ch, idx) => {
                        const height = Math.max(parseInt(ch, 16) * 3 + 20, 20);
                        return (
                            <div
                                key={`barcode-${idx}-${reservationId}`}
                                style={{
                                    width: 4,
                                    height: height,
                                    marginRight: 2,
                                    backgroundColor: idx % 2 === 0 ? '#000' : '#333',
                                }}
                            />
                        );
                    })}
                </div>
                <p className="text-center text-muted small">
                    Tunjukkan barcode ini kepada kasir untuk pembayaran.
                </p>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" role="status" size="lg">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Memuat data reservasi...</p>
            </Container>
        );
    }

    // Error state
    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">
                    <Alert.Heading>Terjadi Kesalahan</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <div className="d-flex gap-2">
                        <Button variant="outline-danger" onClick={handleRetry}>
                            Coba Lagi
                        </Button>
                        <Button variant="primary" onClick={handleBackToHistory}>
                            Kembali ke Riwayat
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

    // Empty state
    if (!reservationData || reservationData.length === 0) {
        return (
            <Container className="my-5">
                <Alert variant="info">
                    <Alert.Heading>Data Tidak Ditemukan</Alert.Heading>
                    <p>Tidak ada reservasi yang ditemukan untuk booking ID: {decodeURIComponent(idBooking)}</p>
                    <hr />
                    <Button variant="primary" onClick={handleBackToHistory}>
                        Kembali ke Riwayat
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4" style={{ marginTop: '15vh' }}>
                Detail Reservasi - {decodeURIComponent(idBooking)}
            </h2>

            {reservationData.map((reservation, index) => (
                <Card key={`${reservation.show_time}-${reservation.studio_name}-${index}`} className="mb-4 shadow-sm">
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={4} className="d-flex align-items-center justify-content-center">
                                {reservation.poster_url ? (
                                    <img
                                        src={reservation.poster_url}
                                        alt={reservation.movie_title || 'Movie Poster'}
                                        className="img-fluid rounded"
                                        style={{ maxHeight: '250px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-light rounded"
                                        style={{ width: '200px', height: '250px' }}
                                    >
                                        <span className="text-muted">No Image</span>
                                    </div>
                                )}
                            </Col>
                            <Col md={8}>
                                <Card.Title className="mb-3">{reservation.movie_title}</Card.Title>

                                <Card.Text>
                                    <strong>Studio:</strong> {reservation.studio_name || 'N/A'}
                                </Card.Text>

                                <Card.Text>
                                    <strong>Waktu Tayang:</strong> {
                                        reservation.show_time ? TimeFormater(reservation.show_time) : 'N/A'
                                    }
                                </Card.Text>

                                <Card.Text>
                                    <strong>Kursi:</strong>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {reservation.seats && reservation.seats.length > 0 ? (
                                            reservation.seats.map((seat, seatIndex) => (
                                                <Badge key={`${seat}-${seatIndex}`} bg="secondary" pill>
                                                    {seat}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-muted">Tidak ada kursi</span>
                                        )}
                                    </div>
                                </Card.Text>

                                <Card.Text>
                                    <strong>Jumlah Kursi:</strong> {reservation.seatCount} kursi
                                </Card.Text>

                                <Card.Text>
                                    <strong>Status:</strong>{' '}
                                    <Badge
                                        bg={
                                            reservation.status === 'reserved' ? 'success' :
                                                reservation.status === 'cancelled' ? 'danger' :
                                                    reservation.status === 'completed' ? 'primary' : 'warning'
                                        }
                                    >
                                        {reservation.status === 'reserved' ? 'Telah Reservasi' :
                                            reservation.status === 'cancelled' ? 'Dibatalkan' :
                                                reservation.status === 'completed' ? 'Selesai' :
                                                    reservation.status || 'Unknown'}
                                    </Badge>
                                </Card.Text>

                                <Card.Text>
                                    <strong>Waktu Reservasi:</strong> {
                                        reservation.reserved_at
                                            ? new Date(reservation.reserved_at).toLocaleString('id-ID')
                                            : 'N/A'
                                    }
                                </Card.Text>
                            </Col>
                        </Row>

                        {/* Barcode */}
                        {renderBarcode(reservation.id)}
                    </Card.Body>
                </Card>
            ))}

            <div className="text-center mt-4">
                <Button variant="primary" onClick={handleBackToHistory} size="lg">
                    Kembali ke Riwayat
                </Button>
            </div>
        </Container>
    );
}