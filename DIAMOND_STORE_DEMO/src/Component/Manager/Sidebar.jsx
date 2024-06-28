import React from 'react';

const Sidebar = ({ activePage, setActivePage }) => {
    return (
        <div className="sidebar">
            <h3>Volt React</h3>
            <ul>
                <li className={activePage === 'products' ? 'active' : ''} onClick={() => setActivePage('products')}>Products</li>
                <li className={activePage === 'orders' ? 'active' : ''} onClick={() => setActivePage('orders')}>Orders</li>
                <li className={activePage === 'shells' ? 'active' : ''} onClick={() => setActivePage('shells')}>Shells</li>
                <li className={activePage === 'diamonds' ? 'active' : ''} onClick={() => setActivePage('diamonds')}>Diamonds</li>
            </ul>
        </div>
    );
};

export default Sidebar;
