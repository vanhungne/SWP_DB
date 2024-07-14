import React, { useState } from 'react';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import MetaTags from "react-meta-tags";
import { API_URL } from "../../Config/config";

const VerifyCodeForm = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerificationCodeChange = (event) => {
        setVerificationCode(event.target.value);
    };

    const handleVerifyCode = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}login/verify-registration`, {
                email,
                verificationCode,
            });

            setLoading(false);
            if (response.data.success) {
                iziToast.success({
                    title: 'Success',
                    message: 'Your account has been verified.',
                    position: 'topRight',
                    timeout: 1000,
                    onClosing: () => {
                        navigate('/login');
                    }
                });
            } else {
                iziToast.error({
                    title: 'Verification Failed',
                    message: response.data.message,
                    position: 'topRight',
                    timeout: 5000
                });
            }
        } catch (err) {
            setLoading(false);
            iziToast.error({
                title: 'Error',
                message: err.response?.data?.message || 'Wrong code',
                position: 'topRight',
                timeout: 5000
            });
        }
    };
return (
    <>
        <MetaTags>
            <title>Verify Code</title>
            <meta name="description" content="Verify your account using the code sent to your email." />
        </MetaTags>
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card border-0 shadow p-4" style={{ borderRadius: '15px', maxWidth: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4" style={{ color: '#333', fontWeight: 'bold', fontSize: '24px' }}>Verify Code</h2>
                    <p className="text-center mb-4" style={{ color: '#666', fontSize: '16px' }}>
                        Please enter the verification code sent to <strong>{email}</strong>
                    </p>
                    <div className="form-group">
                        <label style={{ color: '#666', fontSize: '16px' }}>Verification Code</label>
                        <input
                            type="text"
                            className="form-control"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            placeholder="Enter the verification code"
                            style={{ borderRadius: '10px', fontSize: '16px' }}
                        />
                    </div>
                    <div style={{textAlign:'center'}}>
                        <button
                            type="button"
                            className="btn mt-4"
                            onClick={handleVerifyCode}
                            disabled={loading} // Disable button while loading
                            style={{borderRadius: '10px', fontSize: '20px', fontWeight: 'bold',backgroundColor:'blue'}}
                        >
                            {loading ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </>
);
};

export default VerifyCodeForm;