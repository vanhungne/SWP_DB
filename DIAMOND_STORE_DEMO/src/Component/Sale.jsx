import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {API_URL} from "../Config/config";

const Sale = () => {
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const OrderStatus = {
        PENDING: 'PENDING',
        PAYMENT: 'PAYMENT',
        DELIVERED: 'DELIVERED',
        CANCELED: 'CANCELED',
        RECEIVED: 'RECEIVED',
    };

    useEffect(() => {
        fetchOrders();
        fetchPayments();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}sale/ViewOrderPaymentAndPending`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    };

    const fetchPayments = async () => {
        try {
            const response = await axios.get('/api/dashboard/payments');
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments', error);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.patch(`${API_URL}sale/setOrderToDelivery/${orderId}`, { status: newStatus });
            fetchOrders(); // Refresh orders after updating status
        } catch (error) {
            console.error('Error updating order status', error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Orders</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Delivery Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.orderDate}</td>
                        <td>{order.orderTotalAmount}</td>
                        <td>{order.orderDeliveryAddress}</td>
                        <td>{order.status}</td>
                        <td>
                            <select value={order.status} onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}>
                                {Object.keys(OrderStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Payments</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Time</th>
                    <th>Description</th>
                    <th>Order ID</th>
                </tr>
                </thead>
                <tbody>
                {payments.map(payment => (
                    <tr key={payment.paymentsId}>
                        <td>{payment.paymentsId}</td>
                        <td>{payment.paymentAmount}</td>
                        <td>{payment.paymentMode}</td>
                        <td>{payment.paymentTime}</td>
                        <td>{payment.description}</td>
                        <td>{payment.orderId}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sale;
