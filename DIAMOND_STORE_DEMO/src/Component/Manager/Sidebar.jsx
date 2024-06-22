import React from 'react';

const Sidebar = ({ activePage, setActivePage }) => {
    return (
        <div className="sidebar">
            <h3>Volt React</h3>
            <ul>
                <li className={activePage === 'Product' ? 'active' : ''} onClick={() => setActivePage('productDashboard')}>Overview</li>
                <li className={activePage === 'Order' ? 'active' : ''} onClick={() => setActivePage('orderDashboard')}>Transactions</li>
                <li className={activePage === 'Shell' ? 'active' : ''} onClick={() => setActivePage('shellDashboard')}>Settings</li>
                <li className={activePage === 'Diamond' ? 'active' : ''} onClick={() => setActivePage('diamondDashboard')}>Products</li>
            </ul>
        </div>
    );
};

export default Sidebar;
