// import { useEffect, useState } from 'react';
// import api from '../../api/api';
// import { RegisterResponse } from '../../types';

// const HandleRegisterComponent = () => {
//     const [emailData, setEmail] = useState<RegisterResponse | null>(null);

//     useEffect(() => {
//         api.get('/auth/request-code').then(res => setEmail(res.data));
//     }, []);

//     if (!emailData) return null;

//     return (
//         <div>
//             <h2>Group Code: {group.groupCode}</h2>
//             <h3>Members:</h3>
//             <ul>
//                 {group.members.map(email => <li key={email}>{email}</li>)}
//             </ul>
//         </div>
//     );
// };

// export default HandleRegisterComponent;