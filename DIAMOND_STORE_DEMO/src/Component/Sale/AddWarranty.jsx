import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShield,
    faEdit,
    faTrash,
    faSpinner,
    faExclamationTriangle,
    faTag,
    faClock, faCalendar
} from '@fortawesome/free-solid-svg-icons';

import { API_URL } from "../../Config/config";
import '../../Scss/AddWarranty.scss';

const WarrantyManager = ({ productId, orderId }) => {
    const [warranty, setWarranty] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState('view');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchWarranty();
    }, [productId, orderId]);

    const fetchWarranty = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}warranty/warrantyByProduct`, {
                params: { orderId, productId },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data) {
                setWarranty(response.data);
                setMode('view');
            } else {
                setWarranty(null);
                setMode('add');
            }
        } catch (err) {
            console.error('Error fetching warranty:', err);
            setWarranty(null);
            setMode('add');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            let response;
            const warrantyData = {
                ...warranty,
                order_id: orderId,
                product_id: productId
            };

            if (mode === 'add') {
                response = await axios.post(`${API_URL}warranty/add`, warrantyData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else if (mode === 'edit') {
                response = await axios.put(`${API_URL}warranty/update/${warranty.warrantiesId}`, warrantyData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            setWarranty(response.data);
            setMode('view');
            setIsDialogOpen(false);
        } catch (err) {
            console.error('Error with warranty operation:', err);
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
            setWarranty(null);
            setMode('add');
            setIsDialogOpen(false);
        } catch (err) {
            console.error('Error deleting warranty:', err);
            setError('Failed to delete warranty. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const WarrantyForm = () => (
        <form onSubmit={handleSubmit} className="warranty-form">
            <div className="form-group">
                <label htmlFor="startDate">
                    <FontAwesomeIcon icon={faCalendar} /> Start Date
                </label>
                <input
                    id="startDate"
                    type="date"
                    value={warranty?.warrantyStartDate ? new Date(warranty.warrantyStartDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setWarranty({...warranty, warrantyStartDate: e.target.value})}
                    required
                    disabled={mode === 'view'}
                />
            </div>
            <div className="form-group">
                <label htmlFor="expirationDate">
                    <FontAwesomeIcon icon={faClock} /> Expiration Date
                </label>
                <input
                    id="expirationDate"
                    type="date"
                    value={warranty?.warrantyExpirationDate ? new Date(warranty.warrantyExpirationDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setWarranty({...warranty, warrantyExpirationDate: e.target.value})}
                    required
                    disabled={mode === 'view'}
                />
            </div>
            <div className="form-group">
                <label htmlFor="warrantyType">
                    <FontAwesomeIcon icon={faTag} /> Warranty Type
                </label>
                <select
                    id="warrantyType"
                    value={warranty?.warrantyType || ''}
                    onChange={(e) => setWarranty({...warranty, warrantyType: e.target.value})}
                    disabled={mode === 'view'}
                >
                    <option value="Standard">Standard</option>
                    <option value="Extended">Extended</option>
                    <option value="Lifetime">Lifetime</option>
                </select>
            </div>
            {error && (
                <div className="error-message">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span>{error}</span>
                </div>
            )}
            {mode !== 'view' && (
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? (
                        <><FontAwesomeIcon icon={faSpinner} spin /> Processing...</>
                    ) : (
                        mode === 'add' ? 'Add Warranty' : 'Update Warranty'
                    )}
                </button>
            )}
        </form>
    );

    return (
        <div className="warranty-manager">
            <button onClick={() => setIsDialogOpen(true)} className="btn btn-outline">
                <FontAwesomeIcon icon={faShield} />
                { warranty ? 'View Warranty' : 'Add Warranty'}
            </button>
            {isDialogOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2 style={{textAlign:'center',fontWeight:'bold'}}>{mode === 'add' ? 'Add Warranty' : mode === 'edit' ? 'Edit Warranty' : 'View Warranty'}</h2>
                        <p style={{textAlign:'center',fontSize:'small'}}>{mode === 'view' ? 'Warranty details for this product.' : 'Enter the warranty details below.'}</p>
                        <WarrantyForm />
                        {mode === 'view' && (
                            <div className="button-group">
                                <button onClick={() => setMode('edit')} className="btn btn-secondary">
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                                <button onClick={handleDelete} className="btn btn-danger">
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </div>
                        )}
                        <button onClick={() => setIsDialogOpen(false)} className="btn btn-close">×</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarrantyManager;