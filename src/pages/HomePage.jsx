import { useCallback, useEffect, useState } from "react";
import { localhost } from "../config/localhost";
import {
    Container,
    Card,
    Col,
    Row,
} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import '../css/HomePage.css'

export default function HomePage() {
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const removeDuplicateMovies = (schedules) => {
        const seen = new Set();
        return schedules.filter((film) => {
            if (seen.has(film.movie_id)) {
                return false;
            } else {
                seen.add(film.movie_id);
                return true;
            }
        });
    };

    const fetchSchedule = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${localhost}/schedule/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                const uniqueSchedules = removeDuplicateMovies(data.schedules || []);
                setSchedule(uniqueSchedules);
            } else {
                setError("Gagal mengambil data film.");
            }
        } catch (err) {
            setError("Terjadi kesalahan dalam mengambil data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    const handleSelectFilm = (id) => {
        navigate(`/detail-movie/${id}`);
    };

    const indonesianFilms = schedule.filter(film => film.category === 'Indonesia');
    const internationalFilms = schedule.filter(film => film.category === 'Internasional');

    return (
        <>
            <Container className="my-5">
                <h1 className="mb-4 text-center" style={{ marginTop: '90px' }}>Sedang Tayang</h1>

                {error && <p className="text-danger text-center">{error}</p>}
                {isLoading && <p className="text-center">Loading...</p>}

                <h2 className="mb-3">Film Indonesia</h2>
                <Row>
                    {indonesianFilms.map((film) => (
                        <Col key={film.id} md={4} className="mb-4">
                            <Card
                                className="h-100 shadow-sm bg-light animate__animated animate__fadeIn"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSelectFilm(film.movie_id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSelectFilm(film.id);
                                }}
                                tabIndex={0}
                                role="button"
                                aria-pressed="false"
                            >
                                <Card.Img variant="top" src={film.movie_poster} alt={`${film.movie_title} poster`} />
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <Card.Title className="text-center">{film.movie_title}</Card.Title>
                                    <div className="text-muted text-center">{film.studio_name}</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <h2 className="mb-3">Film Internasional</h2>
                <Row>
                    {internationalFilms.map((film) => (
                        <Col key={film.id} md={4} className="mb-4">
                            <Card
                                className="h-100 shadow-sm bg-light animate__animated animate__fadeIn"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSelectFilm(film.movie_id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSelectFilm(film.id);
                                }}
                                tabIndex={0}
                                role="button"
                                aria-pressed="false"
                            >
                                <Card.Img variant="top" src={film.movie_poster} alt={`${film.movie_title} poster`} />
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <Card.Title className="text-center">{film.movie_title}</Card.Title>
                                    <div className="text-muted text-center">{film.studio_name}</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}
