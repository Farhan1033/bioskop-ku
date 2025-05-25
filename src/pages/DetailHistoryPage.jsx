import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { localhost } from '../config/localhost';
import TimeFormater from '../utils/TimeFormater';

export default function DetailHistory() {
    const [reservationData, setReservationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { movieTitle } = useParams();
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchReservationData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${localhost}/reservation/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch reservation data');
                }

                const data = await response.json();
                // Filter by movie title and group by showtime
                const filteredData = data.reservations
                    .filter(reservation => reservation.movie_title === decodeURIComponent(movieTitle))
                    .reduce((acc, reservation) => {
                        const key = `${reservation.show_time}-${reservation.studio_name}`;
                        if (!acc[key]) {
                            acc[key] = {
                                ...reservation,
                                seats: []
                            };
                        }
                        acc[key].seats.push(`${reservation.row}${reservation.seat_number}`);
                        return acc;
                    }, {});

                setReservationData(Object.values(filteredData));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReservationData();
    }, [userId, movieTitle]);

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading reservation data...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">
                    <h4>Error</h4>
                    <p>{error}</p>
                    <Link to="/history" className="btn btn-primary">Back to History</Link>
                </Alert>
            </Container>
        );
    }

    if (!reservationData || reservationData.length === 0) {
        return (
            <Container className="my-5">
                <Alert variant="warning">
                    <h4>No reservations found for {decodeURIComponent(movieTitle)}</h4>
                    <Link to="/history" className="btn btn-primary">Back to History</Link>
                </Alert>
            </Container>
        );
    }

    const handleFinish = () => {
        navigate('/history');
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4" style={{ marginTop: '15vh' }}>Detail History for {decodeURIComponent(movieTitle)}</h2>

            {reservationData.map((reservation) => (
                <Card key={`${reservation.show_time}-${reservation.studio_name}`} className="mb-4 shadow-sm">
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={4} className="d-flex align-items-center justify-content-center">
                                <img
                                    src={reservation.poster_url}
                                    alt={reservation.movie_title}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '250px' }}
                                />
                            </Col>
                            <Col md={8}>
                                <Card.Text>
                                    <strong>Studio:</strong> {reservation.studio_name}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Showtime:</strong> {TimeFormater(reservation.show_time)}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Seats:</strong>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {reservation.seats.map((seat) => (
                                            <Badge key={seat} bg="secondary" pill>
                                                {seat}
                                            </Badge>
                                        ))}
                                    </div>
                                </Card.Text>
                                <Card.Text>
                                    <strong>Total Price:</strong> Rp{reservation.total_price.toLocaleString()}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Status:</strong>
                                    <Badge bg={reservation.status === 'completed' ? 'success' : 'warning'}>
                                        {reservation.status}
                                    </Badge>
                                </Card.Text>
                                <Card.Text>
                                    <strong>Reserved at:</strong> {new Date(reservation.reserved_at).toLocaleString()}
                                </Card.Text>
                            </Col>
                        </Row>

                        {/* Barcode */}
                        <div className="mt-4">
                            <div className="d-flex justify-content-center mb-2" style={{ height: 50 }}>
                                {reservation.id.replace(/[^0-9a-f]/g, '').split('').slice(0, 20).map((ch, idx) => (
                                    <div
                                        key={`barcode-${idx}-${reservation.id}`}
                                        style={{
                                            width: 4,
                                            height: parseInt(ch, 16) * 3 + 20,
                                            marginRight: 2,
                                            backgroundColor: idx % 2 === 0 ? '#000' : '#333',
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-center text-muted small">
                                Show this barcode to the cashier to pay.
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            ))}

            <div className="text-center mt-3">
                <Button variant="primary" onClick={handleFinish} size="lg">
                    Back to history
                </Button>
            </div>
        </Container>
    );
}