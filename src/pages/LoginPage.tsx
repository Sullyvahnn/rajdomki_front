import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BigLogo from '../components/BigLogo';
import LoginFlow from '../components/register/LoginFlow';


{/* <div className="page-container">
            <Navbar />
            <main className="main-content">

                <div className="logo-center">
                    <img src={logo} alt="Central Logo" />
                </div>
                <h2>Available Cabins</h2>
                <CabinList />
            </main>
            <Footer />
        </div> */}
const LoginPage = () => {
    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">

                <BigLogo />

                <LoginFlow />
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
