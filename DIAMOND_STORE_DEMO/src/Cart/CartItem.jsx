// CartItem.js
import React from 'react';
import '../Scss/CartItem.scss';

const CartItem = ({item, onQuantityChange, onRemoveFromCart}) => {
    const handleQuantityChange = (event) => {
        const newQuantity = event.target.value;
        onQuantityChange(item.productId, newQuantity);
    };

    const handleRemoveFromCart = () => {
        onRemoveFromCart(item.productId);
    };

    return (
        <div className="cart-item">
            <img
                src={`http://localhost:8080/product/load-image/${item.image1}.jpg`}
                alt={item.productName}
            />
            <div className="item-details">
                <h3>{item.productName}</h3>
                <p>Size: {item.size} cm</p>
                <p>Price: ${item.totalPrice.toFixed(2)}</p>
            </div>
            <div className="item-actions">
                <button className="btn btn-danger" onClick={handleRemoveFromCart}>Remove</button>
            </div>
        </div>
    );
};

export default CartItem;