import { useEffect, useState } from 'react';
import { Cabin } from '../../types';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const CabinRow = ({ cabin, onChange }: { cabin: Cabin; onChange?: () => void }) => {
    const { user, isAuthenticated, setUser } = useAuth();

    const token = sessionStorage.getItem('jwt_token');
    const isAdmin = user?.is_admin;
    const isOwnCabin = user?.cabin_id === cabin.id;
    const isFull = cabin.occupied_places >= cabin.capacity;
    const isLocked = cabin.locked === true;

    const [timeUntilUnlock, setTimeUntilUnlock] = useState<string | null>(null);

    useEffect(() => {
        if (!cabin.unlock_time) {
            setTimeUntilUnlock(null);
            return;
        }

        const updateCountdown = () => {
            const unlockMoment = dayjs(cabin.unlock_time);
            const now = dayjs();
            const diff = unlockMoment.diff(now);

            if (diff <= 0) {
                setTimeUntilUnlock(null);
            } else {
                setTimeUntilUnlock(unlockMoment.fromNow(true));
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [cabin.unlock_time]);

    const handleReserve = async () => {
        if (!isAuthenticated || !token) {
            alert('You must be logged in to reserve a cabin.');
            return;
        }

        try {
            await api.post(
                '/cabins/reserve',
                { cabin_id: cabin.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const res = await api.get('/user/current-user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);

            onChange?.();
        } catch (err: any) {
            const error = err.response?.data?.error || 'Reservation failed.';
            alert(`❌ ${error}`);
        }
    };

    const handleLeave = async () => {
        if (!isAuthenticated || !token) {
            alert('You must be logged in to leave a cabin.');
            return;
        }

        try {
            await api.post(
                '/cabins/leave',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const res = await api.get('/user/current-user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);

            onChange?.();
        } catch (err: any) {
            const error = err.response?.data?.error || 'Failed to leave cabin.';
            alert(`❌ ${error}`);
        }
    };

    const handleDelete = async () => {
        if (!token) return;
        console.log(cabin.id)
        try {
            await api.post(
                '/admin/remove-cabin',
                { id: cabin.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onChange?.();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete cabin.');
        }
    };

    const handleToggleLock = async () => {
        if (!token) return;
        try {
            await api.post(
                `/admin/unlock/${cabin.id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onChange?.();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to toggle lock.');
        }
    };

    const handleScheduleUnlock = async () => {
        const isoTime = prompt('Enter unlock time (YYYY-MM-DDTHH:mm:ss)');
        if (!isoTime || !token) return;
        try {
            await api.post(
                `/admin/schedule-unlock/${cabin.id}`,
                { unlock_time: isoTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onChange?.();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to schedule unlock.');
        }
    };

    const handleEdit = async () => {
        const newName = prompt('New cabin name?', cabin.name);
        const newCapacity = Number(prompt('New capacity?', cabin.capacity.toString()));
        if (!newName || isNaN(newCapacity) || !token) return;

        try {
            await api.post(
                '/admin/edit-cabin',
                { id: cabin.id, name: newName, capacity: newCapacity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onChange?.();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to edit cabin.');
        }
    };

    const reserveDisabled = !isOwnCabin && (isFull || isLocked || !!timeUntilUnlock);
    const buttonText = isOwnCabin
        ? 'Leave Cabin'
        : isLocked
            ? 'Locked'
            : timeUntilUnlock
                ? `Available in ${timeUntilUnlock}`
                : isFull
                    ? 'Unavailable'
                    : 'Reserve';

    return (
        <div
            className={`relative overflow-hidden rounded-xl shadow-md border p-6 transition-all group 
            ${isOwnCabin ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200 bg-white hover:shadow-lg'}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        🏡 {cabin.name}
                        {isOwnCabin && (
                            <span className="ml-2 text-sm px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                                Your Cabin
                            </span>
                        )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Capacity: <span className="font-medium">{cabin.capacity}</span> | Occupied:{' '}
                        <span className="font-medium">{cabin.occupied_places}</span>
                    </p>
                    {isLocked && !isOwnCabin && (
                        <p className="text-sm text-red-500 mt-1 font-semibold">🔒 Locked</p>
                    )}
                    {timeUntilUnlock && !isOwnCabin && (
                        <p className="text-sm text-yellow-600 mt-1">⏳ Unlocks in {timeUntilUnlock}</p>
                    )}
                </div>
                <div>
                    <span
                        className={`inline-block px-3 py-1 text-xs rounded-full font-semibold
                        ${isFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                    >
                        {isFull ? 'Full' : 'Available'}
                    </span>
                </div>
            </div>

            <button
                onClick={isOwnCabin ? handleLeave : handleReserve}
                disabled={reserveDisabled}
                className={`mt-4 w-full py-2 px-4 rounded-md font-semibold text-white transition
                    ${
                    isOwnCabin
                        ? 'bg-red-600 hover:bg-red-700'
                        : reserveDisabled
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {buttonText}
            </button>

            {isAdmin && (
                <div className="mt-4 space-y-2">
                    <button
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
                        onClick={handleEdit}
                    >
                        ✏️ Edit Cabin
                    </button>
                    <button
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                        onClick={handleDelete}
                    >
                        🗑️ Delete Cabin
                    </button>
                    <button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
                        onClick={handleToggleLock}
                    >
                        {cabin.locked ? '🔓 Unlock Cabin' : '🔒 Lock Cabin'}
                    </button>
                    <button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
                        onClick={handleScheduleUnlock}
                    >
                        ⏰ Schedule Unlock
                    </button>
                </div>
            )}
        </div>
    );
};

export default CabinRow;