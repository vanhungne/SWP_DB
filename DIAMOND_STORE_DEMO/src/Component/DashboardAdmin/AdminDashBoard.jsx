import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Siderbar';
import UserDashboard from './UserDashBoard';
import OrderDashboard from './OrderDashboard';
import OrderDetailsDash from "./OrderDetailsDash";
import '../../Scss/aDashboard.scss';
import { API_URL } from "../../Config/config";

const AdminDashboard = () => {
    const [selectedComponent, setSelectedComponent] = useState('Account');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderDetailsData, setOrderDetailsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleComponentChange = (component) => {
        setSelectedComponent(component);
        setSelectedOrderId(null);
        setOrderDetailsData(null);
    };

    const handleOrderClick = async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}order/OrdersData/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOrderDetailsData(response.data.data);
            setSelectedOrderId(orderId);
        } catch (err) {
            setError('Failed to fetch order details. Please try again.');
            console.error('Error fetching order details:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (selectedComponent === 'Account') {
            return <UserDashboard />;
        }

        if (selectedComponent === 'Order') {
            if (selectedOrderId) {
                if (loading) {
                    return <div>Loading order details...</div>;
                }
                if (error) {
                    return <div className="error-message">{error}</div>;
                }
                return <OrderDetailsDash orderData={orderDetailsData} />;
            }
            return <OrderDashboard onOrderClick={handleOrderClick} />;
        }
    };

    return (
        <div className="custom-dashboard">
            <div className="custom-dashboard__sidebar">
                <Sidebar
                    selectedComponent={selectedComponent}
                    onComponentChange={handleComponentChange}
                />
            </div>
            <div className="custom-dashboard__content">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;