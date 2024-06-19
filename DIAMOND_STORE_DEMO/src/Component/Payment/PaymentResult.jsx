import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const PaymentResult = () => {
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        const verifyPayment = async () => {
            try {
                const response = await axios.get('http://localhost:8080/payment/VNPayBack', {
                    params: {
                        vnp_Amount: searchParams.get('vnp_Amount'),
                        vnp_BankCode: searchParams.get('vnp_BankCode'),
                        vnp_BankTranNo: searchParams.get('vnp_BankTranNo'),
                        vnp_CardType: searchParams.get('vnp_CardType'),
                        vnp_OrderInfo: searchParams.get('vnp_OrderInfo'),
                        vnp_PayDate: searchParams.get('vnp_PayDate'),
                        vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
                        vnp_TmnCode: searchParams.get('vnp_TmnCode'),
                        vnp_TransactionNo: searchParams.get('vnp_TransactionNo'),
                        vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus'),
                        vnp_TxnRef: searchParams.get('vnp_TxnRef'),
                        vnp_SecureHash: searchParams.get('vnp_SecureHash'),
                    }
                });

                const data = response.data;
                if (data.code === 200 && data.data.code === "00") {
                    window.location.href = data.data.paymentUrl;
                } else {
                    console.error('Payment verification failed:', data.message);
                }
            } catch (error) {
                console.error('Error making request:', error);
            }
        };

        verifyPayment();
    }, [location.search]);

    return (
        <div>
            <h1>Verifying payment, please wait...</h1>
        </div>
    );
};

export default PaymentResult;