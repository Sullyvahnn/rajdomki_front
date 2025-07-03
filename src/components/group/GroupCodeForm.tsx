import { FC, useState } from 'react';
import axios from 'axios';
import api from "../../api/api";

interface GroupCodeFormProps {
    endpoint: string; // API endpoint, e.g. '/user/group-code'
    onGroupChange: () => void; // callback after successful group join/change
}

const GroupCodeForm: FC<GroupCodeFormProps> = ({ endpoint, onGroupChange }) => {
    const [groupCode, setGroupCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post(
                endpoint,
                { groupCode }
            );

            setSuccess('Group changed successfully!');
            setGroupCode('');
            onGroupChange();
        } catch (err) {
            console.error(err);
            setError('Invalid or expired group code.');
        } finally {
            setLoading(false);

        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <label htmlFor="groupCode" className="block text-sm font-medium text-gray-700 mb-1">
                Group Code
            </label>
            <input
                id="groupCode"
                type="text"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 mb-3"
                required
            />

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Code'}
            </button>
        </form>
    );
};

export default GroupCodeForm;
