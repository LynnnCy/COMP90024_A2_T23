import { useState } from 'react';
import { Container } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavbarCustom = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">Team 23</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" activeKey={window.location.pathname}>
                        <Nav.Link  href="/">Home</Nav.Link>
                        <Nav.Link  href='/today'>Today</Nav.Link>
                        <Nav.Link href='/map'>Map</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        // <Nav
        //     activeKey={activeKey}
        //     
        // >
        //     <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        //     <Nav.Item>
        //         <Nav.Link href="/">Home</Nav.Link>
        //     </Nav.Item>
        //     <Nav.Item>
        //         <Nav.Link href='/today' eventKey="today">Today</Nav.Link>
        //     </Nav.Item>
        //     <Nav.Item>
        //         <Nav.Link href='/map' eventKey="map">Map</Nav.Link>
        //     </Nav.Item>
        // </Nav>
    );
}

export default NavbarCustom;