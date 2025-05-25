import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useState, useEffect, useCallback } from 'react';
import { useSeats } from '../context/SeatContext';
import { useBooking } from '../context/BookingContext';
import TimeFormater from '../utils/TimeFormater';
import { localhost } from '../config/localhost';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedSeats } = useSeats();
  const { scheduleId, showtime } = useBooking();
  const location = useLocation();
  const data = location.state;
  const userId = localStorage.getItem('user_id');

  const postDataReceipt = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${localhost}/reservation/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          schedule_id: scheduleId.id,
          seat_ids: selectedSeats.map(seat => seat.id),
          total_price: data.totalPrice
        })
      });

      if (!response.ok) {
        throw new Error('Gagal saat post data');
      }

      const result = await response.json();
      console.log(result);
      return result; // Mengembalikan hasil response untuk digunakan di handleConfirm
    } catch (error) {
      setError(error.message);
      throw error; // Melempar error untuk ditangkap di handleConfirm
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId.id, selectedSeats]); // Menambahkan dependencies

  useEffect(() => {
  }, [showtime, selectedSeats]);

  // Validasi awal
  if (!scheduleId?.movie_title || !selectedSeats || selectedSeats.length === 0) {
    return (
      <Container className="my-5">
        <h2>Booking information incomplete</h2>
        <Link to="/home">Back to films</Link>
      </Container>
    );
  }

  const handleConfirm = async () => {
    try {
      await postDataReceipt();
      navigate(`/reciept/${userId}`);
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <Container className="my-5">
      <Link to={"/home"} className="btn btn-primary mb-3">&larr; Back to Home</Link>
      <h2>Checkout</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <Card className="p-3 mb-4 shadow-sm">
        <p><strong>Title: </strong>{scheduleId.movie_title}</p>
        <p><strong>Showtime: </strong>{TimeFormater(scheduleId.show_time)}</p>
        <p><strong>Quantity: </strong> {data?.quantity}</p>
        <p><strong>Seats: </strong>
          {selectedSeats.map(seat => `${seat.row}${seat.seat_number}`).join(', ')}
        </p>
        <p><strong>Total Price: </strong> Rp{data?.totalPrice?.toLocaleString()}</p>
      </Card>

      <Button
        variant="primary"
        size="lg"
        onClick={handleConfirm}
        className="mt-3"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Checkout Ticket'}
      </Button>
    </Container>
  );
}