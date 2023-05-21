import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="py-3 my-4">
            <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                <li className="nav-item"><Link className='nav-link' to="/">Home</Link></li>
                <li className="nav-item"><Link className='nav-link' to='/trending'>Treding in Twitter</Link></li>
                <li className="nav-item"><Link className='nav-link' to='/map'>Happiness across Victoria</Link></li>
                <li className="nav-item"><Link className='nav-link' to='/visuals'>Topic of Interest</Link></li>
                <li className="nav-item"><Link className='nav-link' to='/stream'>Twitter Stream</Link></li>
            </ul>
            <p className="text-center text-muted">© 2023 Team 23</p>
        </footer>
    );
}

export default Footer;