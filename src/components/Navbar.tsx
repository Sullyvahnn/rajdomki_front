import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import male_logo from '../assets/male_logo.png';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-left">
                <img src={male_logo} alt="Logo" className="nav-logo" />
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/manage-group">Group Info</Link>
                <Link to="/login">Login</Link>
            </div>
            <div className="nav-user">{user?.email ?? 'Nikt zalogowany'}</div>
        </nav>
    );
};

export default Navbar;
