import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faTruck, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import '../../Scss/Checkout.scss';
import { jwtDecode } from 'jwt-decode';

const Checkout = () => {
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [useAllPoints, setUseAllPoints] = useState(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        accumulatedPoints: 0
    });

    useEffect(() => {
        const cartFromCookie = getCartFromCookie();
        setCartItems(cartFromCookie);
        fetchUserInfo();
    }, []);


    const getCartFromCookie = () => {
        const cartCookie = Cookies.get('cart');
        if (cartCookie) {
            const decodedCart = atob(cartCookie);
            return JSON.parse(decodedCart);
        }
        return [];
    };

    const fetchUserInfo = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken && decodedToken.id) {
                try {
                    const response = await axios.get(`${API_URL}manage/accounts/${decodedToken.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUserInfo(response.data);
                    setDeliveryAddress(response.data.address);
                } catch (error) {
                    setError('Failed to fetch user information');
                    console.error('Error fetching user info:', error);
                }
            } else {
                setError('User ID not found in the token');
            }
        } else {
            setError('User is not logged in or token is missing');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.totalPrice * item.quantity, 0).toFixed(2);
    };
    const handleUseAllPointsChange = (e) => {
        setUseAllPoints(e.target.checked);
    };

    const handleCheckout = async () => {
        if (!deliveryAddress) {
            setError('Delivery address is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const pointsToUse = useAllPoints ? userInfo.accumulatedPoints : 0;
            const response = await axios.post(
                `${API_URL}cart/checkout`,
                { deliveryAddress, code, point: pointsToUse },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setLoading(false);
            const { orderId } = response.data;

            if (orderId) {
                Cookies.remove('cart');
                navigate(`/payment/${orderId}`);
            } else {
                throw new Error('Order ID not received');
            }

        } catch (error) {
            setLoading(false);
            console.error('Error during checkout:', error);
            setError('Error during checkout. Please try again later.');
        }
    };

    return (
        <div className="container mt-5 checkout-container" style={{marginBottom:'5%'}}>
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="row"
            >
                <div className="col-md-6">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h3><FontAwesomeIcon icon={faGift} className="me-2"/>Express Checkout</h3>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Shipping Method</label>
                                <div className="d-flex">
                                    <div className="form-check me-3">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="shipItems"
                                            name="shippingMethod"
                                            value="ship"
                                            checked={true}
                                            readOnly
                                        />
                                        <label className="form-check-label" htmlFor="shipItems">
                                            <FontAwesomeIcon icon={faTruck} className="me-2"/>Ship My Items
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Name" className="form-label">Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Name"
                                    value={userInfo.name}
                                    disabled
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phoneNumber" className="form-label">Phone Number:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phoneNumber"
                                    value={userInfo.phoneNumber}
                                    disabled
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="deliveryAddress" className="form-label">Shipping Address:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="deliveryAddress"
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="code" className="form-label">Discount Code:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="code"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="accumulatedPoints" className="form-label">Accumulated
                                            Points:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="accumulatedPoints"
                                            value={userInfo.accumulatedPoints}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="useAllPoints"
                                    checked={useAllPoints}
                                    onChange={handleUseAllPointsChange}
                                />
                                <label className="form-check-label" htmlFor="useAllPoints">
                                    Use all accumulated points
                                </label>
                            </div>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <div style={{textAlign:'center'}}>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    style={{maxWidth: '35%'}}>
                                    {loading ? 'Processing...' : <><FontAwesomeIcon icon={faCreditCard}
                                                                                    className="me-2"/>Place
                                        Order</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-secondary text-white">
                            <h3>Order Summary</h3>
                        </div>
                        <div className="card-body">
                            {cartItems.map((item) => (
                                <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={item.image1}
                                            alt={item.productName}
                                            className="img-fluid me-2"
                                            style={{maxWidth: '100px'}}
                                        />
                                        <div>
                                            <h6 className="mb-0">{item.productName}</h6>
                                            <small className="text-muted">Size: {item.size},
                                                Quantity: {item.quantity}</small>
                                        </div>
                                    </div>
                                    <span>${(item.totalPrice * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="card-footer">
                            <div className="d-flex justify-content-between">
                                <h5>Total:</h5>
                                <h5>${calculateTotal()}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Checkout;