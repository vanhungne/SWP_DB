import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendar, faMoneyBillWave, faMapMarkerAlt, faTag, faPercent, faArrowLeft,
    faCreditCard, faInfo, faCode, faGem, faShieldAlt, faUser, faEnvelope, faPhone
} from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import '../../Scss/OrderDetailsC.scss';
import { useParams, useNavigate } from 'react-router-dom';
import WarrantyCustomer from "./WarrantyCustomer"; // Assume you have this component

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState(null);
    const [orderDetailsData, setOrderDetailsData] = useState([]);
    const [productInfo, setProductInfo] = useState({});
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [diamondInfo, setDiamondInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
    const [selectedProductForWarranty, setSelectedProductForWarranty] = useState(null);
    const [selectedCertificate, setSelectedCertificate] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [orderResponse, orderDetailsResponse, paymentResponse] = await Promise.all([
                    axios.get(`${API_URL}order/OrdersData/${orderId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}order/OrderDetailByOrderId/${orderId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}payment/getPaymentByOrderId/${orderId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                setOrderData(orderResponse.data.data);
                setOrderDetailsData(orderDetailsResponse.data.data);
                setPaymentInfo(paymentResponse.data.data);

                // Fetch product and diamond info
                const productPromises = orderDetailsResponse.data.data.map(detail =>
                    axios.get(`${API_URL}product/${detail.productId}`)
                );
                const productResponses = await Promise.all(productPromises);

                const productInfoMap = {};
                const diamondInfoMap = {};

                for (let i = 0; i < productResponses.length; i++) {
                    const detail = orderDetailsResponse.data.data[i];
                    productInfoMap[detail.productId] = productResponses[i].data;

                    if (detail.diamondId) {
                        const diamondResponse = await axios.get(`${API_URL}manage/diamond/${detail.diamondId}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        diamondInfoMap[detail.productId] = diamondResponse.data;
                    }
                }

                setProductInfo(productInfoMap);
                setDiamondInfo(diamondInfoMap);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch order data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [orderId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleManageWarranty = (productId) => {
        setSelectedProductForWarranty(productId);
        setIsWarrantyModalOpen(true);
    };

    const toggleCertificate = (certificateUrl) => {
        setSelectedCertificate(certificateUrl);
    };

    if (loading) {
        return <div className="order-details-c__loading">Loading...</div>;
    }

    if (error) {
        return <div className="order-details-c__error">{error}</div>;
    }

    if (!orderData) {
        return <div className="order-details-c__not-found">Order not found.</div>;
    }
    return (
        <div className="order-details-c">
            <div className="order-details-c__header">
                <button onClick={handleBack} className="order-details-c__back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                </button>
                <h1>Order Details</h1>
            </div>

            <div className="order-details-c__content">
                <div className="order-details-c__top-row">
                    <div className="order-details-c__card order-info">
                        <h2>Order Information</h2>
                        <div className="order-details-c__info-grid">
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
                    </div>

                    {paymentInfo && (
                        <div className="order-details-c__card payment-info">
                            <h2>Payment Information</h2>
                            <div className="order-details-c__info-grid">
                                <div className="order-details-c__info-item">
                                    <FontAwesomeIcon icon={faMoneyBillWave} />
                                    <span>Amount: ${(paymentInfo.paymentAmount / 100).toFixed(2)}</span>
                                </div>
                                <div className="order-details-c__info-item">
                                    <FontAwesomeIcon icon={faCreditCard} />
                                    <span>Mode: {paymentInfo.paymentMode}</span>
                                </div>
                                <div className="order-details-c__info-item">
                                    <FontAwesomeIcon icon={faCalendar} />
                                    <span>Time: {new Date(paymentInfo.paymentTime).toLocaleString()}</span>
                                </div>
                                <div className="order-details-c__info-item">
                                    <FontAwesomeIcon icon={faInfo} />
                                    <span>Description: {paymentInfo.description}</span>
                                </div>
                                <div className="order-details-c__info-item">
                                    <FontAwesomeIcon icon={faCode} />
                                    <span>Payment Code: {paymentInfo.paymentCode}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

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
                                            <p>Price:
                                                ${productInfo[item.productId]?.price ? productInfo[item.productId].price.toFixed(2) : 'N/A'}</p>
                                            {item.size > 0 && <p>Size: {item.size}</p>}
                                            <p className="order-details-c__subtotal">
                                                Subtotal:
                                                ${(item.quantity * (productInfo[item.productId]?.price || 0)).toFixed(2)}
                                            </p>
                                            <button onClick={() => handleManageWarranty(item.productId)}
                                                    className="order-details-c__warranty-btn">
                                                <FontAwesomeIcon icon={faShieldAlt}/> View Warranty
                                            </button>
                                        </div>
                                        <div className="col-md-3"> {diamondInfo[item.productId] && (
                                            <div className="order-details-c__diamond-info">
                                                <h4><FontAwesomeIcon icon={faGem}/> Diamond Information</h4>
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
            </div>

            {selectedCertificate && (
                <div className="certificate-modal" onClick={() => setSelectedCertificate(null)}>
                    <div className="certificate-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedCertificate} alt="Certificate" style={{width: '100%', height: 'auto'}} />
                    </div>
                </div>
            )}

            <WarrantyCustomer
                isOpen={isWarrantyModalOpen}
                onClose={() => setIsWarrantyModalOpen(false)}
                productId={selectedProductForWarranty}
                orderId={orderId}
            />
        </div>
    );
};

export default OrderDetails;