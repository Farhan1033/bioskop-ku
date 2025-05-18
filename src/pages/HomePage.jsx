import { useEffect, useState } from "react";
import { localhost } from "../config/localhost";
import {
    Nav,
    Navbar,
    Container,
    Form,
    Button,
    Image,
    Card,
    Col,
    Row,
    Spinner,
    Alert,
    Carousel
} from 'react-bootstrap';

export default function HomePage() {
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSchedules = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${localhost}/schedule/`);
            const data = await response.json();

            if (response.ok) {
                setSchedules(data.schedules || []);
            } else {
                setError("Gagal mengambil data jadwal.");
            }
        } catch (err) {
            setError("Terjadi kesalahan dalam mengambil data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    return (
        <>
            {/* Navbar */}
            <Navbar bg="primary" data-bs-theme="dark" expand="lg" fixed="top">
                <Container>
                    <Navbar.Brand href="#">
                        <Image src="logo192.png" width="30" height="30" className="me-2" />
                        Bioskop-Ku
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/home">Beranda</Nav.Link>
                            <Nav.Link href="#films">Film</Nav.Link>
                            <Nav.Link href="#studio">Studio</Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Cari Film"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="light">Cari</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Content */}
            <Container style={{ marginTop: '90px' }}>
                {/* Loading Spinner */}
                {isLoading && (
                    <div className="text-center my-4">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                )}

                {/* Schedule List */}
                {!isLoading && !error && schedules.length > 0 && (
                    <>
                        {/* Featured Movie Banner - Using first schedule as featured */}
                        <Carousel className="mb-5">
                            {schedules.slice(0, 2).map((schedule) => (
                                <Carousel.Item key={schedule.id} interval={4000}>
                                    <div
                                        className="d-block w-100"
                                        style={{
                                            height: '400px',
                                            backgroundImage: `url(${schedule.movie_poster || "https://via.placeholder.com/1200x400?text=Movie+Banner"})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                    <Carousel.Caption className="bg-dark bg-opacity-75 rounded p-3">
                                        <h3>{schedule.movie_title}</h3>
                                        <p>
                                            Studio: {schedule.studio_name} |
                                            Jam Tayang: {new Date(schedule.show_time).toLocaleString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            ))}
                        </Carousel>

                        <br></br>

                        <h4 className="mb-3">Jadwal Film</h4>
                        <Row>
                            {schedules.map((schedule) => (
                                <Col key={schedule.id} md={4} sm={6} className="mb-4">
                                    <Card>
                                        <Card.Img
                                            variant="top"
                                            src={schedule.movie_poster || "https://via.placeholder.com/300x400?text=No+Image"}
                                            alt={schedule.movie_title}
                                        />
                                        <Card.Body>
                                            <Card.Title>{schedule.movie_title}</Card.Title>
                                            <Card.Text>
                                                Studio: {schedule.studio_name}<br />
                                                Jam Tayang: {new Date(schedule.show_time).toLocaleString('id-ID', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Card.Text>
                                            <Button variant="primary">Pesan Tiket</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}

                {/* No Data */}
                {!isLoading && !error && schedules.length === 0 && (
                    <Alert variant="info" className="text-center">
                        Tidak ada jadwal film tersedia.
                    </Alert>
                )}
            </Container>
        </>
    );
}