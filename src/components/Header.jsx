import { Nav, Navbar, Container, Form, Image, Button } from "react-bootstrap";

function Headers() {
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
                        <Nav.Link href="#films">Film</Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Cari Film"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="light">Cari</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Headers;