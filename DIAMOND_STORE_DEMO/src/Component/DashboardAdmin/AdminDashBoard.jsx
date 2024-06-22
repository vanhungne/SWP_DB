import React, { useState } from 'react';
import Sidebar from './Siderbar';
import UserDashboard from './UserDashBoard';
import OrderDashboard from './OrderDashboard';
import '../../Scss/aDashboard.scss';

const AdminDashboard = () => {
    const [selectedComponent, setSelectedComponent] = useState('Account');

    const handleComponentChange = (component) => {
        setSelectedComponent(component);
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <Sidebar
                    selectedComponent={selectedComponent}
                    onComponentChange={handleComponentChange}
                />
            </div>
            <div className="content">
                {selectedComponent === 'Account' && <UserDashboard />}
                {selectedComponent === 'Order' && <OrderDashboard />}
            </div>
        </div>
    );
};

export default AdminDashboard;