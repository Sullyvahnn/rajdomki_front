import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginFlow from '../components/register/LoginFlow';

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center w-full">
                <LoginFlow />
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
