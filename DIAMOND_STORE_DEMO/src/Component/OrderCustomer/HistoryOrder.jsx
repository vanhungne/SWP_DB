import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CreditCard } from 'lucide-react';
import {
    faShoppingCart,
    faSpinner,
    faExclamationTriangle,
    faClock,
    faCheckCircle,
    faCreditCard,
    faTruck,
    faTimesCircle,
    faBoxOpen
} from '@fortawesome/free-solid-svg-icons';
import '../../Scss/AllOrder.scss';
import { API_URL } from "../../Config/config";
import { jwtDecode } from "jwt-decode";

const statusIcons = {
    PENDING: faClock,
    CONFIRMED: faCheckCircle,
    PAYMENT: faCreditCard,
    DELIVERED: faTruck,
    CANCELED: faTimesCircle,
    RECEIVED: faBoxOpen
};

const OrderDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [userId, setUserId] = useState(null);
    const ordersPerPage = 5;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken && decodedToken.id) {
                    setUserId(decodedToken.id);
                } else {
                    setError('User ID not found in the token');
                }
            } catch (err) {
                setError('Invalid token');
            }
        } else {
            setError('User is not logged in or token is missing');
        }
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchOrders(currentPage);
        }
    }, [userId, currentPage]);

    const fetchOrders = async (page) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await axios.get(`${API_URL}order/OrderByCustomer/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { page: page, size: ordersPerPage }
            });
            const sortedOrders = response.data.content.sort((a, b) =>
                new Date(b.orderDate) - new Date(a.orderDate)
            );
            setOrders(sortedOrders);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (err) {
            setError(err.response?.status === 401
                ? 'Authentication failed. Please log in again.'
                : 'Failed to fetch orders. Please try again later.');
            setLoading(false);
        }
    };

    const handlePayNowClick = (orderId) => {
        navigate(`/payment/${orderId}`);
    };

    const handleDetailsClick = (orderId) => {
        navigate(`/order-details/${orderId}`);
    };
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="loading-spinner">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="order-dashboard">
            <h1 className="dashboard-title">
                <FontAwesomeIcon icon={faShoppingCart} />
                History Order
            </h1>
            <div className="order-table-container">
                <table className="order-table">
                    <thead>
                    <tr>
                        <th >Date</th>
                        <th>Total Amount</th>
                        <th>Delivery Address</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId} className="order-row">
                            <td style={{color: 'blue', fontSize: '15px'}}>
                                {new Date(order.orderDate).toLocaleString()}
                            </td>
                            <td>${order.orderTotalAmount.toFixed(2)}</td>
                            <td>{order.orderDeliveryAddress}</td>
                            <td>
                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                    <FontAwesomeIcon icon={statusIcons[order.status]}/>
                                    {order.status}
                                </span>
                            </td>
                            <td style={{display: 'flex', gap: '10px'}}>
                                <button
                                    onClick={() => handleDetailsClick(order.orderId)}
                                    className="details-button"
                                >
                                 Details
                                </button>
                                {order.status === 'PENDING' && (
                                    <button
                                        onClick={() => handlePayNowClick(order.orderId)}
                                        className="details-button"
                                        style={{backgroundColor: "green", width: '102px', textAlign: 'center'}}
                                    >
                                        <CreditCard size={16}/> Pay
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                {Array.from({length: totalPages}, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i)}
                        style={{
                            padding: '5px 10px',
                            margin: '0 2px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: currentPage === i ? 'white' : 'black',
                            backgroundColor: currentPage === i ? 'blue' : 'transparent',
                            border: '1px solid blue',
                            borderRadius: '3px',
                            cursor: 'pointer',
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OrderDashboard;