import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCreditCard,
    faInfo,
    faCode,
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
    faEdit,
    faGem
} from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import '../../Scss/OrderDetails.scss';

const OrderDetails = ({ orderData }) => {
    const [customerInfo, setCustomerInfo] = useState(null);
    const [productInfo, setProductInfo] = useState({});
    const [saleInfo, setSaleInfo] = useState(null);
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [diamondInfo, setDiamondInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [statusUpdateMessage, setStatusUpdateMessage] = useState('');

    useEffect(() => {
        const fetchAdditionalData = async () => {
            if (!orderData || !orderData.orderId) return;
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');

                const [customerResponse, saleResponse, deliveryResponse, ...productAndDiamondResponses] = await Promise.all([
                    axios.get(`${API_URL}manage/accounts/${orderData.customerId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    orderData.saleId ? axios.get(`${API_URL}sales/${orderData.saleId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }) : Promise.resolve({ data: null }),
                    orderData.deliveryId ? axios.get(`${API_URL}delivery/${orderData.deliveryId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }) : Promise.resolve({ data: null }),
                    ...orderData.orderDetails.flatMap(detail => [
                        axios.get(`${API_URL}product/${detail.productId}`),
                        detail.diamondId ? axios.get(`${API_URL}manage/diamond/${detail.diamondId}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        }) : Promise.resolve({ data: null })
                    ])
                ]);

                try {
                    const paymentResponse = await axios.get(`${API_URL}payment/getPaymentByOrderId/${orderData.orderId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setPaymentInfo(paymentResponse.data.data);
                } catch (paymentError) {
                    console.warn('Not found payment:', paymentError);
                    setPaymentInfo(null);
                }

                setCustomerInfo(customerResponse.data);
                setSaleInfo(saleResponse.data);
                setDeliveryInfo(deliveryResponse.data);

                const productInfoMap = {};
                const diamondInfoMap = {};
                orderData.orderDetails.forEach((detail, index) => {
                    productInfoMap[detail.productId] = productAndDiamondResponses[index * 2].data;
                    if (detail.diamondId) {
                        diamondInfoMap[detail.productId] = productAndDiamondResponses[index * 2 + 1].data;
                    }
                });
                setProductInfo(productInfoMap);
                setDiamondInfo(diamondInfoMap);

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch additional order information. Please try again.');
                console.error('Error fetching additional order data:', err);
                setLoading(false);
            }
        };

        fetchAdditionalData();
    }, [orderData]);

    const handleStatusChange = async () => {
        if (!newStatus) {
            setStatusUpdateMessage('Please select a new status.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}sale/setOrderStatus/${orderData.orderId}?newStatus=${newStatus}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStatusUpdateMessage('Order status updated successfully.');
            // Update the local state to reflect the change
            orderData.status = newStatus;
        } catch (error) {
            console.error('Error updating order status:', error);
            setStatusUpdateMessage('Failed to update order status. Please try again.');
        }
    };

    if (!orderData || loading) {
        return <div className="order-details__loading">Loading order details...</div>;
    }

    if (error) {
        return <div className="order-details__error">{error}</div>;
    }

    const {
        orderId, orderDate, orderTotalAmount, orderDeliveryAddress,
        status, discountCode, orderDetails
    } = orderData;

    return (
        <div className="order-details">
            <div className="order-details__id" style={{fontSize: '30px', color: 'black', textAlign: 'center'}}>
                <FontAwesomeIcon icon={faBox} /> Order ID: <span style={{fontWeight: 'bold'}}>{orderId}</span>
            </div>

            <div className="order-details__grid">
                <div className="order-details__main-info order-details__card">
                    <h3 style={{textAlign: 'center'}}>Order Information</h3>
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
                    {discountCode && (
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faPercent} />
                            <span>Discount Code: {discountCode}</span>
                        </div>
                    )}
                    <div className="order-details__status-container">
                        <div className="order-details__info-item order-details__status">
                            <FontAwesomeIcon icon={faTag} className="order-details__status-icon" />
                            <span style={{backgroundColor: 'white', color: 'black'}}>Current Status:</span>
                            <span className="order-details__status-value">{status}</span>
                        </div>
                        <div className="order-details__status-update">
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="order-details__status-select"
                            >
                                <option value="">Select new status</option>
                                <option value="CONFIRMED">Confirm</option>
                                <option value="RECEIVED">Receive</option>
                                <option value="CANCELED">Canceled</option>
                            </select>
                            <button
                                onClick={handleStatusChange}
                                className="order-details__status-update-btn"
                                disabled={!newStatus}
                            >
                                <FontAwesomeIcon icon={faEdit} className="order-details__update-icon" />
                                Update
                            </button>
                        </div>
                        {statusUpdateMessage && (
                            <div className="order-details__status-message">
                                {statusUpdateMessage}
                            </div>
                        )}
                    </div>
                </div>

                <div className="order-details__customer-info order-details__card">
                    <h3 style={{textAlign: 'center'}}>Customer Information</h3>
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

                {paymentInfo ? (
                    <div className="order-details__payment-info order-details__card">
                        <h3 style={{textAlign: 'center'}}>Payment Information</h3>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faMoneyBillWave} />
                            <span style={{fontWeight: 'bold'}}>Payment Amount: ${(paymentInfo.paymentAmount / 100).toFixed(2)}</span>
                        </div>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faCreditCard} />
                            <span>Payment Mode: {paymentInfo.paymentMode}</span>
                        </div>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faCalendar} />
                            <span>Payment Time: {new Date(paymentInfo.paymentTime).toLocaleString()}</span>
                        </div>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faInfo} />
                            <span>Description: {paymentInfo.description}</span>
                        </div>
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faCode} />
                            <span>Payment Code: {paymentInfo.paymentCode}</span>
                        </div>
                    </div>
                ) : (
                    <div className="order-details__payment-info order-details__card">
                        <p>No payment information available</p>
                    </div>
                )}
            </div>

            <div className="order-details__items order-details__card">
                <h3>Ordered Items</h3>
                <div className="order-details__product-list">
                    {orderDetails.map((item, index) => (
                        <div key={index} className="order-details__product-item">
                            <div className="order-details__product-image-container">
                                <img src={productInfo[item.productId]?.image1 || 'placeholder.jpg'}
                                     alt={productInfo[item.productId]?.productName}
                                     className="order-details__product-image"/>
                            </div>
                            <div className="order-details__product-info">
                                <div className="order-details__product-main">
                                    <h4>{productInfo[item.productId]?.productName || 'Loading...'}</h4>
                                    <div className="order-details__product-details">
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                        <p><strong>Price:</strong> ${productInfo[item.productId]?.price.toFixed(2) || item.price.toFixed(2)}</p>
                                        {item.size > 0 && (
                                            <p><strong>Size:</strong> {item.size}</p>
                                        )}
                                    </div>
                                </div>
                                {diamondInfo[item.productId] && (
                                    <div className="order-details__diamond-info">
                                        <h5><FontAwesomeIcon icon={faGem}/> Diamond Details</h5>
                                        <div className="order-details__diamond-details">
                                            <p><strong>Carat:</strong> {diamondInfo[item.productId].carat}</p>
                                            <p><strong>Cut:</strong> {diamondInfo[item.productId].cut}</p>
                                            <p><strong>Color:</strong> {diamondInfo[item.productId].color}</p>
                                            <p><strong>Clarity:</strong> {diamondInfo[item.productId].clarity}</p>
                                        </div>
                                        {diamondInfo[item.productId].certification && (
                                            <a href={diamondInfo[item.productId].certification}
                                               target="_blank"
                                               rel="noopener noreferrer"
                                               className="order-details__certificate-link">
                                                View Certificate
                                            </a>
                                        )}
                                    </div>
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