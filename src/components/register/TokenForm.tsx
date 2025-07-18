import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

interface TokenFormProps {
    email?: string;
}

const TokenForm = ({ email }: TokenFormProps) => {
    const [token, setToken] = useState('');
    const [name, setName] = useState('');
    const [step, setStep] = useState<'email_token' | 'create_user'>('email_token');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { setUser } = useAuth(); // ✅ use setUser

    const handleEmailTokenSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Step 1: Confirm token and get JWT
            const response = await api.post('/auth/confirm-code', { token });
            const jwtToken = response.data.token;
            sessionStorage.setItem('jwt_token', jwtToken);

            // Step 2: Try to fetch current user
            try {
                const userResponse = await api.get('/user/current-user');
                setUser(userResponse.data); // ✅ update context with user only
                navigate('/');
            } catch (userErr: any) {
                if (userErr.response?.status === 404) {
                    setStep('create_user');
                    return;
                } else if ([401, 422].includes(userErr.response?.status)) {
                    throw new Error('Niepoprawny lub wygasły token JWT.');
                } else {
                    throw new Error('Błąd podczas pobierania użytkownika.');
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(
                err.response?.data?.message || err.message || 'Błąd podczas weryfikacji tokenu.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!name.trim()) {
                throw new Error('Imię jest wymagane.');
            }

            const createResponse = await api.post('/user/create', {
                name,
                email,
            });

            const jwtToken = sessionStorage.getItem('jwt_token') || '';
            setUser(createResponse.data); // ✅ update context with user only
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(
                err.response?.data?.message || err.message || 'Błąd podczas tworzenia konta.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='form-container'>
            <form
                onSubmit={step === 'email_token' ? handleEmailTokenSubmit : handleCreateUserSubmit}
                className="form-wrapper"
            >
                <h2 className="form-title">
                    {step === 'email_token' ? 'Wprowadź token z emaila' : 'Utwórz konto'}
                </h2>

                {step === 'email_token' && (
                    <input
                        type="text"
                        placeholder="Token z emaila"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="form-input"
                        required
                    />
                )}

                {step === 'create_user' && (
                    <>
                        <div className="form-label-static">
                            Dla: <strong>{email}</strong>
                        </div>
                        <input
                            type="text"
                            placeholder="Twoje imię"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            required
                        />
                    </>
                )}

                {error && <div className="form-error">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}

                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading
                        ? 'Przetwarzanie...'
                        : step === 'email_token'
                            ? 'Zatwierdź token'
                            : 'Utwórz konto'}
                </button>
            </form>
        </div>
    );
};

export default TokenForm;
