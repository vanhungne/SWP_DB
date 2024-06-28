// PaymentVnPay.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Scss/payment.scss';
import { API_URL } from "../../Config/config";

const PaymentVnPay = () => {
    const { orderId } = useParams();
    const [bankCode, setBankCode] = useState('NCB');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for token when component loads
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token
            navigate('/login', { state: { from: `/payment/${orderId}` } });
        }
    }, [orderId, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found');
            setLoading(false);
            navigate('/login', { state: { from: `/payment/${orderId}` } });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}payment`,
                {
                    bankCode,
                    orderId: parseInt(orderId)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('Payment response:', response.data);

            if (response.data && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                throw new Error('No payment URL provided');
            }
        } catch (error) {
            console.error('Error initiating payment:', error);
            if (error.response) {
                console.log('Error response:', error.response.data);

                // Check if error is due to expired or invalid token
                if (error.response.status === 401 || error.response.status === 403) {
                    // Remove current token and redirect to login
                    localStorage.removeItem('token');
                    navigate('/login', { state: { from: `/payment/${orderId}` } });
                }
            }
            setLoading(false);
        }
    };

    return (
        <div className="payment-vnpay-container mt-5" style={{width:'50%',marginBottom:'10%'}}>
            <h1 className="payment-vnpay-header">PAYMENT ONLINE VNPAY</h1>
            <div className="payment-vnpay-card">
                <div className="payment-vnpay-card-body">
                    <div className="mb-3">
                        <label htmlFor="bankCode" className="payment-vnpay-form-label">Select Bank:</label>
                        <select
                            id="bankCode"
                            className="payment-vnpay-form-select"
                            value={bankCode}
                            onChange={(e) => setBankCode(e.target.value)}
                        >
                            <option value="NCB">NCB</option>
                        </select>
                        {/* Display bank logos */}
                        {bankCode === 'NCB' && <img src={'/images/vnpay.png'} alt="VNPAY" className="bank-logo" />}
                        {bankCode === 'NCB' && <img style={{width:'120px',height:'130px'}} src={'/images/NCB.jpg'} alt="NCB" className="bank-logo" />}
                    </div>
                    <button
                        className="payment-vnpay-btn-success"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                </div>
            </div>
            <div className="payment-vnpay-card-footer">

            </div>
        </div>
    );
};

export default PaymentVnPay;
