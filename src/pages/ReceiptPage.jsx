import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { localhost } from '../config/localhost';
import TimeFormater from '../utils/TimeFormater';

export default function ReceiptPage() {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${localhost}/reservation/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Gagal mendapatkan data reservasi');
        }

        const data = await response.json();
        setReservationData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, [userId]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading reservation data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <h4>Error</h4>
          <p>{error}</p>
          <Link to="/home" className="btn btn-primary">Back to Home</Link>
        </Alert>
      </Container>
    );
  }

  if (!reservationData || reservationData.reservations.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          <h4>No reservation found</h4>
          <Link to="/home" className="btn btn-primary">Back to Home</Link>
        </Alert>
      </Container>
    );
  }

  // Ambil data pertama sebagai contoh (bisa disesuaikan jika ingin menampilkan semua)
  const reservation = reservationData.reservations[0];
  const barcodeText = reservation.id.replace(/[^0-9a-f]/g, '');

  const handleFinish = () => {
    navigate('/home');
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Booking Confirmation</h2>
      
      <Card className="p-4 shadow-sm mb-4">
        <div className="text-center mb-3">
          <img 
            src={reservation.poster_url} 
            alt={reservation.movie_title} 
            style={{ maxHeight: '200px', maxWidth: '100%' }}
          />
        </div>
        
        <h3 className="text-center mb-3">{reservation.movie_title}</h3>
        
        <Card className="p-3 mb-3">
          <p><strong>Reservation ID:</strong> {reservation.id}</p>
          <p><strong>Studio:</strong> {reservation.studio_name}</p>
          <p><strong>Showtime:</strong> {TimeFormater(reservation.show_time)}</p>
          <p><strong>Seat:</strong> {reservation.row}{reservation.seat_number}</p>
          <p><strong>Total Price:</strong> Rp{reservation.total_price.toLocaleString()}</p>
          <p><strong>Status:</strong> <span className="text-capitalize">{reservation.status}</span></p>
          <p><strong>Reserved at:</strong> {new Date(reservation.reserved_at).toLocaleString()}</p>
        </Card>

        {/* Barcode */}
        <div className="d-flex justify-content-center my-4" style={{ height: 50 }}>
          {barcodeText.split('').slice(0, 20).map((ch, idx) => (
            <div
              key={idx}
              style={{
                width: 4,
                height: parseInt(ch, 16) * 3 + 20,
                marginRight: 2,
                backgroundColor: idx % 2 === 0 ? '#000' : '#333',
              }}
            />
          ))}
        </div>

        <p className="text-center text-muted" style={{ fontSize: 12 }}>
          Show this barcode to redeem your tickets
        </p>
      </Card>

      <div className="text-center">
        <Button variant="primary" onClick={handleFinish} size="lg">
          Finish
        </Button>
      </div>
    </Container>
  );
}