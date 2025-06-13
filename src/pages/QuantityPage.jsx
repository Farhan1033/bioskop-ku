import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import DateFormater from '../utils/DateFormater';
import TimeFormater from '../utils/TimeFormater';

export default function QuantityPage() {
    const navigate = useNavigate();
    const { scheduleId } = useBooking();

    // State lokal untuk quantity
    const [quantity, setQuantity] = useState(1);

    const increment = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1);
        } else {
            window.alert('Maaf, Anda hanya dapat memesan maksimal 10 kursi.');
        }
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleNext = () => {
        navigate(`/seats/${scheduleId.studio_id}`, { state: quantity });
    };

    return (
        <Container className="my-5">
            <Button
                variant="primary"
                onClick={() => navigate(`/booking-movie/${scheduleId.movie_id}`)}
                className="mb-3"
            >
                &larr; Kembali ke Jam Tayang
            </Button>
            <h2 className="mb-4">Pilih Kuantitas</h2>
            <Row className="justify-content-center align-items-center">
                <Col xs="auto">
                    <Button
                        variant="outline-danger"
                        size="lg"
                        onClick={decrement}
                        aria-label="Decrease quantity"
                    >-</Button>
                </Col>
                <Col xs="auto">
                    <span className="fs-1">{quantity}</span>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="outline-danger"
                        size="lg"
                        onClick={increment}
                        aria-label="Increase quantity"
                    >+</Button>
                </Col>
            </Row>
            <div className="mt-4">
                <Button
                    variant="danger"
                    size="lg"
                    onClick={handleNext}
                    style={{ width: '100%' }}
                >Konfirmasi Kuantitas</Button>
            </div>

            <Card className="mt-4" style={{ backgroundColor: '#f7f7f7' }}>
                <Card.Body>
                    <Card.Title>RINGKASAN PESANAN</Card.Title>
                    <Card.Text>
                        <strong>{scheduleId.movie_title} - {scheduleId.studio_name}</strong>
                        <br />
                        <i className="bi bi-geo-alt"></i> Studio: {scheduleId.studio_name}
                        <br />
                        <i className="bi bi-calendar"></i>
                        Jadwal: {DateFormater(scheduleId.show_time)} - {TimeFormater(scheduleId.show_time)}
                        <br />
                        <strong>Kuantitas: </strong>{quantity}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
}
