import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import api from '../api/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        try {
            await api.post('/user/create', { email, username });
            alert(`Udało się pomyślnie zalogować jako ${username}`);
        } catch (err) {
            alert('womp womp, coś poszło nie tak');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-md mx-auto px-6 py-10 flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Logowanie</h2>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md flex flex-col gap-4 w-full">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nazwa użytkownika"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">{success}</div>}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Logowanie...' : 'Zaloguj'}
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
