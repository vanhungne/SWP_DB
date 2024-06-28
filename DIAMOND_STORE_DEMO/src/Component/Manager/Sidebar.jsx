import React from 'react';

const Sidebar = ({ activePage, setActivePage, setCurrentView }) => {
    const handleClick = (page) => {
        setCurrentView("dashboard");
        setActivePage(page);
    }
    return (
        <div className="sidebar">
            <h3>Manager Dashboard</h3>
            <ul>
                <li className={activePage === 'products' ? 'active' : ''} onClick={() => handleClick('products')}>Products</li>
                <li className={activePage === 'orders' ? 'active' : ''} onClick={() => handleClick('orders')}>Orders</li>
                <li className={activePage === 'shells' ? 'active' : ''} onClick={() => handleClick('shells')}>Shells</li>
                <li className={activePage === 'diamonds' ? 'active' : ''} onClick={() => handleClick('diamonds')}>Diamonds</li>
            </ul>
        </div>
    );
};

export default Sidebar;
