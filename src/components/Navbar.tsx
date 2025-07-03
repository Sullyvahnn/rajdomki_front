import { useEffect, useState } from 'react';
import api from '../api/api';
import { UserData } from '../types';

const Navbar = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/user/current-user')
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                    <h1 className="text-2xl font-bold text-blue-700">CabinRes</h1>
                </div>
                <div className="flex items-center gap-8">
                    <div className="space-x-6 text-sm font-medium text-gray-600">
                        <a href="/" className="hover:text-blue-600">Home</a>
                        <a href="/group" className="hover:text-blue-600">Group Info</a>
                        <a href="/join-group" className="hover:text-blue-600">Join Group</a>
                        <a href="/login" className="hover:text-blue-600">Name Yourself</a>
                        <a href="/register" className="hover:text-blue-600">Register</a>
                    </div>
                    <div className="text-sm font-semibold text-gray-700 min-w-[120px] text-right">
                        {loading ? '...' : user && user.name ? user.name : 'Nikt zalogowany'}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
