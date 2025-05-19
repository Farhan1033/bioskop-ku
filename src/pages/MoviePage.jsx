import { useEffect, useState } from "react";
import { localhost } from "../config/localhost";
import { Col, Container, Row, Card, Spinner, Alert } from "react-bootstrap";

export default function MoviePage() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMovies = async () => {
        setError('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${localhost}/movies/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setMovies(data.movie || [])
            } else {
                setError('Gagal mengabil data film')
            }
        } catch (error) {
            setError('Terjadi kesalahan saat mengambil data, silahkan coba lagi')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMovies();
    }, [])

    return (
        <Container style={{ marginTop: '90px' }}>
            {isLoading && (
                <div className="text-center my-4">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}

            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}

            {!isLoading && !error && movies.length > 0 && (
                // <p className="text-center">Tidak ada film yang tersedia.</p>
                <>
                    <h4>List Film</h4>
                    <Row>
                        {movies.map((movie) => (
                            <Col key={movie.id} md={4} sm={6} className="mb-4">
                                <Card>
                                    <Card.Img
                                        variant="top"
                                        src={movie.poster_url}
                                        alt={movie.title}
                                    />
                                    <Card.Body>
                                        <Card.Title>{movie.title}</Card.Title>
                                        <Card.Text>
                                            Deskripsi: {movie.description} <br />
                                            Durasi: {movie.duration} Menit
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    )
}