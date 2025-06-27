import { useEffect, useState } from "react";
import { Container, Table, Image, Spinner } from "react-bootstrap";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function HomeAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reservations
  useEffect(() => {
    axios.get("http://localhost:5000/api/reservation/")
      .then((res) => {
        const reservations = res.data.reservations;
        const movieMap = {};

        reservations.forEach(item => {
          if (movieMap[item.movie_title]) {
            movieMap[item.movie_title].count += 1;
          } else {
            movieMap[item.movie_title] = {
              title: item.movie_title,
              poster: item.movie_poster,
              count: 1
            };
          }
        });

        const moviesArray = Object.values(movieMap).sort((a, b) => b.count - a.count);
        setData(moviesArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Container style={{ marginTop: '15vh' }}>
      <h3 className="mb-4">🎬 Dashboard Admin</h3>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <>
          <h5 className="mb-3">📊 Film Paling Laris (Berdasarkan Jumlah Kursi Terpesan)</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>

          <h5 className="mt-5 mb-3">📋 Detail Reservasi per Film</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Poster</th>
                <th>Judul Film</th>
                <th>Total Reservasi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((movie, idx) => (
                <tr key={idx}>
                  <td>
                    <Image src={movie.poster} alt={movie.title} thumbnail style={{ width: "100px" }} />
                  </td>
                  <td>{movie.title}</td>
                  <td>{movie.count}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}
