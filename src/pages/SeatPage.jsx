import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { localhost } from '../config/localhost';
import { useBooking } from '../context/BookingContext';
import { useSeats } from '../context/SeatContext';

export default function SeatPage() {
    const navigate = useNavigate();
    const [seatsData, setSeatsData] = useState([]);
    const { scheduleId } = useBooking();
    const location = useLocation();
    const quantity = location.state;
    const rows = 'ABCDEFGHIJ'.split('');
    const { selectedSeats, toggleSeat } = useSeats();

    useEffect(() => {
        if (!scheduleId || !scheduleId.studio_id) return;

        const token = localStorage.getItem('token');
        fetch(`${localhost}/seats/studio/${scheduleId.studio_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setSeatsData(data.seats || []))
            .catch(err => console.error('Failed to fetch seats:', err));
    }, [scheduleId]);

    const toggleSeatSelection = (seat) => {
        toggleSeat({
            id: seat.id.toString(),
            row: seat.row,
            seat_number: seat.seat_number
        }, quantity);
    };

    const handleNext = () => {
        if (selectedSeats.length === quantity) {
            const totalPrice = scheduleId.price * quantity;
            navigate('/checkout', {
                state: {
                    totalPrice,
                    selectedSeats,
                    quantity,
                    scheduleInfo: scheduleId,
                },
            });
        } else {
            alert(`Please select exactly ${quantity} seat(s) for this booking.`);
        }
    };

    const seatsByRow = seatsData.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    const totalPrice = scheduleId.price * quantity;

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
                    <p className="text-muted">
                        Selected: {selectedSeats.length} / {quantity} seats
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
                                                const isInactive = seat.is_active === 0;
                                                const isDisabled = isInactive || (!isSelected && selectedSeats.length >= quantity);

                                                return (
                                                    <Button
                                                        key={seatId}
                                                        variant={
                                                            isInactive
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
                                                            opacity: isInactive ? 0.5 : 1,
                                                            cursor: isInactive ? 'not-allowed' : 'pointer',
                                                        }}
                                                        onClick={() => !isInactive && toggleSeatSelection(seat)}
                                                        disabled={isDisabled}
                                                        aria-pressed={isSelected}
                                                        aria-label={`Seat ${seat.seat_number} ${isInactive ? '(unavailable)' : ''}`}
                                                        title={isInactive ? 'Seat not available' : `Seat ${seat.seat_number}`}
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
                            <Button
                                variant="outline-secondary"
                                className="rounded-circle me-2"
                                style={{ width: 30, height: 30, padding: 0 }}
                                disabled
                            ></Button>
                            <small>Available</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <Button
                                variant="danger"
                                className="rounded-circle me-2"
                                style={{ width: 30, height: 30, padding: 0 }}
                                disabled
                            ></Button>
                            <small>Selected</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <Button
                                variant="secondary"
                                className="rounded-circle me-2"
                                style={{ width: 30, height: 30, padding: 0, opacity: 0.5 }}
                                disabled
                            ></Button>
                            <small>Unavailable</small>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleNext}
                            disabled={selectedSeats.length !== quantity}
                        >
                            Next ({selectedSeats.length}/{quantity} selected)
                        </Button>
                    </div>
                </Col>

                <Col md={3}>
                    {quantity > 0 && (
                        <Card className="mt-5" style={{ backgroundColor: '#f7f7f7' }}>
                            <Card.Body>
                                <Card.Title>ORDER SUMMARY</Card.Title>
                                <div>
                                    <strong>{scheduleId?.movie_title} - {scheduleId?.studio_name}</strong>
                                    <br />
                                    <i className="bi bi-geo-alt"></i> Studio: {scheduleId?.studio_name}
                                    <hr />
                                    <strong>Quantity: {quantity}</strong>
                                    <br />
                                    <strong>Selected Seats: </strong>
                                    <ul>
                                        {selectedSeats.map(seat => (
                                            <li key={seat.id}>{seat.row}{seat.seat_number}</li>
                                        ))}
                                    </ul>
                                    <strong>Total Price: Rp {totalPrice.toLocaleString()}</strong>
                                </div>
                            </Card.Body>

                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
