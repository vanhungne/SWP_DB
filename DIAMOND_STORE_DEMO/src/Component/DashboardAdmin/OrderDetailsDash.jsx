import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCalendar, faMoneyBillWave, faMapMarkerAlt, faTag, faUser, faTruck, faPercent, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import '../../Scss/OrderDetails.scss';

const OrderDetails = ({ orderData }) => {
    const [customerInfo, setCustomerInfo] = useState(null);
    const [productInfo, setProductInfo] = useState({});
    const [saleInfo, setSaleInfo] = useState(null);
    const [deliveryInfo, setDeliveryInfo] = useState(null);
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

    return (
        <div className="order-details">
            <div className="order-details__id" style={{fontSize:'30px',color:'black',textAlign:'center'}}>
                <FontAwesomeIcon icon={faBox} />Order ID:<span style={{fontWeight:'bold'}}> {orderId}</span> </div>

            <div className="order-details__grid">
                <div className="order-details__main-info order-details__card">
                    <h3>Order Information</h3>
                    <div className="order-details__info-item">
                        <FontAwesomeIcon icon={faCalendar} />
                        <span>Order Date: {new Date(orderDate).toLocaleString()}</span>
                    </div>
                    <div className="order-details__info-item order-details__total">
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                        <span>Total Amount: ${orderTotalAmount.toFixed(2)}</span>
                    </div>
                    <div className="order-details__info-item">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>Delivery Address: {orderDeliveryAddress}</span>
                    </div>
                    <div className="order-details__info-item order-details__status">
                        <FontAwesomeIcon icon={faTag} />
                        <span>Status: {status}</span>
                    </div>
                    {discountCode && (
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faPercent} />
                            <span>Discount Code: {discountCode}</span>
                        </div>
                    )}
                    <div className="order-details__info-item">
                        <FontAwesomeIcon icon={faTruck} />
                        {/*<span>Sale ID: {saleId}, Delivery ID: {deliveryId}</span>*/}
                        {saleInfo?.name && <span> - Sale: {saleInfo.name}</span>}
                        {deliveryInfo?.name && <span> - Delivery: {deliveryInfo.name}</span>}
                        {(!saleInfo?.name && !deliveryInfo?.name) && <span> - Sale: null, Delivery: null</span>}
                    </div>
                </div>

                <div className="order-details__customer-info order-details__card">
                    <h3>Customer Information</h3>
                    {customerInfo && (
                        <>
                            <div className="order-details__info-item">
                                <FontAwesomeIcon icon={faUser} />
                                <span>Name: {customerInfo.name}</span>
                            </div>
                            <div className="order-details__info-item">
                                <FontAwesomeIcon icon={faEnvelope} />
                                <span>Email: {customerInfo.email}</span>
                            </div>
                            <div className="order-details__info-item">
                                <FontAwesomeIcon icon={faPhone} />
                                <span>Phone: {customerInfo.phoneNumber}</span>
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
                                <img src={productInfo[item.productId]?.image1 || 'placeholder.jpg'} alt={productInfo[item.productId]?.productName} className="order-details__product-image" />
                            </div>
                            <div className="order-details__product-info">
                                <h4>{productInfo[item.productId]?.productName || 'Loading...'}</h4>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${productInfo[item.productId]?.price.toFixed(2) || item.price.toFixed(2)}</p>
                                {item.size > 0 && (
                                    <p>Size: {item.size}</p>
                                )}
                                <p className="order-details__subtotal">Subtotal:
                                    ${(item.quantity * (productInfo[item.productId]?.price || item.price)).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;