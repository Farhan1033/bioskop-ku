import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { localhost } from '../../config/localhost';

export default function AddSchedulePage() {
    const [movies, setMovies] = useState([]);
    const [studios, setStudios] = useState([]);
    const [formData, setFormData] = useState({
        movie_id: '',
        studio_id: '',
        show_time: '',
    });
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        fetchMovies();
        fetchStudios();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await fetch(`${localhost}/movies/admin`);
            const data = await res.json();
            setMovies(data.movie);
        } catch (error) {
            console.error('Gagal mengambil data film:', error);
        }
    };

    const fetchStudios = async () => {
        try {
            const res = await fetch(`${localhost}/studios/get-studios`);
            const data = await res.json();
            setStudios(data.studio);
        } catch (error) {
            console.error('Gagal mengambil data studio:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${localhost}/schedule/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Gagal membuat jadwal.');

            setAlertMessage('Jadwal berhasil ditambahkan!');
            setTimeout(() => setAlertMessage(null), 3000);

            // Reset form
            setFormData({
                movie_id: '',
                studio_id: '',
                show_time: '',
            });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <Container style={{ marginTop: '15vh' }}>
            <h2 className="mb-4">Tambah Jadwal Tayang</h2>

            {alertMessage && <Alert variant="success">{alertMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pilih Film</Form.Label>
                            <Form.Select
                                name="movie_id"
                                value={formData.movie_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Pilih Film --</option>
                                {movies.map((movie) => (
                                    <option key={movie.id} value={movie.id}>
                                        {movie.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Pilih Studio</Form.Label>
                            <Form.Select
                                name="studio_id"
                                value={formData.studio_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Pilih Studio --</option>
                                {studios.map((studio) => (
                                    <option key={studio.id} value={studio.id}>
                                        {studio.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Waktu Tayang</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="show_time"
                                value={formData.show_time}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Tambah Jadwal
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}
