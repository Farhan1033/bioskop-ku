import { Nav, Navbar, Container, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HeadersAdmin() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <Navbar bg="primary" data-bs-theme="dark" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand href="#">
                    <Image src="logo192.png" width="30" height="30" className="me-2" />
                    Bioskop-Ku
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/admin/home-admin">Beranda</Nav.Link>
                        <Nav.Link href="/admin/add-movie">Add Movie</Nav.Link>
                        <Nav.Link href="/admin/add-schedule">Add Schedule</Nav.Link>
                        <Nav.Link href="/admin/activate-all-seats">Activate Seats</Nav.Link>
                    </Nav>
                        <div className="d-flex gap-2">
                            <Button variant="danger" onClick={handleLogout}>Logout</Button>
                        </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default HeadersAdmin;
