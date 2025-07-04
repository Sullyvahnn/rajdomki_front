import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GroupInfo from '../components/group/GroupInfo';
import GroupCodeForm from '../components/group/GroupCodeForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BigLogo from '../components/BigLogo';
import { UserData } from '../types';
import api from "../api/api";

const GroupPage = () => {
    const { isAuthenticated } = useAuth();
    const [groupMembers, setGroupMembers] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [groupLoading, setGroupLoading] = useState(false);

    useEffect(() => {
        console.log("Is authenticated:", isAuthenticated);
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            console.log("Fetching group data...");
            fetchGroup();
        }
    }, [isAuthenticated]);

    const fetchGroup = async () => {
        setGroupLoading(true);
        setError('');
        try {
            const response = await api.get('/user/group', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
                },
            });

            const names = response.data.success;
            if (Array.isArray(names)) {
                setGroupMembers(names);
            } else {
                console.warn("Unexpected group response:", response.data);
                setGroupMembers([]);
                setError('Invalid group data format.');
            }
        } catch (err) {
            console.error(err);
            setError('Could not fetch group information.');
        } finally {
            setGroupLoading(false);
        }
    };
    // Show loading screen while group state is loading
    if (groupLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>
        );
    }

    // Redirect or inform user if not logged in
    if (!isAuthenticated) {
        return (
            <div className="page-container">
                <Navbar />
                <div className="main-content">
                    <BigLogo />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        You need to log in to manage your group.
                    </h2>
                    <a
                        href="/login"
                        className="login-button"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                <BigLogo />
                <h2 className="centered-heading text-3xl font-semibold text-gray-800 mb-8 text-center">
                    Group Information
                </h2>

                {error && <p className="text-red-600 mb-4">{error}</p>}
                <div  className="group-section-wrapper mb-12">
                    <div className='group-box'>
                        {groupMembers.length > 0 ? (
                            <div className="mb-8">
                                <GroupInfo members={groupMembers} />
                            </div>
                        ) : (
                            <p className="text-gray-600 mb-8">You are not part of any group yet.</p>
                        )}
                    </div>
                    <div className='group-box'>
                        <h3 className="text-xl font-semibold mb-2">Change your group code</h3>
                        <GroupCodeForm
                            endpoint="/user/change-code"
                            onGroupChange={fetchGroup}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default GroupPage;
