import { useState, useEffect } from "react";
import { localhost } from "../config/localhost.js";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [userLogin, setUserLogin] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserLogin({
            ...userLogin,
            [name]: value
        });
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/home')
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!userLogin.email || !userLogin.password) {
            setError('Silahkan input semua field!');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${localhost}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userLogin)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login gagal!');
            }

            if (!data.token || !data.role) {
                throw new Error('Data login tidak lengkap.');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.id);
            localStorage.setItem('role', data.role);

            setSuccess('Berhasil login!');
            setUserLogin({ email: '', password: '' });

            setTimeout(() => {
                if (data.role === 'admin') {
                    navigate('/admin/home-admin');
                } else if (data.role === 'user') {
                    navigate('/home');
                } else {
                    navigate('/');
                }
            }, 1000);

        } catch (error) {
            setError(error.message || 'Terjadi kesalahan saat login, silahkan coba lagi');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100" style={{ maxWidth: '400px' }}>
                <Col>
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Masukkan email"
                                value={userLogin.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Masukkan password"
                                value={userLogin.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={isLoading} className="w-100">
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    {' '}Loading...
                                </>
                            ) : 'Login'}
                        </Button>
                        <p className="mt-3 text-center">
                            Belum punya akun? <a href="/register">Daftar di sini</a>
                        </p>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}