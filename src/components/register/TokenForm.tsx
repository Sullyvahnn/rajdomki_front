import { useState } from 'react';
import api from '../../api/api';

interface TokenFormProps {
    email: string;
}

const TokenForm = ({ email }: TokenFormProps) => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await api.post('/auth/confirm-code', { email, token });
            setSuccess('Konto zostało utworzone! Możesz się zalogować.');
            localStorage.setItem('jwt_token', token);
        } catch (err) {
            setError('Niepoprawny token lub błąd rejestracji.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md flex flex-col gap-4 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Wpisz token z emaila</h2>
            <input
                type="text"
                placeholder="Token z emaila"
                value={token}
                onChange={e => setToken(e.target.value)}
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
                {loading ? 'Rejestracja...' : 'Zarejestruj'}
            </button>
        </form>
    );
};

export default TokenForm;
