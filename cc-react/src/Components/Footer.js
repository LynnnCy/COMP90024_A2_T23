import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer class="py-3 my-4">
            <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                <li class="nav-item"><Link className='nav-link' to="/">Home</Link></li>
                <li class="nav-item"><Link className='nav-link' to='/today'>Today</Link></li>
                <li class="nav-item"><Link className='nav-link' to='/map'>Map</Link></li>
            </ul>
            <p class="text-center text-muted">© 2023 Team 23</p>
        </footer>
    );
}

export default Footer;