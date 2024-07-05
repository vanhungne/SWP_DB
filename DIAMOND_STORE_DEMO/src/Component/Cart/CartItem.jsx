import React from 'react';
import '../../Scss/CartItem.scss';


const CartItem = ({item, onQuantityChange, onRemoveFromCart}) => {
    const handleRemoveFromCart = () => {
        onRemoveFromCart(item.productId);
    };

    return (
        <div className="cart-item">
            <img
                src={item.image1}
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