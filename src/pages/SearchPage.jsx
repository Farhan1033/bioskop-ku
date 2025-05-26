import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { localhost } from "../config/localhost";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchPage() {
    const query = useQuery();
    const title = query.get("title");
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!title) return;

        setLoading(true);

        const token = localStorage.getItem('token');
        fetch(`${localhost}/movies/search?title=${title}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Terjadi kesalahan saat mengambil data.");
                }
                return res.json();
            })
            .then((data) => {
                setMovies(data.movieData || []);
                setErrorMsg(data.movieData?.length === 0 ? "Film tidak ditemukan" : "");
            })
            .catch((error) => {
                setErrorMsg(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [title]);

    const handleMovieDetail = (id) => {
        navigate(`/detail-movie/${id}`)
    }

    return (
        <Container style={{ marginTop: "80px" }}>
            <h2>Hasil Pencarian: {title}</h2>

            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                </div>
            ) : errorMsg ? (
                <Alert variant="danger">{errorMsg}</Alert>
            ) : (
                <Row className="mt-3">
                    {movies.map((movie) => (
                        <Col md={4} lg={3} key={movie.id} className="mb-4">
                            <Card
                                className="h-100 shadow-sm bg-light animate__animated animate__fadeIn"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleMovieDetail(movie.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleMovieDetail(movie.id);
                                }}
                                tabIndex={0}
                                role="button"
                                aria-pressed="false"
                            >
                                <Card.Img variant="top" src={movie.poster_url} alt={`${movie.title} poster`} />
                                <Card.Body style={{ width: "100%", overflow: "hidden" }}>
                                    <Card.Title >{movie.title}</Card.Title>
                                    <Card.Text style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{movie.description}</Card.Text>
                                    <small className="text-muted">
                                        Kategori: {movie.category} <br />
                                        Durasi: {movie.duration} menit <br />
                                        Harga: Rp{movie.price.toLocaleString()}
                                    </small>
                                </Card.Body>

                            </Card>
                        </Col>
                    ))}
                </Row>
            )
            }
        </Container >
    );
}

export default SearchPage;
