import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Alert, Form, Row, Col } from 'react-bootstrap';
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

  /* ➜ state untuk metode pembayaran (frontend-only) */
  const [paymentMethod, setPaymentMethod] = useState('');

  /* ────────── fungsi konfirmasi ────────── */
  const handleConfirm = useCallback(async () => {
    if (!paymentMethod) {
      setError('Pilih salah satu metode pembayaran.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${localhost}/reservation/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: idBooking,
          seat_ids: selectedSeats.map(seat => seat.id),
        }),
      });

      if (!response.ok) throw new Error('Gagal mengirim data reservasi.');

      await response.json();

      /* kirim metode pembayaran ke halaman struk via state (optional) */
      navigate('/receipt', { state: { paymentMethod } });
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat checkout.');
    } finally {
      setIsLoading(false);
    }
  }, [idBooking, selectedSeats, paymentMethod, navigate]);

  /* ────────── validasi awal ────────── */
  if (!scheduleId || !idBooking || selectedSeats.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2>Informasi booking tidak lengkap</h2>
        <Link to="/home">Kembali ke Beranda</Link>
      </Container>
    );
  }

  /* ────────── UI ────────── */
  return (
    <Container className="my-5">
      <Link to="/home" className="btn btn-primary mb-3">
        &larr; Kembali ke Home
      </Link>
      <h2>Checkout</h2>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Card className="p-3 mb-4 shadow-sm">
        <p><strong>Judul Film:</strong> {scheduleId.movie_title}</p>
        <p><strong>Jam Tayang:</strong> {TimeFormater(scheduleId.show_time)}</p>
        <p><strong>Jumlah Tiket:</strong> {quantity}</p>
        <p>
          <strong>Kursi:</strong>{' '}
          {selectedSeats.map(seat => `${seat.row}${seat.seat_number}`).join(', ')}
        </p>
        <p><strong>Total Harga:</strong> Rp{totalPrice?.toLocaleString()}</p>

        {/* ─── Pilihan metode pembayaran (frontend-only) ─── */}
        <Form className="mt-4">
          <Form.Label className="fw-bold">Metode Pembayaran</Form.Label>
          <Row>
            <Col sm={6} md={4}>
              <Form.Check
                type="radio"
                id="payment-transfer"
                label="Transfer Bank"
                value="Transfer Bank"
                checked={paymentMethod === 'Transfer Bank'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              <Form.Check
                type="radio"
                id="payment-ewallet"
                label="E-Wallet (OVO/Gopay/Dana)"
                value="E-Wallet"
                checked={paymentMethod === 'E-Wallet'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              <Form.Check
                type="radio"
                id="payment-cc"
                label="Kartu Kredit/Debit"
                value="Kartu Kredit/Debit"
                checked={paymentMethod === 'Kartu Kredit/Debit'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              <Form.Check
                type="radio"
                id="payment-cs"
                label="Bayar di Lokasi"
                value="Bayar di Lokasi"
                checked={paymentMethod === 'Bayar di Lokasi'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
            </Col>
          </Row>
        </Form>
      </Card>

      <Button
        variant="primary"
        size="lg"
        onClick={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? 'Memproses...' : 'Checkout Tiket'}
      </Button>
    </Container>
  );
}
