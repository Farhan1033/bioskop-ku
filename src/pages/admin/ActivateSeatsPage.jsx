import React, { useEffect, useState } from 'react';
import { Container, Button, Alert, Col, Row, Form } from 'react-bootstrap';
import { localhost } from '../../config/localhost';

export default function ActivateSeatPage() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    schedule_id: '',
  });

  const handleActivateSeats = async () => {
    if (!formData.schedule_id) {
      alert('Silakan pilih jadwal terlebih dahulu.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${localhost}/seats/activate/${formData.schedule_id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Gagal mengaktifkan semua kursi.');
      }

      setAlertMessage('Semua kursi berhasil diaktifkan!');
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedulesFromBookings = async () => {
    try {
      const res = await fetch(`${localhost}/bookings/data-admin`);
      const data = await res.json();

      const bookingList = data.booking || [];

      const uniqueSchedules = Array.from(
        new Map(bookingList.map(item => [item.schedule_id, item])).values()
      );
  
      setSchedules(uniqueSchedules);
    } catch (error) {
      console.error('Gagal mengambil data bookings:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchSchedulesFromBookings();
  }, []);

  return (
    <Container style={{ marginTop: '15vh' }}>
      <h2 className="mb-4">Aktivasi Kursi Berdasarkan Jadwal</h2>

      {alertMessage && <Alert variant="success">{alertMessage}</Alert>}

      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Jadwal Film</Form.Label>
              <Form.Select
                name="schedule_id"
                value={formData.schedule_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Jadwal --</option>
                {schedules.map((item) => (
                  <option key={item.schedule_id} value={item.schedule_id}>
                    {item.movie_title} - {new Date(item.show_time).toLocaleString()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button
              variant="success"
              onClick={handleActivateSeats}
              disabled={loading}
            >
              {loading ? 'Mengaktifkan...' : 'Aktifkan Kursi untuk Jadwal Ini'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
