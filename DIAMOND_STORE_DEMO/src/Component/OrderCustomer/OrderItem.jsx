import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faGem } from '@fortawesome/free-solid-svg-icons';

const OrderedItems = ({
                          orderDetailsData,
                          productInfo,
                          diamondInfo,
                          orderStatus,
                          handleManageWarranty,
                          toggleCertificate
                      }) => {
    return (
        <div className="order-details-c__card products">
            <h2>Ordered Items</h2>
            <div className="order-details-c__product-list">
                {orderDetailsData.map((item, index) => (
                    <div key={index} className="order-details-c__product-item">
                        <div className="order-details-c__product-image-container">
                            <img
                                src={productInfo[item.productId]?.image1 || 'placeholder.jpg'}
                                alt={productInfo[item.productId]?.productName || 'Product Image'}
                                className="order-details-c__product-image"
                            />
                        </div>
                        <div className="order-details-c__product-info row">
                            <div className="row">
                                <div className="col-md-9">
                                    <h3>{productInfo[item.productId]?.productName || 'Product Name'}</h3>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${productInfo[item.productId]?.price ? productInfo[item.productId].price.toFixed(2) : 'N/A'}</p>
                                    {item.size > 0 && <p>Size: {item.size}</p>}
                                    <button
                                        onClick={() => handleManageWarranty(item.productId)}
                                        className="order-details-c__warranty-btn"
                                    >
                                        <FontAwesomeIcon icon={faShieldAlt}/> View Warranty
                                    </button>
                                </div>
                                <div className="col-md-3">
                                    {diamondInfo[item.productId] && (
                                        <div className="order-details-c__diamond-info">
                                            <h4><FontAwesomeIcon icon={faGem}/> Diamond Information</h4>
                                            <p>Carat: {diamondInfo[item.productId].carat}</p>
                                            <p>Cut: {diamondInfo[item.productId].cut}</p>
                                            <p>Color: {diamondInfo[item.productId].color}</p>
                                            <p>Clarity: {diamondInfo[item.productId].clarity}</p>
                                            {orderStatus === "PAYMENT" || orderStatus === "CONFIRMED" || orderStatus === "DELIVERED" ? (
                                                diamondInfo[item.productId].certification && (
                                                    <div onClick={() => toggleCertificate(diamondInfo[item.productId].certification)}>
                                                        <p style={{fontWeight: 'bold', color: 'blue'}}>Certificate</p>
                                                    </div>
                                                )
                                            ) : (
                                                <p style={{fontWeight: 'bold', color: 'red'}}>
                                                    Please complete payment to view Certificate
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderedItems;