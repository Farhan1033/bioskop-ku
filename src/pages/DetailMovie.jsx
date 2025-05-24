import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Button, Col, Image } from "react-bootstrap";
import { localhost } from "../config/localhost";
import TimeFormater from "../utils/TimeFormater";

export default function DetailMovie() {
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchDetailMovie = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${localhost}/schedule/movie/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSchedules(data.schedules || []);
            } else {
                setError('Gagal mengambil data, movie tidak ditemukan');
            }
        } catch (error) {
            setError('Kesalahan saat mengambil data, silahkan coba lagi');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetailMovie();
    }, [fetchDetailMovie]);

    const handleBackToFilms = () => {
        navigate('/home');
    };

    const handleBookNow = (scheduleId) => {
        navigate(`/booking-movie/${scheduleId}`);
    };

    const movie = schedules[0];

    return (
        <Container className="my-3">
            {error && <p className="text-danger text-center">{error}</p>}
            {isLoading && <p className="text-center">Loading...</p>}

            {!isLoading && movie && (
                <>
                    <Button
                        variant="primary"
                        onClick={handleBackToFilms}
                        className="mb-4"
                    >
                        &larr; Back To Home
                    </Button>

                    <Row>
                        <Col md={4}>
                            <Image
                                src={movie.movie_poster}
                                alt={`${movie.movie_title} poster`}
                                fluid
                                rounded
                                style={{ width: '100%', height: '75vh', objectFit: 'fill' }}
                            />
                        </Col>

                        <Col md={8} className="d-flex flex-column" style={{ height: '75vh' }}>
                            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                                <h2>{movie.movie_title}</h2>
                                <p className="lead" style={{ textAlign: 'justify' }}>{movie.description}</p>

                                <h5>Price</h5>
                                <p className="lead" style={{ textAlign: 'justify' }}>Rp. {movie.price}</p>

                                <h5>Show Times:</h5>
                                <ul>
                                    {schedules.map(schedule => (
                                        <li key={schedule.id} className="mb-2">
                                            {TimeFormater(schedule.show_time)} - {schedule.studio_name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button
                                variant="outline-primary"
                                style={{ width: '30vh', height: '7vh' }}
                                onClick={() => handleBookNow(movie.movie_id)}
                            >
                                Book Now
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}
