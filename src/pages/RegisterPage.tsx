import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterFlow from '../components/register/RegisterFlow';

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center w-full">
                <RegisterFlow />
            </main>
            <Footer />
        </div>
    );
};

export default RegisterPage;
