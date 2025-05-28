import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { localhost } from '../config/localhost';
import { useBooking } from '../context/BookingContext';

const ReceiptPage = () => {
    const [reservationData, setReservationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { idBooking } = useBooking();

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const res = await fetch(`${localhost}/reservation/booking/${idBooking}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const result = await res.json();

                if (result && result.reservationData) {
                    const grouped = result.reservationData.reduce((acc, item) => {
                        const key = `${item.show_time}-${item.studio_name}`;
                        if (!acc[key]) {
                            acc[key] = {
                                ...item,
                                seats: [],
                            };
                        }
                        acc[key].seats.push(`${item.seat_row}${item.seat_number}`);
                        return acc;
                    }, {});
                    setReservationData(Object.values(grouped));
                } else {
                    setReservationData([]);
                }

                setLoading(false);
            } catch (error) {
                console.error('Gagal mengambil data receipt:', error);
                setLoading(false);
            }
        };

        fetchReceipt();
    }, [idBooking]);

    const handleBack = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading receipt...</p>
            </Container>
        );
    }

    if (!reservationData.length) {
        return (
            <Container className="my-5">
                <Alert variant="warning">Tidak ada data reservasi ditemukan untuk ID booking ini.</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4" style={{ marginTop: '15vh' }}>
                Receipt for {reservationData[0].movie_title}
            </h2>

            {reservationData.map((info, index) => (
                <Card key={`${info.show_time}-${info.studio_name}-${index}`} className="mb-4 shadow-sm">
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={4} className="d-flex align-items-center justify-content-center">
                                <img
                                    src={info.poster_url}
                                    alt={info.movie_title}
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '250px' }}
                                />
                            </Col>
                            <Col md={8}>
                                <Card.Text><strong>Studio:</strong> {info.studio_name}</Card.Text>
                                <Card.Text><strong>Showtime:</strong> {new Date(info.show_time).toLocaleString()}</Card.Text>
                                <div className="mb-2">
                                    <strong>Seats:</strong>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {info.seats.map((seat) => (
                                            <Badge key={seat} bg="secondary" pill>{seat}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Card.Text><strong>Total Seats:</strong> {info.seats.length}</Card.Text>
                                {info.total_price && (
                                    <Card.Text><strong>Total Price:</strong> Rp{Number(info.total_price).toLocaleString()}</Card.Text>
                                )}
                                <Card.Text>
                                    <strong>Status:</strong>{' '}
                                    <Badge bg={info.status === 'completed' ? 'success' : 'warning'}>
                                        {info.status}
                                    </Badge>
                                </Card.Text>
                                <Card.Text><strong>Booked at:</strong> {new Date(info.reserved_at).toLocaleString()}</Card.Text>
                            </Col>
                        </Row>

                        <div className="mt-4">
                            <div className="d-flex justify-content-center mb-2" style={{ height: 50 }}>
                                {info.id.replace(/[^0-9a-f]/g, '').split('').slice(0, 20).map((ch, idx) => (
                                    <div
                                        key={`barcode-${idx}-${info.id}`}
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
                                Show this receipt to the cashier.
                            </p>
                        </div>
                    </Card.Body>
                </Card>
            ))}

            <div className="text-center mt-3">
                <Button variant="primary" onClick={handleBack} size="lg">
                    Back to Home
                </Button>
            </div>
        </Container>
    );
};

export default ReceiptPage;
