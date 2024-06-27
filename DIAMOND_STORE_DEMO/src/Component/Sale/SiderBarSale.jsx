import React from 'react';
import '../../Scss/sidebar.scss';

const Sidebar = ({ selectedComponent, onComponentChange }) => {
    return (
        <div className="custom-sidebar">
            <h3 className="custom-sidebar__title" style={{textAlign:'center'}}>Sale</h3>
            <ul className="custom-sidebar__menu">
                <li
                    className={`custom-sidebar__item ${selectedComponent === 'Order' ? 'custom-sidebar__item--active' : ''}`}
                    onClick={() => onComponentChange('Order')}
                >
                    <span className="custom-sidebar__text">Order Management</span>
                </li>
                <li
                    className={`custom-sidebar__item ${selectedComponent === 'warranty' ? 'custom-sidebar__item--active' : ''}`}
                    onClick={() => onComponentChange('warranty')}
                >
                    <span className="custom-sidebar__text">Warranty</span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;