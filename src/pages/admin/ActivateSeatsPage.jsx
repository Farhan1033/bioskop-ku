import React, { useEffect, useState } from 'react';
import { Container, Button, Alert, Col, Row, Form } from 'react-bootstrap';
import { localhost } from '../../config/localhost';

export default function ActivateSeatPage() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studios, setStudios] = useState([]);
  const [formData, setFormData] = useState({
    studio_id: '',
  });

  const handleActivateSeats = async () => {
    if (!formData.studio_id) {
      alert('Silakan pilih studio terlebih dahulu.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${localhost}/seats/activate/${formData.studio_id}`, {
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

  const fetchStudios = async () => {
    try {
      const res = await fetch(`${localhost}/studios/get-studios`);
      const data = await res.json();
      setStudios(data.studio || []);
    } catch (error) {
      console.error('Gagal mengambil data studio:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  return (
    <Container style={{ marginTop: '15vh' }}>
      <h2 className="mb-4">Aktivasi Semua Kursi</h2>

      {alertMessage && <Alert variant="success">{alertMessage}</Alert>}

      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Studio</Form.Label>
              <Form.Select
                name="studio_id"
                value={formData.studio_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Studio --</option>
                {studios.map((studio) => (
                  <option key={studio.id} value={studio.id}>
                    {studio.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button
              variant="success"
              onClick={handleActivateSeats}
              disabled={loading}
            >
              {loading ? 'Mengaktifkan...' : 'Aktifkan Semua Kursi'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
