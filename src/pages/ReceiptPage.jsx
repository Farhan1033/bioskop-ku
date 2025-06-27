import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { localhost } from '../config/localhost';
import { useBooking } from '../context/BookingContext';

const ReceiptPage = () => {
  const [reservationData, setReservationData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();               // ⬅️ untuk mengambil paymentMethod
  const { idBooking } = useBooking();

  /* ---------- payment method & random account ---------- */
  const paymentMethod = location.state?.paymentMethod || 'Transfer Bank';

  const [accountNumber, setAccountNumber] = useState('');
  const generateRandomDigits = (len) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');

  useEffect(() => {
    // buat nomor acak hanya sekali
    if (!accountNumber) {
      if (paymentMethod === 'Transfer Bank') setAccountNumber(generateRandomDigits(12));
      else if (paymentMethod === 'E-Wallet') setAccountNumber('08' + generateRandomDigits(10));
      else if (paymentMethod === 'Kartu Kredit/Debit')
        setAccountNumber(generateRandomDigits(16).replace(/(\d{4})(?=\d)/g, '$1 '));
      else setAccountNumber(generateRandomDigits(9)); // default
    }
  }, [paymentMethod, accountNumber]);

  /* ---------- fetch data reservasi ---------- */
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await fetch(`${localhost}/reservation/booking/${idBooking}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const result = await res.json();

        if (result && result.reservationData) {
          const grouped = result.reservationData.reduce((acc, item) => {
            const key = `${item.show_time}-${item.studio_name}`;
            if (!acc[key]) acc[key] = { ...item, seats: [] };
            acc[key].seats.push(`${item.seat_row}${item.seat_number}`);
            return acc;
          }, {});
          setReservationData(Object.values(grouped));
        }
        setLoading(false);
      } catch (error) {
        console.error('Gagal mengambil data receipt:', error);
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [idBooking]);

  /* ---------- kembali ke beranda ---------- */
  const handleBack = () => navigate('/');

  /* ---------- UI: loader / error ---------- */
  if (loading)
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" /> <p>Loading receipt...</p>
      </Container>
    );

  if (!reservationData.length)
    return (
      <Container className="my-5">
        <Alert variant="warning">Tidak ada data reservasi ditemukan.</Alert>
      </Container>
    );

  /* ---------- MAIN RENDER ---------- */
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ marginTop: '15vh' }}>
        Tiket untuk {reservationData[0].movie_title}
      </h2>

      {/* info pembayaran */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Informasi Pembayaran</h5>
          <p>
            <strong>Metode:</strong> {paymentMethod}
          </p>
          <p>
            <strong>
              {paymentMethod === 'Transfer Bank'
                ? 'Nomor Rekening'
                : paymentMethod === 'E-Wallet'
                ? 'Nomor E-Wallet'
                : 'Kode Pembayaran'}
              :
            </strong>{' '}
            {accountNumber}
          </p>
          <Alert variant="info" className="mt-3">
            Silakan transfer sesuai total harga ke nomor di atas sebelum 1 × 24 jam.
          </Alert>
        </Card.Body>
      </Card>

      {/* daftar tiket */}
      {reservationData.map((info, idx) => (
        <Card key={`${info.show_time}-${idx}`} className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="mb-3">
              <Col md={4} className="d-flex justify-content-center">
                <img
                  src={info.poster_url}
                  alt={info.movie_title}
                  className="img-fluid rounded"
                  style={{ maxHeight: '250px' }}
                />
              </Col>
              <Col md={8}>
                <p>
                  <strong>Studio:</strong> {info.studio_name}
                </p>
                <p>
                  <strong>Jam Tayang:</strong>{' '}
                  {new Date(info.show_time).toLocaleString()}
                </p>
                <div className="mb-2">
                  <strong>Kursi:</strong>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {info.seats.map((seat) => (
                      <Badge key={seat} bg="secondary" pill>
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p>
                  <strong>Total Kursi:</strong> {info.seats.length}
                </p>
                {info.total_price && (
                  <p>
                    <strong>Total Harga:</strong> Rp
                    {Number(info.total_price).toLocaleString()}
                  </p>
                )}
                <p>
                  <strong>Status:</strong>{' '}
                  <Badge bg={info.status === 'completed' ? 'success' : 'warning'}>
                    {info.status}
                  </Badge>
                </p>
                <p>
                  <strong>Dibooking:</strong>{' '}
                  {new Date(info.reserved_at).toLocaleString()}
                </p>
              </Col>
            </Row>

            {/* barcode sederhana */}
            <div className="mt-4">
              <div
                className="d-flex justify-content-center mb-2"
                style={{ height: 50 }}
              >
                {info.id
                  .replace(/[^0-9a-f]/g, '')
                  .slice(0, 20)
                  .split('')
                  .map((ch, i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        height: parseInt(ch, 16) * 3 + 20,
                        marginRight: 2,
                        backgroundColor: i % 2 ? '#000' : '#333',
                      }}
                    />
                  ))}
              </div>
              <p className="text-center text-muted small">
                Tunjukkan barcode ini ke kasir.
              </p>
            </div>
          </Card.Body>
        </Card>
      ))}

      <div className="text-center mt-3">
        <Button variant="primary" onClick={handleBack} size="lg">
          Kembali ke Beranda
        </Button>
      </div>
    </Container>
  );
};

export default ReceiptPage;