import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import '../Scss/myAccount.scss';
import { API_URL } from "../Config/config";
import { jwtDecode } from 'jwt-decode';

const MyAccount = () => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        accumulatedPoints: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken && decodedToken.id) {
                fetchUserInfo(decodedToken.id);
            } else {
                setError('User ID not found in the token');
            }
        } else {
            setError('User is not logged in or token is missing');
        }
    }, [token]);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}manage/accounts/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserInfo(response.data);
        } catch (error) {
            setError('Failed to fetch user information');
            console.error('Error fetching user info:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const decodedToken = jwtDecode(token);
        try {
            await axios.put(`${API_URL}manage/accounts/${decodedToken.id}`, userInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess('Account information updated successfully');
            setIsEditing(false);
        } catch (error) {
            setError('Failed to update account information');
            console.error('Error updating user info:', error);
        }
    }
    return (
        <div className="my-account-container">
            <div className="my-account-card">
                <h2 className="my-account-title">My Account</h2>
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit} className="my-account-form">
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faUser} className="icon" /> Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userInfo.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faPhone} className="icon" /> Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={userInfo.phoneNumber}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faEnvelope} className="icon" /> Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> Address</label>
                        <textarea
                            name="address"
                            value={userInfo.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="form-group">
                        <label><FontAwesomeIcon icon={faStar} className="icon" /> Accumulated Points</label>
                        <input
                            type="number"
                            value={userInfo.accumulatedPoints}
                            disabled
                            className="accumulated-points" style={{width:'20%'}}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="button-group col-md-3" style={{width: '40%'}}>
                            {isEditing ? (
                                <>
                                    <button type="button" className="btn btn-secondary"
                                            onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                    Edit Information
                                </button>
                            )}
                        </div>
                        <div className="col-md-3"></div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default MyAccount;
