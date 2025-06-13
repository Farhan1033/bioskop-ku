import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useState, useCallback } from 'react';
import { useSeats } from '../context/SeatContext';
import { useBooking } from '../context/BookingContext';
import TimeFormater from '../utils/TimeFormater';
import { localhost } from '../config/localhost';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats } = useSeats();
  const { scheduleId, idBooking } = useBooking();
  const { quantity, totalPrice } = location.state;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${localhost}/reservation/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: idBooking,
          seat_ids: selectedSeats.map(seat => seat.id),
        }),
      });

      if (!response.ok) throw new Error('Gagal saat post data reservasi.');

      await response.json();
      navigate(`/receipt`);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat checkout.');
    } finally {
      setIsLoading(false);
    }
  }, [idBooking, selectedSeats, navigate]);

  if (!scheduleId || !idBooking || selectedSeats.length === 0) {
    return (
      <Container className="my-5">
        <h2>Informasi booking tidak lengkap</h2>
        <Link to="/home">Kembali ke Beranda</Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Link to="/home" className="btn btn-primary mb-3">&larr; Kembali ke Home</Link>
      <h2>Checkout</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="p-3 mb-4 shadow-sm">
        <p><strong>Judul Film:</strong> {scheduleId.movie_title}</p>
        <p><strong>Jam Tayang:</strong> {TimeFormater(scheduleId.show_time)}</p>
        <p><strong>Jumlah Tiket:</strong> {quantity}</p>
        <p><strong>Kursi:</strong> {selectedSeats.map(seat => `${seat.row}${seat.seat_number}`).join(', ')}</p>
        <p><strong>Total Harga:</strong> Rp{totalPrice?.toLocaleString()}</p>
      </Card>

      <Button variant="primary" size="lg" onClick={handleConfirm} disabled={isLoading}>
        {isLoading ? 'Memproses...' : 'Checkout Tiket'}
      </Button>
    </Container>
  );
}
