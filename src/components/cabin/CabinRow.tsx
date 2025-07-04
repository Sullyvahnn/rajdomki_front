import { useEffect, useState } from 'react';
import { Cabin } from '../../types';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const CabinRow = ({ cabin, onChange }: { cabin: Cabin; onChange?: () => void }) => {
    const { user, isAuthenticated, setUser } = useAuth();

    const token = sessionStorage.getItem('jwt_token');
    const isAdmin = user?.is_admin;
    const isOwnCabin = user?.cabin_id === cabin.id;
    const isFull = cabin.occupied_places >= cabin.capacity;
    const isLocked = (cabin.is_locked === true);

    const [timeUntilUnlock, setTimeUntilUnlock] = useState<string | null>(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [scheduleDate, setScheduleDate] = useState(() => {
        // Set default to today, time 12:00
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}T12:00`;
    });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
    if (!cabin.unlock_time) {
        setTimeUntilUnlock(null);
        return;
    }

    const updateCountdown = () => {
        const unlockMoment = dayjs.utc(cabin.unlock_time);
        const now = dayjs.utc(); // <---- TO JEST KRYTYCZNE
        const diff = unlockMoment.diff(now);

        if (diff <= 0) {
            setTimeUntilUnlock(null);
        } else {
            setTimeUntilUnlock(unlockMoment.fromNow(true));
        }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    onChange?.();
    return () => clearInterval(interval);
}, [cabin.unlock_time]);

    const handleReserve = async () => {
        if (!isAuthenticated || !token) {
            setErrorMsg('You must be logged in to reserve a cabin.');
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
            setErrorMsg(`❌ ${error}`);
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
            console.log(cabin.is_locked)
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
        if (!scheduleDate || !token) return;
        try {
            // Zamień lokalny czas na UTC ISO string
            const unlockISO = new Date(scheduleDate).toISOString();
            await api.post(
                `/admin/schedule-unlock/${cabin.id}`,
                { unlock_time: unlockISO },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowSchedule(false);
            setScheduleDate('');
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
            className={`cabin-row relative overflow-hidden rounded-xl shadow-md border p-6 transition-all group 
            ${isOwnCabin ? 'cabin-own' : 'border-gray-200 bg-white hover:shadow-lg'}`}
        >
            <div className={`cabin-card${isOwnCabin ? ' your-cabin' : ''}${isFull ? ' cabin-disabled' : ''}`}>
                <div>
                    <h3 className="cabin-title">
                        Nazwa: {cabin.name}
                        {isOwnCabin && (
                            <span className="ml-2 text-sm px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                               
                            </span>
                        )}
                    </h3>
                    <p className="cabin-capacity">
                        Capacity: <span className="font-medium">{cabin.capacity}</span> | Occupied:{' '}
                        <span className="font-medium">{cabin.occupied_places}</span>
                    </p><p>ss</p>
                    {isLocked&& (
                        <p className="cabin-lock">🔒 Locked</p>
                    )}
                    {timeUntilUnlock && !isOwnCabin && (
                        <p className="cabin-unlock">⏳ Unlocks in {timeUntilUnlock}</p>
                    )}
                </div>
                <div className={`cabin-status`}>
                    <span
                        className={`inline-block px-3 py-1 text-xs rounded-full font-semibold
                        ${isFull ? 'cabin-disabled' : 'bg-green-100 text-green-600'}`}
                    >
                        {isFull ? 'Full' : 'Available'}
                    </span>
                </div>
            </div>

            <button
                onClick={isOwnCabin ? handleLeave : handleReserve}
                disabled={reserveDisabled}
                className={`btn
                    ${
                    isOwnCabin
                        ? 'btn-red'
                        : reserveDisabled
                            ? 'btn-blue'
                            : 'w-full'
                }`}
            >
                {buttonText}
            </button>

            {isAdmin && (
                <div className="admin-actions">
                    <button
                        className="btn btn-yellow"
                        onClick={handleEdit}
                    >
                        ✏️ Edit Cabin
                    </button>
                    <button
                        className="btn btn-red"
                        onClick={handleDelete}
                    >
                        🗑️ Delete Cabin
                    </button>
                    <button
                        className="btn btn-purple"
                        onClick={handleToggleLock}
                    >
                        {cabin.is_locked ? '🔓 Unlock Cabin' : '🔒 Lock Cabin'}
                    </button>
                    <button
                        className="btn btn-indigo"
                        onClick={() => setShowSchedule((v) => !v)}
                    >
                        ⏰ Schedule Unlock
                    </button>
                    {showSchedule && (
                        <div className="mt-2 flex gap-2 items-center">
                            <input
                                type="datetime-local"
                                value={scheduleDate}
                                onChange={e => setScheduleDate(e.target.value)}
                                className="border p-1 rounded"
                            />
                            <button
                                className="btn btn-green"
                                onClick={handleScheduleUnlock}
                                type="button"
                            >
                                Zatwierdź
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Dymek z błędem */}
            {errorMsg && (
                <div className="error-msg" onAnimationEnd={() => setErrorMsg(null)}>
                    {errorMsg}
                </div>
            )}
        </div>
    );
};

export default CabinRow;