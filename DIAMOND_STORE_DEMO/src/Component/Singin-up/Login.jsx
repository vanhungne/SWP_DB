import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { API_URL } from "../../Config/config";
import '../../Scss/Login.scss';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}login/signin`, null, {
                params: { email, password },
            });

            if (response.data.data) {
                localStorage.setItem('token', response.data.data);
                iziToast.success({
                    title: 'Success',
                    message: 'Login successfully',
                    position: 'topRight',
                    timeout: 1500,
                    onClosing: () => {
                        navigate('/');
                    }
                });
            } else {
                iziToast.error({
                    title: 'error',
                    message: 'Incorrect Email or Password',
                    position: 'topRight'
                });
            }
        } catch (err) {
            iziToast.error({
                title: 'Error',
                message: err.message,
                position: 'topRight'
            });
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}oauth2/authorization/google`;
    };
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>ESTHER DIAMOND</h1>
                    <p>Welcome back! Please login to your account.</p>
                </div>
                <form onSubmit={login} className="login-form">
                    <div className="input-group">
                        <FiMail className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="forgot-password">
                        <button type="button" onClick={() => navigate('/forgot-password')}>
                            Forgot Password?
                        </button>
                    </div>
                    <button type="submit" className="btn-login">
                        <FiLogIn /> Login
                    </button>
                </form>
                <div className="divider">
                    <span>OR</span>
                </div>
                <button onClick={handleGoogleLogin} className="btn-google">
                    <FcGoogle /> Login with Google
                </button>
                <div className="register-link">
                    <p>Don't have an account?</p>
                    <button onClick={() => navigate('/register')} className="btn-secondary">
                        <FiUserPlus /> Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;