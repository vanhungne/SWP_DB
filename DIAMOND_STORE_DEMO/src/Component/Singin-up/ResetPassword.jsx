import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../../Scss/Login.scss';
import { API_URL } from "../../Config/config";

function Resetpassword() {
    const { email } = useParams();
    const [verificationCode, setVerificationCode] = useState("");
    const [password, setPassword] = useState("");
    const [conPassword, setConPassword] = useState("");

    const navigate = useNavigate();

    async function resetpass(event) {
        event.preventDefault();

        // Validate password and confirm password match
        if (password !== conPassword) {
            iziToast.error({
                title: 'Error',
                message: 'Passwords do not match!',
                position: 'topRight'
            });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}login/resetpassword`, {
                email,
                verificationCode,
                password,
            });

            if (response.data.success) {
                iziToast.success({
                    title: 'Success',
                    message: 'Your password has been reset.',
                    position: 'topRight',
                    onClosing: () => {
                        navigate('/');
                    }
                });
            } else {
                iziToast.error({
                    title: 'Password Reset Failed',
                    message: response.data.message,
                    position: 'topRight'
                });
            }
        } catch (err) {
            iziToast.error({
                title: 'Error',
                message: err.response?.data?.message || 'An error occurred during password reset',
                position: 'topRight'
            });
        }
    }

    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">ESTHER DIAMOND</h2>
                    <form onSubmit={resetpass}>
                        <div className="form-group">
                            <label>Verification Code</label>
                            <input
                                type="text"
                                className="form-control"
                                id="code"
                                placeholder="Enter Verification Code"
                                value={verificationCode}
                                onChange={(event) => setVerificationCode(event.target.value)}
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter New Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="conPassword"
                                placeholder="Enter Confirm Password"
                                value={conPassword}
                                onChange={(event) => setConPassword(event.target.value)}
                                autoComplete="off"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block mt-4">
                            Reset Password
                        </button>
                    </form>
                    <hr />
                </div>
            </div>
        </div>
    );
}

export default Resetpassword;