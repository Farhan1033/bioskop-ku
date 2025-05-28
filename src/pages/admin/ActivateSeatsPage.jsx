import React, { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';

export default function ActivateSeatPage() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleActivateSeats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/seats/activate/', {
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

  return (
    <Container style={{ marginTop: '15vh' }}>
      <h2 className="mb-4">Aktivasi Semua Kursi</h2>

      {alertMessage && <Alert variant="success">{alertMessage}</Alert>}

      <Button
        variant="success"
        onClick={handleActivateSeats}
        disabled={loading}
      >
        {loading ? 'Mengaktifkan...' : 'Aktifkan Semua Kursi'}
      </Button>
    </Container>
  );
}
