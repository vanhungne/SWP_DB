import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMoneyBillWave, faMapMarkerAlt, faTag, faPercent, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import '../../Scss/OrderDetailsC.scss';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [orderDetailsData, setOrderDetailsData] = useState([]);
    const [productInfo, setProductInfo] = useState({});
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const orderResponse = await axios.get(`${API_URL}order/OrderDetailByOrderId/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (orderResponse.data.data && orderResponse.data.data.length > 0) {
                    setOrderDetailsData(orderResponse.data.data);

                    const productPromises = orderResponse.data.data.map(detail =>
                        axios.get(`${API_URL}product/${detail.productId}`)
                    );
                    const productResponses = await Promise.all(productPromises);
                    const productInfoMap = {};
                    productResponses.forEach((response, index) => {
                        productInfoMap[orderResponse.data.data[index].productId] = response.data;
                    });
                    setProductInfo(productInfoMap);
                } else {
                    setError('Order details not found');
                }
            } catch (err) {
                setError('Failed to fetch order details. Please try again.');
                console.error('Error fetching order details:', err);
            }
        };

        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}order/OrdersData/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.success) {
                    setOrderData(response.data.data);
                } else {
                    setError('Order data not found');
                }
            } catch (err) {
                console.error('Error fetching order data:', err);
                setError('Failed to fetch order data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
        fetchOrder();
    }, [orderId]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="order-details-c__loading">Loading...</div>;
    }

    if (error) {
        return <div className="order-details-c__error">{error}</div>;
    }

    if (!orderData || typeof orderData !== 'object') {
        return <div className="order-details-c__not-found">No order data found.</div>;
    }

    return (
        <div className="order-details-c">
            <div className="order-details-c__header">
                <button onClick={handleBack} className="order-details-c__back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
                <h2 style={{textAlign:'center'}}>Order Details</h2>
            </div>
            <div className="order-details-c__content">
                <div className="order-details-c__main-info order-details-c__card">
                    <h3>Order Information</h3>
                    <div className="order-details-c__info-item">
                        <FontAwesomeIcon icon={faCalendar} />
                        <span>Order Date: {new Date(orderData.orderDate).toLocaleString()}</span>
                    </div>
                    <div className="order-details-c__info-item order-details-c__total">
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                        <span>Total Amount: ${orderData.orderTotalAmount.toFixed(2)}</span>
                    </div>
                    <div className="order-details-c__info-item">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>Delivery Address: {orderData.orderDeliveryAddress}</span>
                    </div>
                    <div className="order-details-c__info-item order-details-c__status">
                        <FontAwesomeIcon icon={faTag} />
                        <span>Status: {orderData.status}</span>
                    </div>
                    {orderData.discountCode && (
                        <div className="order-details-c__info-item">
                            <FontAwesomeIcon icon={faPercent} />
                            <span>Discount Code: {orderData.discountCode}</span>
                        </div>
                    )}
                </div>

                <div className="order-details-c__items order-details-c__card">
                    <h3>Ordered Items</h3>
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
                                <div className="order-details-c__product-info">
                                    <h4>{productInfo[item.productId]?.productName || 'Product Name'}</h4>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>
                                        Price: ${productInfo[item.productId]?.price ? productInfo[item.productId]?.price.toFixed(2) : item.price.toFixed(2)}
                                    </p>
                                    {item.size > 0 && <p>Size: {item.size}</p>}
                                    <p className="order-details-c__subtotal">
                                        Subtotal: $
                                        {(item.quantity * (productInfo[item.productId]?.price || item.price)).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OrderDetails;