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
        <div className="form-container">
            <form onSubmit={handleSend} className="form-wrapper">
                <h2 className="form-title">Rejestracja</h2>
                <input
                    type="email"
                    placeholder="Adres email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input"
                    required
                />
                {error && <div className="form-error">{error}</div>}
                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? 'Wysyłanie...' : 'Wyślij token na email'}
                </button>
            </form>
        </div>
    );
};

export default SendEmailComponent;