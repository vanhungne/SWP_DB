import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import '../../Scss/Register.css';
import {API_URL} from "../../Config/config";


function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [emailValidationMessage, setEmailValidationMessage] = useState("");
    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        if (email) {
            const checkEmail = async () => {
                try {
                    const response = await axios.post(`${API_URL}login/checkemail`, { email });
                    if (response.data.exists) {
                        setEmailValidationMessage("Email is already taken");
                    } else {
                        setEmailValidationMessage("");
                    }
                } catch (error) {
                    console.error("Error checking email", error);
                }
            };
            checkEmail();
        }
    }, [email]);

    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = "Name is required";
        if (!email) errors.email = "Email is required";
        if (!password) errors.password = "Password is required";
        if (!phoneNumber) errors.phoneNumber = "Phone number is required";
        if (!address) errors.address = "Address is required";
        return errors;
    };

    async function save(event) {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        if (emailValidationMessage) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: emailValidationMessage,
            });
            return;
        }

        try {
            await axios.post(`${API_URL}login/signup`, {
                name: name,
                password: password,
                phoneNumber: phoneNumber,
                email: email,
                address: address
            });
            Swal.fire({
                icon: 'success',
                title: 'Customer Registration Successfully',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                navigate('/verifycode');
                navigate(`/verifycode/${email}`);
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            });
        }
    }


    return (
        <div className="register-container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{ width: '500px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Customer Registration</h2>
                    <form onSubmit={save}>
                        <div className="form-group">
                            <label>Customer Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter Name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                            {errorMessages.name && <small className="text-danger">{errorMessages.name}</small>}
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            {errorMessages.password && <small className="text-danger">{errorMessages.password}</small>}
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Enter Phone Number"
                                value={phoneNumber}
                                onChange={(event) => setPhoneNumber(event.target.value)}
                            />
                            {errorMessages.phoneNumber && <small className="text-danger">{errorMessages.phoneNumber}</small>}
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            {emailValidationMessage && (
                                <small className="text-danger">{emailValidationMessage}</small>
                            )}
                            {errorMessages.email && <small className="text-danger">{errorMessages.email}</small>}
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Address"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                            />
                            {errorMessages.address && <small className="text-danger">{errorMessages.address}</small>}
                        </div>
                        <div   style={{width:'100%',textAlign:'center'}}>
                            <button type="submit" className="btn"
                                    style={{backgroundColor:"blue", color: 'white', textDecoration: 'none',width:'40%' }}>
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;