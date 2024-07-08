import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../Scss/CartItem.scss';

const CartItem = ({ item, onQuantityChange, onRemoveFromCart }) => {
    const handleQuantityDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.productId, item.quantity - 1);
        }
    };

    const handleQuantityIncrease = () => {
        onQuantityChange(item.productId, item.quantity + 1);
    };

    const handleRemoveFromCart = () => {
        onRemoveFromCart(item.productId);
    };

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img src={item.image1} alt={item.productName} />
            </div>
            <div className="cart-item-info">
                <h3 className="item-name">{item.productName}</h3>
                <div className="item-details">
                    <span className="item-size">{item.size} cm</span>
                    <span className="item-price">${item.totalPrice.toFixed(2)}</span>
                </div>
                <div className="quantity-actions">
                    <div className="quantity-control">
                        <button onClick={handleQuantityDecrease} aria-label="Decrease quantity">
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button onClick={handleQuantityIncrease} aria-label="Increase quantity">
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <button className="remove-button" onClick={handleRemoveFromCart} aria-label="Remove item">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;