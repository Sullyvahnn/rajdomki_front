import { useEffect, useState } from 'react';
import api from '../../api/api';
import { Cabin } from '../../types';
import CabinRow from './CabinRow';
import { useAuth } from '../../context/AuthContext';

const CabinList = () => {
    const [cabins, setCabins] = useState<Cabin[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchCabins = async () => {
        try {
            const res = await api.get('/cabins/');
            setCabins(res.data.map((c: Cabin) => ({ ...c })));
        } catch (err) {
            alert('Failed to load cabins.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCabins();
    }, []);

    const handleAddCabin = async () => {
        const name = prompt('Cabin name?');
        const capacity = Number(prompt('Cabin capacity?'));
        if (!name || !capacity) return;

        const token = sessionStorage.getItem('jwt_token');
        if (!token) return;

        try {
            await api.post(
                '/admin/add-cabin',
                { name, capacity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCabins();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to add cabin.');
        }
    };

    if (loading) return <p>Loading cabins...</p>;

    return (
        <div>
            {user?.is_admin && (
                <div className="mb-4">
                    <button
                        onClick={handleAddCabin}
                        className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700"
                    >
                        ➕ Add Cabin
                    </button>
                </div>
            )}

            <div className="cabin-grid">
                {cabins.map((cabin) => (
                    <CabinRow
                        key={`cabin-${cabin.id}-${user?.cabin_id ?? 'none'}`}
                        cabin={cabin}
                        onChange={fetchCabins}
                    />
                ))}
            </div>
        </div>
    );
};

export default CabinList;