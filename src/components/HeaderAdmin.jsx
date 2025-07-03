import { Nav, Navbar, Container, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HeadersAdmin() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Navbar bg="primary" data-bs-theme="dark" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand href="#">
                    <Image src="https://st3.depositphotos.com/1588812/13325/v/450/depositphotos_133255394-stock-illustration-vector-logo-cinema.jpg" width="30" height="30" className="me-2" />
                    Bioskop-Ku Admin
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/admin/home-admin">Beranda</Nav.Link>
                        <Nav.Link href="/admin/add-movie">Tambah Film</Nav.Link>
                        <Nav.Link href="/admin/add-schedule">Tambah Jadwal</Nav.Link>
                        <Nav.Link href="/admin/activate-all-seats">Aktifasi Kursi</Nav.Link>
                    </Nav>
                    <div className="d-flex gap-2">
                        <Button variant="danger" onClick={handleLogout}>Keluar</Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default HeadersAdmin;
