import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import '../../Scss/Login.scss';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon from react-icons
import {API_URL} from "../../Config/config";

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
                    text: 'Incorrect Email or Password',
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            });
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}oauth2/authorization/google`;
    };

    return (

        <div className="login-container d-flex justify-content-center align-items-center">

            <div className="card shadow-lg p-4" style={{ width: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">ESTHER DIAMOND</h2>
                    <form onSubmit={login}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <button type="submit" className="btn btn-secondary btn-block mt-2">Login</button>
                            </div>
                            <div className="col-md-6">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-block mt-2"
                                    onClick={() => navigate('/register')}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                    <br/>
                    <div className="login-toggle-btn">
                        <button
                            className="btn btn-link"
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            style={{backgroundColor: "blue", color: 'white', textDecoration: 'none'}}
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <hr/>
                    <button
                        type="button"
                        className="btn btn-google btn-block"
                        onClick={handleGoogleLogin}
                        style={{backgroundColor: 'red', color: 'white'}}
                    >
                        <FcGoogle size={20} style={{ marginRight: '10px' }} /> Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
