import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { FiUser, FiLock, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { API_URL } from "../../Config/config";
import '../../Scss/Register.scss';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: ""
    });
    const [emailValidationMessage, setEmailValidationMessage] = useState("");
    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        if (formData.email) {
            const checkEmail = async () => {
                try {
                    const response = await axios.post(`${API_URL}login/checkemail`, { email: formData.email });
                    setEmailValidationMessage(response.data.exists ? "Email is already taken" : "");
                } catch (error) {
                    console.error("Error checking email", error);
                }
            };
            checkEmail();
        }
        window.scrollTo(0, 0);
    }, [formData.email]);

    const validateForm = () => {
        const errors = {};
        Object.keys(formData).forEach(key => {
            if (!formData[key]) errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        });
        return errors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        if (emailValidationMessage) {
            iziToast.error({
                title: 'Error',
                message: emailValidationMessage,
                position: 'topRight'
            });
            return;
        }

        try {
            await axios.post(`${API_URL}login/signup`, formData);
            iziToast.success({
                title: 'Success',
                message: 'Customer Registration Successful',
                position: 'topRight',
                onClosing: () => {
                    navigate(`/verifycode/${formData.email}`);
                }
            });
        } catch (err) {
            iziToast.error({
                title: 'Error',
                message: err.response?.data?.message || 'An error occurred during registration',
                position: 'topRight'
            });
        }
    };
    return (
        <div className="ed-register-container">
            <div className="ed-register-card">
                <h2 className="ed-register-title">Customer Registration</h2>
                <form onSubmit={handleSubmit} className="ed-register-form">
                    <div className="ed-form-group">
                        <FiUser className="ed-input-icon" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="ed-input"
                        />
                        {errorMessages.name && <small className="ed-error-message">{errorMessages.name}</small>}
                    </div>
                    <div className="ed-form-group">
                        <FiLock className="ed-input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="ed-input"
                        />
                        {errorMessages.password && <small className="ed-error-message">{errorMessages.password}</small>}
                    </div>
                    <div className="ed-form-group">
                        <FiPhone className="ed-input-icon" />
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Enter Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="ed-input"
                        />
                        {errorMessages.phoneNumber && <small className="ed-error-message">{errorMessages.phoneNumber}</small>}
                    </div>
                    <div className="ed-form-group">
                        <FiMail className="ed-input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="ed-input"
                        />
                        {emailValidationMessage && <small className="ed-error-message">{emailValidationMessage}</small>}
                        {errorMessages.email && <small className="ed-error-message">{errorMessages.email}</small>}
                    </div>
                    <div className="ed-form-group">
                        <FiMapPin className="ed-input-icon" />
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="ed-input"
                        />
                        {errorMessages.address && <small className="ed-error-message">{errorMessages.address}</small>}
                    </div>
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <button type="submit" className="ed-btn-primary">Register</button>
                        </div>

                        <div className="col-md-3"></div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Register;