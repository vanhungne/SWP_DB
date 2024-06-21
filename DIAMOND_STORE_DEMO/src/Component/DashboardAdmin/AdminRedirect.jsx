// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth} from "../../Authentication/AuthContext";
//
// const AdminRedirect = () => {
//     const { currentUser } = useAuth();
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         if (currentUser && currentUser.role === 'ADMIN') {
//             navigate('/dashboard-account');
//         } else {
//             navigate('/');
//         }
//     }, [currentUser, navigate]);
//
//     return null;
// };
//
// export default AdminRedirect;