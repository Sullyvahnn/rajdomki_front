import React, { useState } from 'react';
import api from '../../api/api';

const GroupCodeForm: React.FC = () => {
    const [groupCode, setGroupCode] = useState('');

    const handleSubmit = async () => {
        try {
            await api.post('/user/change-code', { groupCode });
            alert('Group code set!');
        } catch (err) {
            alert('Failed to set group code');
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="text"
                placeholder="Enter group code"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                className="border p-2 rounded"
            />
            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Join Group
            </button>
        </div>
    );
};

export default GroupCodeForm;