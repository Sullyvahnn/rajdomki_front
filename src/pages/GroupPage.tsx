import GroupInfo from '../components/group/GroupInfo';
import GroupCodeForm from '../components/group/GroupCodeForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GroupPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Group Information</h2>
                <div className="mb-8">
                    <GroupInfo />
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">Change or Join Group</h3>
                    <GroupCodeForm />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GroupPage;
