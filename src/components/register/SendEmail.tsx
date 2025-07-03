import { useEffect, useState } from 'react';
import api from '../../api/api';
import { SendEmailResponse } from '../../types';

interface SendEmailComponentProps {
    onSuccess: () => void;
    email: string;
    setEmail: (email: string) => void;
}

const SendEmailComponent = ({ onSuccess, email, setEmail }: SendEmailComponentProps) => {
    const [emailData, setEmailData] = useState<SendEmailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/request-code', { email });
            setEmailData(res.data);
            onSuccess();
        } catch (err) {
            setError('Nie udało się wysłać emaila.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSend} className="bg-white p-8 rounded shadow-md flex flex-col gap-4 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Rejestracja</h2>
            <input
                type="email"
                placeholder="Adres email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border p-2 rounded"
                required
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? 'Wysyłanie...' : 'Wyślij token na email'}
            </button>
        </form>
    );
};

export default SendEmailComponent;