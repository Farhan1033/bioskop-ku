import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { setQuantity } from '../store';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { useBooking } from '../context/BookingContext';
import DateFormater from '../utils/DateFormater';
import TimeFormater from '../utils/TimeFormater';

export default function QuantityPage() {
    //   const quantity = useSelector((state) => state.booking.quantity);
    const navigate = useNavigate();
    const { scheduleId } = useBooking();

    const increment = () => {
        // if (quantity < 10) {
        //     dispatch(setQuantity(quantity + 1));
        // } else {
        //     window.alert('Maaf, Anda hanya dapat memesan maksimal 10 kursi.');
        // }
    };

    const decrement = () => {
        // if (quantity > 1) dispatch(setQuantity(quantity - 1));
    };

    const handleNext = () => {
        navigate('/seat');
    };

    return (
        <Container className="my-5">
            <Button
                variant="primary"
                onClick={() => navigate(`/booking-movie/${scheduleId.movie_id}`)}
                className="mb-3"
            >
                &larr; Back to Showtime
            </Button>
            <h2 className="mb-4">Select Quantity</h2>
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
                    <span className="fs-1"></span>
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
                >CONFIRM QUANTITY</Button>
            </div>

            <Card className="mt-4" style={{ backgroundColor: '#f7f7f7' }}>
                <Card.Body>
                    <Card.Title>ORDER SUMMARY</Card.Title>
                    <Card.Text>
                        <strong>{scheduleId.movie_title} - {scheduleId.studio_name}</strong>
                        <br />
                        <i className="bi bi-geo-alt"></i> Studio: {scheduleId.studio_name}
                        <br />
                        <i className="bi bi-calendar"></i>
                        Schedule: {DateFormater(scheduleId.show_time)} - {TimeFormater(scheduleId.show_time)}
                        <br />
                        <strong>Quantity: </strong>
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
}
