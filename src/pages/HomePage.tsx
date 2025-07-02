import CabinList from '../components/CabinList';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Navbar */}
            <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                        <h1 className="text-2xl font-bold text-blue-700">CabinRes</h1>
                    </div>
                    <div className="space-x-6 text-sm font-medium text-gray-600">
                        <a href="/" className="hover:text-blue-600">Home</a>
                        <a href="/group" className="hover:text-blue-600">Group Info</a>
                        <a href="/join-group" className="hover:text-blue-600">Join Group</a>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Available Cabins</h2>
                <CabinList />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t text-sm text-gray-500 text-center py-6 mt-10">
                <p>&copy; {new Date().getFullYear()} Cabin Reservation System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
