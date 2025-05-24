import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { localhost } from '../config/localhost';
import { useBooking } from '../context/BookingContext';

export default function SeatPage() {
    const navigate = useNavigate();
    const [seatsData, setSeatsData] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const { scheduleId } = useBooking();
    const location = useLocation();
    const quantity = location.state;
    const rows = 'ABCDEFGHIJ'.split('');

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${localhost}/seats/studio/${scheduleId.studio_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setSeatsData(data.seats))
            .catch((error) => console.error('Failed to fetch seats:', error));
    }, []);

    const toggleSeatSelection = (seatId) => {
        if (selectedSeats.includes(seatId)) {

            setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
        } else {
            if (selectedSeats.length < quantity) {
                setSelectedSeats([...selectedSeats, seatId]);
            } else {
                alert(`You can only select up to ${quantity} seats.`);
            }
        }
    };

    const handleNext = () => {
        if (selectedSeats.length === quantity) {
            navigate('/checkout');
        } else {
            alert(`Please select exactly ${quantity} seat(s) for this booking.`);
        }
    };

    const seatsByRow = seatsData.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    const sortedRows = Object.keys(seatsByRow).sort();

    return (
        <Container className="my-5">
            <Row>
                <Col md={8}>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/quantity-seats')}
                        className="mb-3"
                    >
                        ← Back to quantity
                    </Button>

                    <h2>Select Your Seats</h2>

                    <div className="mt-4">
                        {rows.map(row => {
                            const seats = seatsByRow[row] || []; // ambil kursi di row, default array kosong kalau gak ada

                            // urutkan seats berdasarkan seat_number
                            const sortedSeats = seats.slice().sort((a, b) => a.seat_number - b.seat_number);

                            return (
                                <Row key={row} className="mb-2 align-items-center">
                                    <Col xs="auto"><strong className="fs-5">{row}</strong></Col>
                                    <Col>
                                        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                            {sortedSeats.map(seat => {
                                                const isSelected = selectedSeats.includes(seat.id);
                                                const isDisabled = !isSelected && selectedSeats.length >= quantity;

                                                return (
                                                    <Button
                                                        key={seat.id}
                                                        variant={isSelected ? 'danger' : 'outline-secondary'}
                                                        className="me-2 mb-2 rounded-circle"
                                                        style={{ width: 36, height: 36, padding: 0, display: 'inline-block' }}
                                                        onClick={() => toggleSeatSelection(seat.id)}
                                                        disabled={isDisabled}
                                                        aria-pressed={isSelected}
                                                        aria-label={`Seat ${seat.id}`}
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

                    <div className="text-center mt-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleNext}
                            disabled={selectedSeats.length !== quantity}
                        >
                            Next
                        </Button>
                    </div>
                </Col>

                <Col md={3}>
                    {quantity > 0 && (
                        <Card className="mt-5" style={{ backgroundColor: '#f7f7f7' }}>
                            <Card.Body>
                                <Card.Title>ORDER SUMMARY</Card.Title>
                                <Card.Text>
                                    <strong> {scheduleId.movie_title} - {scheduleId.studio_name}</strong>
                                    <br />
                                    <i className="bi bi-geo-alt"></i> Studio: {scheduleId.studio_name}
                                    <hr />
                                    <strong>Quantity: {quantity}</strong>
                                    <br />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
