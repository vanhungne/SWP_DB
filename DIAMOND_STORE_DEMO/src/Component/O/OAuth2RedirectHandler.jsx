import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function OAuth2RedirectHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                navigate('/');
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Login failed. No token received.',
            }).then(() => {
                navigate('/login');
            });
        }
    }, [location, navigate]);

    return null;
}

export default OAuth2RedirectHandler;