import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from '../../Scss/editUser.scss';

const EditUser = ({ user, onSave, onCancel }) => {
    const [editedUser, setEditedUser] = useState({
        ...user,
        status: user?.status || false
    });

    useEffect(() => {
        if (user) {
            setEditedUser({
                ...user,
                status: user.status || false
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        const updatedUser = {
            ...editedUser,
            status: editedUser.status === 'true'
        };
        onSave(updatedUser);
    };

    return (
        <div className={styles.editUserModal}>
            <div className={styles.modalContent}>
                <div className="myaccount-info-wrapper">
                    <div className="account-info-wrapper" style={{ textAlign: 'center' }}>
                        <h4 style={{ fontSize: '24px' }}><strong><i className="fas fa-user-edit"></i> Edit User Information</strong></h4>
                    </div>
                </div>
                <div className="row">
                    {['name', 'email', 'phoneNumber', 'address', 'role', 'status'].map((field) => (
                        <div className="col-lg-6 col-md-6" key={field}>
                            <div className="billing-info">
                                <label>
                                    <i className={`fas fa-${
                                        field === 'name' ? 'user' :
                                            field === 'email' ? 'envelope' :
                                                field === 'phoneNumber' ? 'phone' :
                                                    field === 'address' ? 'map-marker-alt' :
                                                        field === 'role' ? 'user-tag' :
                                                            'toggle-on'
                                    } mr-2`}></i>
                                    <strong>{field.charAt(0).toUpperCase() + field.slice(1)}</strong>
                                </label>
                                {field === 'role' ? (
                                    <select
                                        className="form-control"
                                        name={field}
                                        value={editedUser[field] || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="ADMIN">Admin</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="SALE_STAFF">Sale Staff</option>
                                        <option value="DELIVERY_STAFF">Delivery Staff</option>
                                        <option value="CUSTOMER">Customer</option>
                                    </select>
                                ) : field === 'status' ? (
                                    <select
                                        className="form-control"
                                        name={field}
                                        value={editedUser[field] ? 'true' : 'false'}
                                        onChange={handleChange}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        className="form-control"
                                        name={field}
                                        value={editedUser[field] || ''}
                                        onChange={handleChange}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="billing-back-btn">
                    <div className="billing-btn">
                        <button
                            className="btn btn-success mr-2"
                            onClick={handleSave}
                        >
                            <i className="fas fa-save mr-2"></i>Save
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            <i className="fas fa-times mr-2"></i>Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

EditUser.propTypes = {
    user: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default EditUser;