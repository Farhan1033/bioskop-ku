import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert } from 'react-bootstrap';
import { localhost } from '../../config/localhost';

export default function AddMoviePage() {
    const [filmData, setFilmData] = useState({
        title: '',
        description: '',
        duration: '',
        poster_url: '',
        price: '',
        category: 'Indonesia',
    });

    const [films, setFilms] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchFilms();
    }, []);

    const fetchFilms = async () => {
        try {
            const res = await fetch(`${localhost}/movies/admin`);
            const data = await res.json();
            setFilms(data.movie.reverse());
        } catch (error) {
            console.error('Gagal mengambil data film:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilmData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const filmToSend = {
            id: editId,
            title: filmData.title,
            description: filmData.description,
            duration: parseInt(filmData.duration),
            category: filmData.category,
            price: parseInt(filmData.price),
            poster_url: filmData.poster_url,
        };

        const url = isEditing
            ? `${localhost}/movies/update-movies`
            : `${localhost}/movies/add-movies`;

        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filmToSend),
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Gagal mengupdate film.' : 'Gagal menambahkan film.');
            }

            setAlertMessage(isEditing ? 'Film berhasil diupdate!' : 'Film berhasil ditambahkan!');
            setTimeout(() => setAlertMessage(null), 3000);

            setFilmData({
                title: '',
                description: '',
                duration: '',
                poster_url: '',
                price: '',
                category: 'Indonesia',
            });
            setIsEditing(false);
            setEditId(null);
            fetchFilms();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Apakah kamu yakin ingin menghapus film ini?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${localhost}/movies/delete-movies`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error('Gagal menghapus film.');

            setAlertMessage('Film berhasil dihapus!');
            setTimeout(() => setAlertMessage(null), 3000);
            fetchFilms();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEdit = (film) => {
        setFilmData({
            title: film.title,
            description: film.description,
            duration: film.duration.toString(),
            poster_url: film.poster_url,
            price: film.price.toString(),
            category: film.category,
        });
        setIsEditing(true);
        setEditId(film.id);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setFilmData({
            title: '',
            description: '',
            duration: '',
            poster_url: '',
            price: '',
            category: 'Indonesia',
        });
    };

    return (
        <Container className="my-5">
            <h2 className="mb-4" style={{ marginTop: '15vh' }}>Manajemen Film</h2>
            <Row>
                <Col md={5}>
                    {alertMessage && <Alert variant="success">{alertMessage}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Judul Film</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Masukkan judul film"
                                name="title"
                                value={filmData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Masukkan deskripsi film"
                                name="description"
                                value={filmData.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Durasi (menit)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Masukkan durasi film"
                                name="duration"
                                value={filmData.duration}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Poster URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Masukkan link poster"
                                name="poster_url"
                                value={filmData.poster_url}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Harga Tiket (Rp)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Masukkan harga tiket"
                                name="price"
                                value={filmData.price}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Kategori</Form.Label>
                            <Form.Select
                                name="category"
                                value={filmData.category}
                                onChange={handleChange}
                            >
                                <option value="Indonesia">Indonesia</option>
                                <option value="Internasional">Internasional</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {isEditing ? 'Update Film' : 'Tambah Film ke Server'}
                        </Button>
                        {isEditing && (
                            <Button
                                variant="secondary"
                                className="ms-2"
                                onClick={handleCancelEdit}
                            >
                                Batal Edit
                            </Button>
                        )}
                    </Form>
                </Col>

                <Col md={7}>
                    <h4 className="mb-3">Daftar Film</h4>
                    {films.length === 0 ? (
                        <p>Belum ada film ditambahkan.</p>
                    ) : (
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Judul</th>
                                    <th>Durasi</th>
                                    <th>Harga</th>
                                    <th>Kategori</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {films.map((film, index) => (
                                    <tr key={film.id}>
                                        <td>{index + 1}</td>
                                        <td>{film.title}</td>
                                        <td>{film.duration} menit</td>
                                        <td>Rp {parseInt(film.price).toLocaleString()}</td>
                                        <td>{film.category}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(film)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(film.id)}
                                            >
                                                Hapus
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    );
}
