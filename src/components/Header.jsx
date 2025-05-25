import { Nav, Navbar, Container, Form, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Headers() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

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
                        <Nav.Link href="/home">Beranda</Nav.Link>
                        <Nav.Link href="/history">History</Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Cari Film"
                            className="me-2"
                            aria-label="Search"
                        />
                        <div className="d-flex gap-2">
                            <Button variant="light">Cari</Button>
                            <Button variant="danger" onClick={handleLogout}>Logout</Button>
                        </div>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Headers;