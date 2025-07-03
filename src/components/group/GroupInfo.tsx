import { FC } from 'react';

interface GroupInfoProps {
    members: string[];
}

const GroupInfo: FC<GroupInfoProps> = ({ members }) => {
    if (!Array.isArray(members)) {
        return <p className="text-red-600">Invalid group data.</p>;
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Group Members ({members.length})
            </h4>
            <ul className="space-y-2">
                {members.map((name, index) => (
                    <li key={index} className="border-b last:border-b-0 pb-2 text-gray-700">
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupInfo;
