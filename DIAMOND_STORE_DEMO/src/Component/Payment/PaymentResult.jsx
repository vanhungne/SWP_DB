import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faCreditCard, faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import axios from "axios";
import '../../Scss/paymentResult.scss';
const VNPayCallback = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const responseCode = query.get('vnp_ResponseCode');
        const orderId = query.get('orderId');

        const messageMap = {
            '00': 'Payment successful.',
            '01': 'Order is already confirmed.',
            '02': 'Order not found.',
            '97': 'Invalid signature.',
            '99': 'Payment unsuccessful.'
        };

        setMessage(messageMap[responseCode] || 'An error occurred during payment.');
        setOrderId(orderId);

        if (responseCode === '00' && orderId) {
            fetchOrder(orderId);
            fetchOrderDetails(orderId);
        } else {
            setLoading(false);
        }
    }, [location]);

    const fetchOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const orderResponse = await axios.get(`${API_URL}order/OrdersData/${orderId}`, config);
            const order = orderResponse.data.data;
            setOrder(order);
        } catch (error) {
            console.error("Error fetching order data:", error);
            setError('Failed to fetch order details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const orderDetailsResponse = await axios.get(`${API_URL}order/OrderDetailByCustomer/${orderId}`, config);
            const { success, description, data: orderDetailsData } = orderDetailsResponse.data;

            if (!success) {
                setError(description);
                return;
            }

            const orderDetailsWithProducts = await Promise.all(
                orderDetailsData.map(async (item) => {
                    const productResponse = await axios.get(`${API_URL}product/${item.productId}`, config);
                    return {
                        ...item,
                        productName: productResponse.data.productName,
                        productImage: productResponse.data.image1
                    };
                })
            );

            setOrderDetails(orderDetailsWithProducts);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError('Failed to fetch order details. Please try again later.');
        }
    };

    return (
        <div className="payment-result-container">
            <h1 className="page-title">Payment Result</h1>

            <div className={`payment-result ${message.includes('successful') ? 'success' : 'error'} fade-in`}>
                <p>
                    <FontAwesomeIcon
                        icon={message.includes('successful') ? faCheckCircle : faTimesCircle}
                        className="icon"
                    />
                    {message}
                </p>
            </div>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <div className="loading-spinner">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Loading...</span>
                </div>
            ) : (
                <>
                    {order && (
                        <div className="order-details">
                            <h2>
                                <FontAwesomeIcon icon={faShoppingBag} className="icon" />
                                Order Details
                            </h2>
                            <div className="grid">
                                <p><strong>Order ID:</strong> {order.orderId}</p>
                                <p><strong>Date:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString() : ''}</p>
                                <p><strong>Total Amount:</strong> {order.orderTotalAmount !== undefined ? `$${order.orderTotalAmount.toFixed(2)}` : ''}</p>
                                <p><strong>Delivery Address:</strong> {order.orderDeliveryAddress}</p>
                                <p><strong>Discount Code:</strong> {order.discountCode || 'N/A'}</p>
                            </div>
                        </div>
                    )}

                    {orderDetails.length > 0 && (
                        <div className="order-items">
                            <h2>
                                <FontAwesomeIcon icon={faCreditCard} className="icon" />
                                Order Items
                            </h2>
                            <ul>
                                {orderDetails.map((item, index) => (
                                    <li key={index} className="order-item">
                                        <div className="item-info">
                                            <img src={item.productImage} alt={item.productName} className="item-image" />
                                            <div>
                                                <p className="item-name">{item.productName}</p>
                                                <p className="item-quantity">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default VNPayCallback;