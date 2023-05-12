import { useState } from 'react';
import Nav from 'react-bootstrap/Nav';

const Navbar = () => {
    const [activeKey, setActiveKey] = useState('/')
    return (
        <Nav
            activeKey={activeKey}
            onSelect={(selectedKey) => setActiveKey(selectedKey)}
        >
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href='/today' eventKey="today">Today</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href='/map' eventKey="map">Map</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default Navbar;