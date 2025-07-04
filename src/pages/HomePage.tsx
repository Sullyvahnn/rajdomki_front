import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BigLogo from '../components/BigLogo';
import CabinList from '../components/cabin/CabinList';

const HomePage = () => {
    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">

                <BigLogo />
                <h2>Cabins: </h2>
                <CabinList />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
