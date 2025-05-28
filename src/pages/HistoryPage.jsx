import { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, ListGroup, Row, Button } from 'react-bootstrap';
import { localhost } from '../config/localhost';
import TimeFormater from '../utils/TimeFormater';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const removeDuplicateMovies = (historyFilm) => {
        const seen = new Set();
        return historyFilm.filter((film) => {
            if (seen.has(film.booking_id)) {
                return false;
            } else {
                seen.add(film.booking_id);
                return true;
            }
        });
    };

    const fetchHistory = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${localhost}/reservation/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                const uniqueSchedules = removeDuplicateMovies(data.reservations || []);
                setHistory(uniqueSchedules);
            } else {
                setError('Gagal mengambil data, history tidak ditemukan');
            }
        } catch (error) {
            setError('Terjadi kesalahan saat mengambil data, silakan coba lagi');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleDetailHistory = (id) => {
        navigate(`/detail-history/${id}`);
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4" style={{ marginTop: '15vh' }}>History Ticket</h2>

            {error && <p className="text-danger text-center">{error}</p>}
            {isLoading && <p className="text-center">Loading...</p>}

            <Row>
                {history.map((historyReceipt) => (
                    <Col key={`${historyReceipt.movie_title}-${historyReceipt.id}`} md={4} className="mb-5">
                        <Card border="dark" style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={historyReceipt.movie_poster} alt={historyReceipt.movie_title} />
                            <Card.Body>
                                <Card.Title>
                                    {historyReceipt.movie_title} - {historyReceipt.studio_name}
                                </Card.Title>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>
                                    Time: {TimeFormater(historyReceipt.show_time)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Status: {historyReceipt.status}
                                </ListGroup.Item>
                            </ListGroup>
                            <Card.Body>
                                <Button
                                    variant="primary"
                                    onClick={() => handleDetailHistory(historyReceipt.booking_id)}
                                >
                                    Detail History
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}