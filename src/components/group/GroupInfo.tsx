import { useEffect, useState } from 'react';
import api from '../../api/api';
import { GroupInfo } from '../../types';

const GroupInfoComponent = () => {
    const [group, setGroup] = useState<GroupInfo | null>(null);

    useEffect(() => {
        api.get('/user/group').then(res => setGroup(res.data));
    }, []);

    if (!group) return null;

    return (
        <div>
            <h2>Group Code: {group.groupCode}</h2>
            <h3>Members:</h3>
            <ul>
                {group.members.map(email => <li key={email}>{email}</li>)}
            </ul>
        </div>
    );
};

export default GroupInfoComponent;