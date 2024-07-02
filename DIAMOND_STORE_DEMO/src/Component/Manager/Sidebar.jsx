import React from 'react';
import '../../Scss/sidebar.scss'

const Sidebar = ({ activePage, setActivePage, setCurrentView }) => {
    const handleClick = (page) => {
        setCurrentView("dashboard");
        setActivePage(page);
    }
    return (
        <div className="custom-sidebar">
            <h3 className="custom-sidebar__title" style={{textAlign:'center'}}>Manager Dashboard</h3>
            <ul className="custom-sidebar__menu">
                <li className={`custom-sidebar__item ${activePage === 'products' ? 'active' : ''}`}
                    onClick={() => handleClick('products')}>
                    <span className="custom-sidebar__text">Products</span>
                </li>
                <li className={`custom-sidebar__item ${activePage === 'orders' ? 'active' : ''}`}
                    onClick={() => handleClick('orders')}>
                    <span className="custom-sidebar__text">Orders</span>
                </li>
                <li className={`custom-sidebar__item ${activePage === 'shells' ? 'active' : ''}`}
                    onClick={() => handleClick('shells')}>
                    <span className="custom-sidebar__text">Shells</span>
                </li>
                <li className={`custom-sidebar__item ${activePage === 'diamonds' ? 'active' : ''}`}
                    onClick={() => handleClick('diamonds')}>
                    <span className="custom-sidebar__text">Diamonds</span>
                </li>
                <li className={`custom-sidebar__item ${activePage === 'category' ? 'active' : ''}`}
                    onClick={() => handleClick('category')}>
                    <span className="custom-sidebar__text">Category</span>
                </li>
                <li className={`custom-sidebar__item ${activePage === 'diamondPrice' ? 'active' : ''}`}
                    onClick={() => handleClick('diamondPrice')}>
                    <span className="custom-sidebar__text">Diamond Price</span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
