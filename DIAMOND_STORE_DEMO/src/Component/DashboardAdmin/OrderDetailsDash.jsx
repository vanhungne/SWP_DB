import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faCalendar,
    faMoneyBillWave,
    faMapMarkerAlt,
    faUser,
    faTruck,
    faPercent,
    faPhone,
    faEnvelope,
    faCreditCard, faInfo, faCode, faClock, faCheckCircle, faTimesCircle, faBoxOpen, faGem
} from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import '../../Scss/OrderDetails.scss';

const statusIcons = {
    PENDING: { icon: faClock, color: '#655e50' },
    CONFIRMED: { icon: faCheckCircle, color: '#4CAF50' },
    PAYMENT: { icon: faCreditCard, color: '#2196F3' },
    DELIVERED: { icon: faTruck, color: '#fbcb09' },
    CANCELED: { icon: faTimesCircle, color: '#F44336' },
    RECEIVED: { icon: faBoxOpen, color: '#795548' }
};

const statusLabels = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PAYMENT: 'PAYMENT',
    DELIVERED: 'DELIVERING',
    CANCELED: 'CANCELED',
    RECEIVED: 'RECEIVED'
};
const OrderDetails = ({ orderData }) => {
    const [customerInfo, setCustomerInfo] = useState(null);
    const [productInfo, setProductInfo] = useState({});
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [diamondInfo, setDiamondInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdditionalData = async () => {
            if (!orderData) return;

            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');

            try {
                // Fetch customer info
                const customerResponse = await axios.get(`${API_URL}manage/accounts/${orderData.customerId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCustomerInfo(customerResponse.data);

                // Fetch product info
                const productInfoMap = {};
                for (const detail of orderData.orderDetails) {
                    try {
                        const productResponse = await axios.get(`${API_URL}product/${detail.productId}`);
                        productInfoMap[detail.productId] = productResponse.data;
                    } catch (productError) {
                        console.error(`Error fetching product ${detail.productId}:`, productError);
                        productInfoMap[detail.productId] = null;
                    }
                }
                setProductInfo(productInfoMap);

                // Fetch diamond info
                const diamondInfoMap = {};
                for (const detail of orderData.orderDetails) {
                    if (detail.diamondId) {
                        try {
                            const diamondResponse = await axios.get(`${API_URL}manage/diamond/${detail.diamondId}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            diamondInfoMap[detail.productId] = diamondResponse.data;
                        } catch (diamondError) {
                            console.error(`Error fetching diamond for product ${detail.productId}:`, diamondError);
                            diamondInfoMap[detail.productId] = null;
                        }
                    }
                }
                setDiamondInfo(diamondInfoMap);

                // Fetch payment info
                try {
                    const paymentResponse = await axios.get(`${API_URL}payment/getPaymentByOrderId/${orderData.orderId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setPaymentInfo(paymentResponse.data.data);
                } catch (paymentError) {
                    console.warn('Payment not found:', paymentError);
                    setPaymentInfo(null);
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch additional order information. Please try again.');
                console.error('Error fetching additional order data:', err);
                setLoading(false);
            }
        };

        fetchAdditionalData();
    }, [orderData]);

    if (!orderData || loading) {
        return <div className="order-details__loading">Loading order details...</div>;
    }

    if (error) {
        return <div className="order-details__error">{error}</div>;
    }

    const {
        orderId, orderDate, orderTotalAmount, orderDeliveryAddress,
        status, discountCode, saleId, deliveryId, orderDetails
    } = orderData;

    const currentStatus = status; // Assuming `status` holds the current status value
    const { icon, color } = statusIcons[currentStatus] || {};

    const toggleCertificate = (certificateUrl) => {
        setSelectedCertificate(certificateUrl);
    };

    return (
        <div className="order-details" style={{marginBottom:'14%'}}>
            <div className="order-details__id" style={{fontSize: '30px', color: 'black', textAlign: 'center'}}>
                <FontAwesomeIcon icon={faBox}/>Order ID:<span style={{fontWeight: 'bold'}}> {orderId}</span></div>

            <div className="order-details__grid">
                <div className="order-details__main-info order-details__card">
                    <h3>Order Information</h3>
                    <div className="order-details__info-item">
                        <FontAwesomeIcon icon={faCalendar}/>
                        <span>Order Date: {new Date(orderDate).toLocaleString()}</span>
                    </div>
                    <div className="order-details__info-item order-details__total">
                        <FontAwesomeIcon icon={faMoneyBillWave}/>
                        <span>Total Amount: ${orderTotalAmount.toFixed(2)}</span>
                    </div>
                    <div className="order-details__info-item">
                        <FontAwesomeIcon icon={faMapMarkerAlt}/>
                        <span>Delivery Address: {orderDeliveryAddress}</span>
                    </div>
                    <div className="order-details__info-item order-details__status" style={{color}}>
                        <FontAwesomeIcon icon={icon}/>
                        <span>Status: {statusLabels[currentStatus]}</span>
                    </div>
                    {discountCode && (
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faPercent}/>
                            <span>Discount Code: {discountCode}</span>
                        </div>
                    )}
                </div>

                <div className="order-details__customer-info order-details__card">
                    <h3>Customer Information</h3>
                    {customerInfo && (
                        <>
                            <div className="order-details__info-item">
                                <FontAwesomeIcon icon={faUser}/>
                                <span>Name: {customerInfo.name}</span>
                            </div>
                            <div className="order-details__info-item">
                                <FontAwesomeIcon icon={faEnvelope}/>
                                <span>Email: {customerInfo.email}</span>
                            </div>
                            <div className="order-details__info-item">
                                <FontAwesomeIcon icon={faPhone}/>
                                <span>Phone: {customerInfo.phoneNumber}</span>
                            </div>
                        </>
                    )}
                </div>
                {paymentInfo ? (
                    <div className="order-details__payment-info order-details__card">
                        <h3 style={{textAlign: 'center'}}>Payment information</h3>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faMoneyBillWave}/>
                            <span
                                style={{fontWeight: 'bold'}}>Payment Amount: ${(paymentInfo.paymentAmount / 100).toFixed(2)}</span>
                        </div>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faCreditCard}/>
                            <span>Payment Mode: {paymentInfo.paymentMode}</span>
                        </div>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faCalendar}/>
                            <span>Payment Time: {new Date(paymentInfo.paymentTime).toLocaleString()}</span>
                        </div>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faInfo}/>
                            <span>Description: {paymentInfo.description}</span>
                        </div>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faCode}/>
                            <span>Payment Code: {paymentInfo.paymentCode}</span>
                        </div>
                    </div>
                ) : (
                    <div className="order-details__payment-info order-details__card">
                        <p>No payment</p>
                    </div>
                )}
            </div>
            <div className="order-details__items order-details__card">
                <div className="order-details__product-list">
                    {orderDetails.map((item, index) => (
                        <div key={index} className="order-details__product-item">
                            <div className="order-details__product-image-container">
                                <img src={productInfo[item.productId]?.image1 || 'placeholder.jpg'}
                                     alt={productInfo[item.productId]?.productName}
                                     className="order-details__product-image"/>
                            </div>
                            <div className="order-details__product-info">
                                <div className="row">
                                    <div className="col-md-9">
                                        <h4>{productInfo[item.productId]?.productName || 'Loading...'}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price:
                                            ${productInfo[item.productId]?.price.toFixed(2) || item.price.toFixed(2)}</p>
                                        {item.size > 0 && (
                                            <p>Size: {item.size}</p>
                                        )}
                                    </div>
                                    <div className="col-md-3">
                                        {diamondInfo[item.productId] && (
                                            <div className="order-details__diamond-info">
                                                <h5 style={{textAlign: 'center'}}><FontAwesomeIcon
                                                    icon={faGem}/> Diamond</h5>
                                                <p>Carat: {diamondInfo[item.productId].carat}</p>
                                                <p>Cut: {diamondInfo[item.productId].cut}</p>
                                                <p>Color: {diamondInfo[item.productId].color}</p>
                                                <p>Clarity: {diamondInfo[item.productId].clarity}</p>
                                                {diamondInfo[item.productId].certification && (
                                                    <div onClick={() => toggleCertificate(diamondInfo[item.productId].certification)}>
                                                        <p style={{fontWeight:'bold',color:'blue'}}>Certificate</p>
                                                    </div>
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

            {selectedCertificate && (
                <div className="certificate-modal" onClick={() => setSelectedCertificate(null)}>
                    <div className="certificate-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedCertificate} alt="Certificate" style={{width: '100%', height: 'auto'}} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default OrderDetails;