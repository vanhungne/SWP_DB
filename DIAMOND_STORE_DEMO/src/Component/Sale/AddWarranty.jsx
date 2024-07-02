import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendar, faShieldAlt, faExclamationTriangle, faTrash, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import '../../Scss/AddWarranty.scss';

const WarrantyModal = ({ isOpen, onClose, productId, orderId, onWarrantyUpdated }) => {
    const [warranty, setWarranty] = useState(null);
    const [warrantyStartDate, setWarrantyStartDate] = useState('');
    const [warrantyExpirationDate, setWarrantyExpirationDate] = useState('');
    const [warrantyType, setWarrantyType] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState('add'); // 'add', 'edit', 'view'

    useEffect(() => {
        if (isOpen) {
            fetchWarranty();
        }
    }, [isOpen, productId, orderId]);

    const fetchWarranty = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}warranty/warrantyByProduct?orderId=${orderId}&productId=${productId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data) {
                setWarranty(response.data);
                setWarrantyStartDate(response.data.warrantyStartDate);
                setWarrantyExpirationDate(response.data.warrantyExpirationDate);
                setWarrantyType(response.data.warrantyType);
                setMode('view');
            } else {
                setMode('add');
            }
        } catch (err) {
            console.error('Error fetching warranty:', err);
            setMode('add');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const warrantyData = {
            warrantyStartDate,
            warrantyExpirationDate,
            warrantyType,
            order_id: orderId,
            product_id: productId
        };

        try {
            const token = localStorage.getItem('token');
            let response;
            if (mode === 'add') {
                response = await axios.post(`${API_URL}warranty/add`, warrantyData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else if (mode === 'edit') {
                response = await axios.put(`${API_URL}warranty/update/${warranty.warrantiesId}`, warrantyData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            console.log('Warranty operation successful:', response.data);
            onWarrantyUpdated(response.data);
            onClose();
        } catch (err) {
            console.error('Error with warranty operation:', err.response ? err.response.data : err.message);
            setError('Operation failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this warranty?')) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}warranty/delete/${warranty.warrantiesId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Warranty deleted successfully');
            onWarrantyUpdated(null);
            onClose();
        } catch (err) {
            console.error('Error deleting warranty:', err);
            setError('Failed to delete warranty. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="warranty-modal">
            <div className="warranty-modal__content">
                <button className="warranty-modal__close" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>
                    <FontAwesomeIcon icon={faShieldAlt} />
                    {mode === 'add' ? ' Add Warranty' : mode === 'edit' ? ' Edit Warranty' : ' View Warranty'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="warranty-modal__input-group">
                        <label>
                            <FontAwesomeIcon icon={faCalendar} /> Start Date:
                        </label>
                        <input
                            type="date"
                            value={warrantyStartDate}
                            onChange={(e) => setWarrantyStartDate(e.target.value)}
                            required
                            disabled={mode === 'view'}
                        />
                    </div>
                    <div className="warranty-modal__input-group">
                        <label>
                            <FontAwesomeIcon icon={faCalendar} /> Expiration Date:
                        </label>
                        <input
                            type="date"
                            value={warrantyExpirationDate}
                            onChange={(e) => setWarrantyExpirationDate(e.target.value)}
                            required
                            disabled={mode === 'view'}
                        />
                    </div>
                    <div className="warranty-modal__input-group">
                        <label><FontAwesomeIcon icon={faShieldAlt} /> Warranty Type:</label>
                        <input
                            type="text"
                            value={warrantyType}
                            onChange={(e) => setWarrantyType(e.target.value)}
                            required
                            disabled={mode === 'view'}
                        />
                    </div>
                    {error && (
                        <p className="warranty-modal__error">
                            <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
                        </p>
                    )}
                    <div className="warranty-modal__actions">
                        {mode === 'view' && (
                            <>
                                <button type="button" onClick={() => setMode('edit')} className="warranty-modal__edit-btn">
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                                <button type="button" onClick={handleDelete} className="warranty-modal__delete-btn">
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </>
                        )}
                        {(mode === 'add' || mode === 'edit') && (
                            <button type="submit" className="warranty-modal__submit" disabled={isLoading}>
                                {isLoading ? 'Processing...' : (mode === 'add' ? 'Add Warranty' : 'Update Warranty')}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WarrantyModal;