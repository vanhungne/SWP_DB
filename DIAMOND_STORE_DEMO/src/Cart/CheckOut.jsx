import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import '../Scss/Checkout.scss';
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const cartFromCookie = getCartFromCookie();
        setCartItems(cartFromCookie);
    }, []);

    const getCartFromCookie = () => {
        const cartCookie = Cookies.get('cart');
        if (cartCookie) {
            const decodedCart = atob(cartCookie);
            return JSON.parse(decodedCart);
        }
        return [];
    };


    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.totalPrice * item.quantity, 0).toFixed(2);
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
            const response = await axios.post(
                'http://localhost:8080/cart/checkout',
                { deliveryAddress },
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
    <div className="container mt-5">
        <div className="order-summary-section">
            <div className="mb-3">
                <div className="card-header">
                    <h3>Order Summary</h3>
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Item</th>
                            <th scope="col">Size</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <img
                                        src={`http://localhost:8080/product/load-image/${item.image1}.jpg`}
                                        alt={item.name}
                                        className="img-fluid"
                                        style={{ maxWidth: '100px', marginRight: '10px' }}
                                    />
                                    {item.name}
                                </td>
                                <td>{item.size}</td>
                                <td>{item.quantity}</td>
                                <td>${item.totalPrice.toFixed(2)}</td>
                                <td>${(item.totalPrice * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer text-right">
                    <h4>Total: ${calculateTotal()}</h4>
                </div>
            </div>
        </div>
        <div className="delivery-address-section">
            <h2>Delivery Address</h2>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="deliveryAddress" className="form-label">Delivery Address:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="deliveryAddress"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                        />
                    </div>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <button
                        className="btn btn-primary"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);
};

export default Checkout;