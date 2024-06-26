import React from 'react';
import '../../Scss/sidebar.scss';

const Sidebar = ({ selectedComponent, onComponentChange }) => {
    return (
        <div className="custom-sidebar">
            <h3 className="custom-sidebar__title" style={{textAlign:'center'}}>Admin</h3>
            <ul className="custom-sidebar__menu">
                <li
                    className={`custom-sidebar__item ${selectedComponent === 'Account' ? 'custom-sidebar__item--active' : ''}`}
                    onClick={() => onComponentChange('Account')}
                >
                    <span className="custom-sidebar__text">Account Management</span>
                </li>
                <li
                    className={`custom-sidebar__item ${selectedComponent === 'Order' ? 'custom-sidebar__item--active' : ''}`}
                    onClick={() => onComponentChange('Order')}
                >
                    <span className="custom-sidebar__text">Order Management</span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;