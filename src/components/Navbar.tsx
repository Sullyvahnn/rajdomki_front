import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="w-32 h-12 object-contain" />
                    <h1 className="text-2xl font-bold text-blue-700">CabinRes</h1>
                </div>
                <div className="flex items-center gap-8">
                    <div className="space-x-6 text-sm font-medium text-gray-600">
                        <Link to="/" className="hover:text-blue-600">Home</Link>
                        <Link to="/manage-group" className="hover:text-blue-600">Group Info</Link>
                        <Link to="/login" className="hover:text-blue-600">Login</Link>
                    </div>
                    <div className="text-sm font-semibold text-gray-700 min-w-[120px] text-right">
                        {user?.email ?? 'Nikt zalogowany'}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
