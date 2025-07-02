import { useEffect, useState } from 'react';
import api from '../api/api';
import { Cabin } from '../types';
import CabinRow from './CabinRow';

const CabinList = () => {
    const [cabins, setCabins] = useState<Cabin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/cabins')
            .then(res => setCabins(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p className="text-center text-gray-600">Loading cabins...</p>;
    }

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cabins.map(cabin => (
                <CabinRow key={cabin.id} cabin={cabin} />
            ))}
        </div>
    );
};

export default CabinList;
