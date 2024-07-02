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
    faArrowLeft, faGem, faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import '../../Scss/OrderDetails.scss';
import AddWarranty from "./AddWarranty";



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
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [statusUpdateMessage, setStatusUpdateMessage] = useState('');
    const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);
    const [selectedProductForWarranty, setSelectedProductForWarranty] = useState(null);

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
        status, discountCode, saleId, deliveryId, orderDetails
    } = orderData;

    const toggleCertificate = (certificateUrl) => {
        setSelectedCertificate(certificateUrl);
    };

    //warranty
    const handleManageWarranty = (productId) => {
        setSelectedProductForWarranty(productId);
        setIsWarrantyModalOpen(true);
    };
    const handleWarrantyUpdated = (updatedWarranty) => {
        console.log('Warranty updated:', updatedWarranty);
    };
    return (
        <div className="order-details" style={{paddingBottom:'10%'}}>
            <div className="order-details__id" style={{fontSize: '30px', color: 'black', textAlign: 'center'}}>
                <FontAwesomeIcon icon={faBox}/>Order ID:<span style={{fontWeight: 'bold'}}> {orderId}</span></div>

            <div className="order-details__grid">
                <div className="order-details__main-info order-details__card">
                    <h3 style={{textAlign: 'center'}}>Order Information</h3>
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
                    {discountCode && (
                        <div className="order-details__info-item">
                            <FontAwesomeIcon icon={faPercent}/>
                            <span>Discount Code: {discountCode}</span>
                        </div>
                    )}
                    <div className="order-details__status-container">
                        <div className="order-details__info-item order-details__status">
                            <FontAwesomeIcon icon={faTag} className="order-details__status-icon"/>
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
                                <option value="DELIVERED">Delivery</option>
                                <option value="CANCELED">Canceled</option>
                            </select>
                            <button
                                onClick={handleStatusChange}
                                className="order-details__status-update-btn"
                                disabled={!newStatus}
                            >
                                <FontAwesomeIcon icon={faEdit} className="order-details__update-icon"/>
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

                {/*{paymentInfo && (*/}
                {/*    <>*/}
                {/*        <div className="order-details__info-item">*/}
                {/*            <FontAwesomeIcon icon={faMoneyBillWave}/>*/}
                {/*            <span style={{fontWeight:'bold'}}>: ${paymentInfo.paymentAmount.toFixed(2)/100}</span>*/}
                {/*        </div>*/}
                {/*        <div className="order-details__info-item">*/}
                {/*            <FontAwesomeIcon icon={faCreditCard}/>*/}
                {/*            <span>Payment Mode: {paymentInfo.paymentMode}</span>*/}
                {/*        </div>*/}
                {/*        <div className="order-details__info-item">*/}
                {/*            <FontAwesomeIcon icon={faCalendar}/>*/}
                {/*            <span>Payment Time: {new Date(paymentInfo.paymentTime).toLocaleString()}</span>*/}
                {/*        </div>*/}
                {/*        <div className="order-details__info-item">*/}
                {/*            <FontAwesomeIcon icon={faInfo}/>*/}
                {/*            <span>Description: {paymentInfo.description}</span>*/}
                {/*        </div>*/}
                {/*        <div className="order-details__info-item">*/}
                {/*            <FontAwesomeIcon icon={faCode}/>*/}
                {/*            <span>Payment Code: {paymentInfo.paymentCode}</span>*/}
                {/*        </div>*/}
                {/*    </>*/}
                {/*)}*/}
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
                                        <button onClick={() => handleManageWarranty(item.productId)}>
                                            Manage Warranty
                                        </button>
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
            <AddWarranty
                isOpen={isWarrantyModalOpen}
                onClose={() => setIsWarrantyModalOpen(false)}
                productId={selectedProductForWarranty}
                orderId={orderData.orderId}
                onWarrantyUpdated={handleWarrantyUpdated}
            />
        </div>
    );
};

export default OrderDetails;