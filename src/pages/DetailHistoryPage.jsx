import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Badge,
} from 'react-bootstrap';
import { localhost } from '../config/localhost';
import TimeFormater from '../utils/TimeFormater';

export default function DetailHistoryPage() {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  /* ------------------------------------------------------------------ */
  /*  FETCH DATA                                                        */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${localhost}/reservation/booking/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error('Failed to fetch reservation data');

        // --- respons API: { reservationData: [...] }
        const { reservationData: reservations = [] } = await response.json();

        if (reservations.length === 0) {
          setReservationData(null);
        } else {
          const reservation = reservations[0]; // 1 booking, banyak seat
          const seats = reservations.map(
            (r) => `${r.seat_row}${r.seat_number}`
          );
          setReservationData({ ...reservation, seats });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, [id]);

  /* ------------------------------------------------------------------ */
  /*  STATE HANDLING                                                    */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
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
          <Link to="/history" className="btn btn-primary">
            Kembali ke histori
          </Link>
        </Alert>
      </Container>
    );
  }

  if (!reservationData) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          <h4>No reservations found.</h4>
          <Link to="/history" className="btn btn-primary">
            Kembali ke histori
          </Link>
        </Alert>
      </Container>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  DESTRUCTURING                                                     */
  /* ------------------------------------------------------------------ */
  const {
    movie_title,
    poster_url,
    studio_name,
    show_time,
    status,
    reserved_at,
    seats,
    total_price,
    id: reservationId,
  } = reservationData;

  const handleFinish = () => navigate('/history');

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ marginTop: '15vh' }}>
        Detail Tiket {movie_title}
      </h2>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col
              md={4}
              className="d-flex align-items-center justify-content-center"
            >
              <img
                src={poster_url}
                alt={movie_title}
                className="img-fluid rounded"
                style={{ maxHeight: '250px' }}
              />
            </Col>
            <Col md={8}>
              {/* Studio */}
              <Card.Text>
                <strong>Studio:</strong> {studio_name}
              </Card.Text>

              {/* Jam tayang */}
              <Card.Text>
                <strong>Jam Tayang:</strong> {TimeFormater(show_time)}
              </Card.Text>

              {/* Kursi – label dan badge dipisah agar tak ada div di dalam p */}
              <Card.Text>
                <strong>Kursi:</strong>
              </Card.Text>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {seats.map((seat) => (
                  <Badge key={seat} bg="secondary" pill>
                    {seat}
                  </Badge>
                ))}
              </div>

              {/* Total harga */}
              {total_price && (
                <Card.Text>
                  <strong>Total harga:</strong> Rp{total_price.toLocaleString()}
                </Card.Text>
              )}

              {/* Status */}
              <Card.Text>
                <strong>Status:</strong>{' '}
                <Badge bg={status === 'completed' ? 'success' : 'warning'}>
                  {status}
                </Badge>
              </Card.Text>

              {/* Waktu pemesanan */}
              <Card.Text>
                <strong>Dipesan saat:</strong>{' '}
                {new Date(reserved_at).toLocaleString()}
              </Card.Text>
            </Col>
          </Row>

          {/* Barcode sederhana */}
          <div className="mt-4">
            <div
              className="d-flex justify-content-center mb-2"
              style={{ height: 50 }}
            >
              {reservationId
                .replace(/[^0-9a-f]/g, '')
                .split('')
                .slice(0, 20)
                .map((ch, idx) => (
                  <div
                    key={`barcode-${idx}`}
                    style={{
                      width: 4,
                      height: parseInt(ch, 16) * 3 + 20,
                      marginRight: 2,
                      backgroundColor: idx % 2 === 0 ? '#000' : '#333',
                    }}
                  />
                ))}
            </div>
            <p className="text-center text-muted small">
              Tunjukkan barcode ini kepada petugas kasir.
            </p>
          </div>
        </Card.Body>
      </Card>

      <div className="text-center mt-3">
        <Button variant="primary" onClick={handleFinish} size="lg">
          Kembali ke histori
        </Button>
      </div>
    </Container>
  );
}
