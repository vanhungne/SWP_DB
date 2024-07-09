import React, { useState } from 'react';
import PropTypes from "prop-types";
import styles from '../../Scss/createAccount.scss';

const CreateUser = ({ onCancel, onSave }) => {
    const [newUser, setNewUser] = useState({ name: '', email: '', phoneNumber: '', address: '', password: '', role: '', status: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleCreateUser = () => {
        onSave(newUser);
    };

    return (
        <div className={styles.createUserModal}>
            <div className={styles.modalContent}>
                <div className="myaccount-info-wrapper">
                    <div className="account-info-wrapper" style={{textAlign: 'center'}}>
                        <h4 style={{fontSize: '24px'}}><strong><i className="fas fa-user-plus"></i> Create New
                            User</strong></h4>
                    </div>
                </div>
                <div className="row">
                    {['Name', 'Email', 'Phone Number', 'Address', 'Password', 'Role', 'Status'].map(field => (
                        <div className="col-lg-6 col-md-6" key={field}>
                            <div className="billing-info">
                                <label>
                                    <i className={`fas fa-${
                                        field === 'Name' ? 'user' :
                                            field === 'Email' ? 'envelope' :
                                                field === 'Phone Number' ? 'phone' :
                                                    field === 'Address' ? 'map-marker-alt' :
                                                        field === 'Password' ? 'lock' :
                                                            field === 'Role' ? 'user-tag' :
                                                                'toggle-on'
                                    } mr-2`}></i>
                                    <strong>{field}</strong>
                                </label>
                                {field === 'Role' ? (
                                    <select
                                        className="form-control"
                                        name="role"
                                        value={newUser.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="SALE_STAFF">Sale Staff</option>
                                        <option value="DELIVERY_STAFF">Delivery Staff</option>
                                        <option value="CUSTOMER">Customer</option>
                                    </select>
                                ) : field === 'Status' ? (
                                    <select
                                        className="form-control"
                                        name="status"
                                        value={newUser.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                ) : (
                                    <input
                                        type={field === 'Email' ? 'email' : field === 'Password' ? 'password' : 'text'}
                                        className="form-control"
                                        name={field.toLowerCase().replace(' ', '')}
                                        value={newUser[field.toLowerCase().replace(' ', '')]}
                                        onChange={handleInputChange}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="billing-back-btn">
                    <div className="billing-btn">
                        <button className="btn mr-2" onClick={handleCreateUser}>
                            <i className="fas fa-plus-circle mr-2"></i>Create
                        </button>
                        <button className="btn" onClick={onCancel}><i className="fas fa-times mr-2"></i>Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CreateUser.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default CreateUser;