import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import CartItem from './CartItem'; // Adjust path if necessary
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Scss/cart.scss'; // Import the SCSS file
import { API_URL } from '../../Config/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const cartFromCookie = getCartFromCookie();
        setCartItems(cartFromCookie);
    }, []);

    const handleQuantityChange = async (productId, quantity) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}cart/update`,
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const updatedItems = cartItems.map((item) =>
                item.productId === productId ? { ...item, quantity: Number(quantity) } : item
            );
            setCartItems(updatedItems);
            updateCartCookie(updatedItems);
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error updating the quantity. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}cart/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({ productId }),
            });
            const updatedItems = cartItems.filter((item) => item.productId !== productId);
            setCartItems(updatedItems);
            updateCartCookie(updatedItems);
        } catch (error) {
            console.error('Error removing item from cart:', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error removing the item from your cart. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }
    };

    const getCartFromCookie = () => {
        const cartCookie = Cookies.get('cart');
        if (cartCookie) {
            const decodedCart = atob(cartCookie);
            return JSON.parse(decodedCart);
        }
        return [];
    };

    const updateCartCookie = (items) => {
        const encodedCart = btoa(JSON.stringify(items));
        Cookies.set('cart', encodedCart, { expires: 7, path: '/' });
    };

    const clearCart = () => {
        setCartItems([]);
        Cookies.remove('cart');
    };

    const navigateToCheckout = () => {
        navigate('/checkout'); // Navigate to checkout page
    };

    return (
        <div className="cart-container mt-5">
            <div className="cart-header">
                <h2><FontAwesomeIcon icon={faShoppingCart} /> Cart</h2>
            </div>
            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <CartItem
                            key={item.productId}
                            item={item}
                            onQuantityChange={handleQuantityChange}
                            onRemoveFromCart={handleRemoveFromCart}
                        />
                    ))}
                </div>
            )}
            <div className="row mt-3">
                <div className="col-lg-3"></div>
                <div className="col-lg-3 text-center">
                    <button className="btn btn-danger" onClick={clearCart}>
                        <FontAwesomeIcon icon={faTrashAlt} /> Clear Cart
                    </button>
                </div>
                <div className="col-lg-3 text-center">
                    <button className="btn btn-primary" onClick={navigateToCheckout}>
                        Go to Checkout
                    </button>
                </div>
                <div className="col-lg-3"></div>
            </div>
        </div>
    );
};

export default Cart;
