import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClock,
    faCheckCircle,
    faCreditCard,
    faTruck,
    faTimesCircle,
    faBoxOpen,
    faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import './StatusAd.scss';

const statusConfig = {
    PENDING: { icon: faClock, text: 'Pending', color: '#ff6b6b' },
    CONFIRMED: { icon: faCheckCircle, text: 'Confirmed', color: '#00cec9' },
    PAYMENT: { icon: faCreditCard, text: 'Payment', color: '#00ff27' },
    DELIVERED: { icon: faTruck, text: 'Delivered', color: '#0984e3' },
    CANCELED: { icon: faTimesCircle, text: 'Canceled', color: '#e17055' },
    RECEIVED: { icon: faBoxOpen, text: 'Received', color: '#6c5ce7' },
    'BOOKED APPOINTMENT': { icon: faCalendarCheck, text: 'Booked Appointment', color: '#4dd0e1' }
};

const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.PENDING;

    return (
        <span className="status-badge" style={{ backgroundColor: config.color }}>
            <FontAwesomeIcon icon={config.icon} />
            {config.text}
        </span>
    );
};

export default StatusBadge;