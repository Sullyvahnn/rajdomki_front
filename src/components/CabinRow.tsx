// CabinRow.tsx - Beautiful modern UI for each cabin card
import { Cabin } from '../types';
import api from '../api/api';

const CabinRow = ({ cabin }: { cabin: Cabin }) => {
    const isFull = cabin.occupied >= cabin.capacity;

    const handleReserve = async () => {
        try {
            await api.post('/cabins/reserve', { cabinId: cabin.id });
            alert(`Reserved ${cabin.name}`);
        } catch (err) {
            alert('Failed to reserve cabin');
        }
    };

    return (
        <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-200 bg-white p-6 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        🏡 {cabin.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Capacity: <span className="font-medium">{cabin.capacity}</span> | Occupied: <span className="font-medium">{cabin.occupied}</span>
                    </p>
                </div>
                <div>
          <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold
            ${isFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
          >
            {isFull ? 'Full' : 'Available'}
          </span>
                </div>
            </div>
            <button
                onClick={handleReserve}
                disabled={isFull}
                className={`mt-4 w-full py-2 px-4 rounded-md font-semibold text-white transition
          ${isFull ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isFull ? 'Unavailable' : 'Reserve'}
            </button>
        </div>
    );
};

export default CabinRow;