import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentResult = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                console.log('Verifying payment with query:', location.search);
                const response = await axios.get(`${API_URL}payment/VNPayBack${location.search}`);
                console.log('Server response:', response.data);

                if (response.data.code === 200) {
                    setPaymentStatus(response.data.data.code);
                    setOrderDetails(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Payment verification failed');
                }
            } catch (err) {
                console.error('Error verifying payment:', err);
                if (err.response) {
                    console.error('Error response:', err.response.data);
                    setError(`Failed to verify payment. Server error: ${err.response.data.message || err.message}`);
                } else if (err.request) {
                    console.error('No response received:', err.request);
                    setError('Failed to verify payment. No response from server.');
                } else {
                    console.error('Error setting up request:', err.message);
                    setError(`Failed to verify payment. Error: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [location.search]); // Only dependency is location.search

    const handleReturnToHome = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                <p className="mt-3">Verifying payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                    {error}
                </div>
                <button className="btn btn-primary" onClick={handleReturnToHome}>Return to Home</button>
            </div>
        );
    }

    if (paymentStatus === "00") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mt-5"
            >
                <div className="card shadow-sm">
                    <div className="card-header bg-success text-white">
                        <h3>
                            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                            Payment Successful
                        </h3>
                    </div>
                    <div className="card-body">
                        {orderDetails && (
                            <>
                                <h5 className="card-title">Order Details</h5>
                                <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                                {/* Add more order details as needed */}
                            </>
                        )}
                        <button className="btn btn-primary mt-3" onClick={handleReturnToHome}>
                            Return to Home
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    } else {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mt-5"
            >
                <div className="card shadow-sm">
                    <div className="card-header bg-danger text-white">
                        <h3>
                            <FontAwesomeIcon icon={faTimesCircle} className="me-2" />
                            Payment Failed
                        </h3>
                    </div>
                    <div className="card-body">
                        <p>Payment was not successful. Please try again.</p>
                        <p>Error code: {paymentStatus}</p>
                        <button className="btn btn-primary mt-3" onClick={handleReturnToHome}>
                            Return to Home
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }
};

export default PaymentResult;