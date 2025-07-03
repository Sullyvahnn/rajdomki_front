import CabinList from '../components/cabin/CabinList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Available Cabins</h2>
                <CabinList />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
