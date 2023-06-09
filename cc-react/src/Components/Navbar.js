/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import { Container } from 'react-bootstrap'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

const NavbarCustom = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Link className='navbar-brand' to="/"><img width={"35rem"} alt="logo" src='logo.jpg'/>Team 23</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" activeKey={window.location.pathname}>
                        <Link className='nav-link'  to="/">Home</Link>
                        <Link className='nav-link' to='/trending'>Treding in Twitter</Link>
                        <Link className='nav-link' to='/map'>Happiness across Victoria</Link>
                        <Link className='nav-link' to='/visuals'>Topic of Interest</Link>
                        <Link className='nav-link' to='/stream'>Twitter Stream</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarCustom;