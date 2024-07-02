import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faCalendar, faShieldAlt, faExclamationTriangle, faClock} from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import './WarrantyCustomer.scss';

const WarrantyModal = ({ isOpen, onClose, productId, orderId }) => {
    const [warranty, setWarranty] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchWarranty();
        }
    }, [isOpen, productId, orderId]);

    const fetchWarranty = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}warranty/warrantyByProduct?orderId=${orderId}&productId=${productId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data) {
                setWarranty(response.data);
            } else {
                setWarranty(null);
            }
        } catch (err) {
            console.error('Error fetching warranty:', err);
            setError('No warranty.Please Please contact email:hungse17002@gmail.com for feedback');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`warranty-modal ${isOpen ? 'is-open' : ''}`}>
            <div className="warranty-modal__content">
                <button className="warranty-modal__close" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>
                    <FontAwesomeIcon icon={faShieldAlt} /> Warranty Information
                </h2>
                {isLoading ? (
                    <div className="warranty-modal__loading">
                        <div className="spinner"></div>
                        <p>Loading warranty information...</p>
                    </div>
                ) : error ? (
                    <p className="warranty-modal__error">
                        <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
                    </p>
                ) : warranty ? (
                    <div className="warranty-modal__info">
                        <div className="warranty-modal__info-item">
                            <FontAwesomeIcon icon={faCalendar} />
                            <div>
                                <span className="label">Start Date:</span>
                                <span className="value">{new Date(warranty.warrantyStartDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="warranty-modal__info-item">
                            <FontAwesomeIcon icon={faCalendar} />
                            <div>
                                <span className="label">Expiration Date:</span>
                                <span className="value">{new Date(warranty.warrantyExpirationDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="warranty-modal__info-item">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            <div>
                                <span className="label">Warranty Type:</span>
                                <span className="value">{warranty.warrantyType}</span>
                            </div>
                        </div>
                        <div className="warranty-modal__info-item">
                            <FontAwesomeIcon icon={faClock} />
                            <div>
                                <span className="label">Duration:</span>
                                <span className="value">{calculateDuration(warranty.warrantyStartDate, warranty.warrantyExpirationDate)}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="warranty-modal__no-info">No warranty information available for this product.</p>
                )}
            </div>
        </div>
    );
};

function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    let duration = '';
    if (years > 0) duration += `${years} year${years > 1 ? 's' : ''} `;
    if (months > 0) duration += `${months} month${months > 1 ? 's' : ''} `;
    if (days > 0) duration += `${days} day${days > 1 ? 's' : ''}`;
    return duration.trim();
}

export default WarrantyModal;