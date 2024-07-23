import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart,
    faChevronRight,
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

const statusIcons = {
    PENDING: { icon: faClock, color: '#655e50' },
    CONFIRMED: { icon: faCheckCircle, color: '#4CAF50' },
    PAYMENT: { icon: faCreditCard, color: '#2196F3' },
    DELIVERED: { icon: faTruck, color: '#fbcb09' },
    CANCELED: { icon: faTimesCircle, color: '#F44336' },
    RECEIVED: { icon: faBoxOpen, color: '#795548' }
};

const statusLabels = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PAYMENT: 'PAYMENT',
    DELIVERED: 'DELIVERING',
    CANCELED: 'CANCELED',
    RECEIVED: 'RECEIVED'
};

const OrderDashboard = ({ onOrderClick }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const ordersPerPage = 10;

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const fetchOrders = async (page) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await axios.get(`${API_URL}delivery/ViewOrderDelivery`,{
                headers: { 'Authorization': `Bearer ${token}` },
                params: { page: page, size: ordersPerPage }
            });

            const sortedOrders = response.data.sort((a, b) =>
                new Date(b.orderDate) - new Date(a.orderDate)
            );

            // Fetch customer emails
            const ordersWithEmails = await Promise.all(sortedOrders.map(async (order) => {
                const customerResponse = await axios.get(`${API_URL}manage/accounts/${order.customerId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                return {...order, customerEmail: customerResponse.data.email};
            }));

            setOrders(ordersWithEmails);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (err) {
            setError(err.response?.status === 401
                ? 'Authentication failed. Please log in again.'
                : 'Failed to fetch orders. Please try again later.');
            setLoading(false);
        }
    };

    const handleOrderDetailsClick = (orderId) => {
        onOrderClick(orderId);
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
                <FontAwesomeIcon icon={faShoppingCart}/>
                Order Dashboard
            </h1>
            <div className="order-table-container">
                <table className="order-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Customer</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId} className="order-row">
                            <td>{order.orderId}</td>
                            <td style={{color: 'blue', fontSize: '15px'}}>
                                {new Date(order.orderDate).toLocaleString()}
                            </td>
                            <td>${order.orderTotalAmount.toFixed(2)}</td>
                            <td>{order.orderDeliveryAddress}</td>
                            <td>
                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                    <FontAwesomeIcon
                                        icon={statusIcons[order.status].icon}
                                        style={{color: statusIcons[order.status].color}}
                                    />
                                    {statusLabels[order.status]}
                                </span>
                            </td>
                            <td>{order.customerEmail}</td>
                            <td>
                                <button
                                    onClick={() => handleOrderDetailsClick(order.orderId)}
                                    className="details-button"
                                >
                                    Details
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                </button>
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