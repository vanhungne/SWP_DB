import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();
    const { orderDetails, paymentResponse } = location.state;

    return (
        <div className="container mt-5">
            <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">Payment Successful!</h4>
                <p>Your payment was successful.</p>
                <hr />
                <p className="mb-0">Thank you for your purchase!</p>
            </div>
            <div className="card mt-3">
                <div className="card-body">
                    <h5 className="card-title">Order Details</h5>
                    <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                    <p><strong>Amount:</strong> ${orderDetails.amount.toFixed(2)}</p>
                    <p><strong>Payment Date:</strong> {new Date(paymentResponse.vnp_PayDate).toLocaleString()}</p>
                </div>
            </div>
            <Link to="/" className="btn btn-primary mt-3">Return to Home</Link>
        </div>
    );
};

export default SuccessPage;
