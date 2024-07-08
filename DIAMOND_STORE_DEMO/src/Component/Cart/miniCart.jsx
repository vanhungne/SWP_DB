import React from 'react';
import './MiniCart.scss';

const MiniCart = ({ cartItems }) => {
    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <div className="mini-cart">
            <h3 style={{textAlign:'center'}}>My Cart</h3>
            {cartItems.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
            ) : (
                <>
                    <div className="mini-cart-items">
                        {cartItems.slice(0, 3).map((item, index) => (
                            <div key={index} className="mini-cart-item">
                                <img src={item.image1} alt={item.productName} />
                                <div className="mini-cart-item-details">
                                    <p className="item-name">{item.productName}</p>
                                    <p className="item-quantity">Qty: {item.quantity}</p>
                                    <p className="item-price">${item.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {cartItems.length > 3 && (
                        <p className="more-items">and {cartItems.length - 3} more item(s)</p>
                    )}
                    <div className="mini-cart-footer">
                        <div className="total-price">
                            <span>Total:</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <button className="view-cart-btn">View Cart</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MiniCart;