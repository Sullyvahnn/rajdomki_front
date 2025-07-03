import { useState } from 'react';
import SendEmailComponent from './SendEmail';
import TokenForm from './TokenForm';

const LoginFlow = () => {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    // Funkcja przekazywana do SendEmailComponent, która ustawia emailSent na true po sukcesie
    const handleEmailSuccess = () => {
        setEmailSent(true);
    };

    return (
        <div className="w-full flex flex-col items-center">
            {!emailSent ? (
                <SendEmailComponent onSuccess={handleEmailSuccess} email={email} setEmail={setEmail} />
            ) : (
                <TokenForm email={email} />
            )}
        </div>
    );
};

export default LoginFlow;
