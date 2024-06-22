import React from 'react';
import '../../Scss/sidebar.scss';

const Sidebar = ({ selectedComponent, onComponentChange }) => {
    return (
        <div className="sidebar1">
            <ul className="sidebar-menu">
                <li
                    className={selectedComponent === 'Account' ? 'active' : ''}
                    onClick={() => onComponentChange('Account')}
                >
                    Account Management
                </li>
                <li
                    className={selectedComponent === 'Order' ? 'active' : ''}
                    onClick={() => onComponentChange('Order')}
                >
                    Order Management
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;