import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faCalendar,
    faMoneyBillWave,
    faMapMarkerAlt,
    faTag,
    faUser,
    faTruck,
    faPercent,
    faPhone,
    faEnvelope,
    faCreditCard, faInfo, faCode, faClock, faCheckCircle, faTimesCircle, faBoxOpen
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
    const [saleInfo, setSaleInfo] = useState(null);
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdditionalData = async () => {
            if (!orderData) return;

            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const [customerResponse, saleResponse, deliveryResponse, ...productResponses] = await Promise.all([
                    axios.get(`${API_URL}manage/accounts/${orderData.customerId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    orderData.saleId ? axios.get(`${API_URL}sales/${orderData.saleId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }) : Promise.resolve({ data: null }),
                    orderData.deliveryId ? axios.get(`${API_URL}delivery/${orderData.deliveryId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }) : Promise.resolve({ data: null }),
                    ...orderData.orderDetails.map(detail =>
                        axios.get(`${API_URL}product/${detail.productId}`)
                    )
                ]);
                const paymentResponse = await axios.get(`${API_URL}payment/getPaymentByOrderId/${orderData.orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setPaymentInfo(paymentResponse.data.data);


                setCustomerInfo(customerResponse.data);
                setSaleInfo(saleResponse.data);
                setDeliveryInfo(deliveryResponse.data);

                const productInfoMap = {};
                productResponses.forEach((response, index) => {
                    productInfoMap[orderData.orderDetails[index].productId] = response.data;
                });
                setProductInfo(productInfoMap);

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

    return (
        <div className="order-details">
            <div className="order-details__id" style={{fontSize:'30px',color:'black',textAlign:'center'}}>
                <FontAwesomeIcon icon={faBox} />Order ID:<span style={{fontWeight:'bold'}}> {orderId}</span> </div>

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
                    {/*<div className="order-details__info-item">*/}
                    {/*    <FontAwesomeIcon icon={faTruck}/>*/}
                    {/*    /!*<span>Sale ID: {saleId}, Delivery ID: {deliveryId}</span>*!/*/}
                    {/*    {saleInfo?.name && <span> - Sale: {saleInfo.name}</span>}*/}
                    {/*    {deliveryInfo?.name && <span> - Delivery: {deliveryInfo.name}</span>}*/}
                    {/*    {(!saleInfo?.name && !deliveryInfo?.name) && <span> - Sale: null, Delivery: null</span>}*/}
                    {/*</div>*/}
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
                <div className="order-details__payment-info order-details__card">
                    <h3>Payment Information</h3>
                    {paymentInfo && (
                        <>
                            <div className="order-details__info-item">
                                <FontAwesomeIcon icon={faMoneyBillWave}/>
                                <span style={{fontWeight:'bold'}}>Payment Amount: ${paymentInfo.paymentAmount.toFixed(2)/100}</span>
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
                        </>
                    )}
                </div>
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
                                <h4>{productInfo[item.productId]?.productName || 'Loading...'}</h4>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${productInfo[item.productId]?.price.toFixed(2) || item.price.toFixed(2)}</p>
                                {item.size > 0 && (
                                    <p>Size: {item.size}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;