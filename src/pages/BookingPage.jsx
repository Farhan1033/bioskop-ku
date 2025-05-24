import { useCallback, useEffect, useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { localhost } from "../config/localhost";
import { useBooking } from "../context/BookingContext.jsx";
import TimeFormater from "../utils/TimeFormater.jsx";

export default function BookingPage() {
    const [booking, setBooking] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { setScheduleId } = useBooking();

    const fetchBooking = useCallback(async () => {
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
                setBooking(data.schedules || [])
            } else {
                setError('Gagal saat mengambil data id tidak ditemukan')
            }
        } catch (error) {
            setError('Terjadi kesalahan saat mengambil data, silahkan coba lagi')
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    const handleSelectShowtime = (value) => {
        setScheduleId(value);
        navigate('/quantity-seats');
    };

    const handleBackToDetails = (booking) => {
        navigate(`/detail-movie/${booking}`);
    };

    const movie = booking.length > 0 ? booking[0] : null;

    return (
        <Container className="my-5">

            {error && <p className="text-danger text-center">{error}</p>}
            {isLoading && <p className="text-center">Loading...</p>}

            {!isLoading && movie && (
                <>
                    <Button variant="primary" onClick={() => handleBackToDetails(movie.movie_id)} className="mb-3">
                        &larr; Back to details
                    </Button>

                    <h2>Select Showtime for {movie.movie_title}</h2>
                    <Row className="d-flex flex-wrap gap-2 mt-2">
                        {booking.map((time) => (
                            <Col key={time.id} className="mb-3" xs={6} sm={3} md={4} lg={2}>
                                <Button
                                    variant={'outline-primary'}
                                    onClick={() => handleSelectShowtime(time)}
                                    style={{ width: '100%' }}
                                >
                                    {TimeFormater(time.show_time)}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container >
    );
}