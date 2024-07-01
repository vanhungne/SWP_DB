import React, { useEffect, useState } from 'react';
import Sidebar from '../Manager/Sidebar';
import ProductTable from '../Manager/ProductTable';
import '../../Scss/ManagerDashBoard.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import ShellTable from '../Manager/ShellTable';
import EditProduct from "../Manager/EditProduct";
import ViewShell from '../Manager/ViewShell';
import EditShell from '../Manager/EditShell';
import DiamondTable from "./DiamondTable";
import ViewDiamond from "./ViewDiamond";
import EditDiamond from "./EditDiamond";
import ViewProduct from "./ViewProduct";
import OrderDashboard from "../DashboardAdmin/OrderDashboard";
import OrderDetailsDash from "../DashboardAdmin/OrderDetailsDash";
import orderDetailsDash from "../DashboardAdmin/OrderDetailsDash";

const Dashboard = () => {
    const [productsPage, setProductsPage] = useState({
        content: [],
        totalPages: 0,
        pageNumber: 0,
        totalElements: 0
    });
    const [activePage, setActivePage] = useState('products');
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedShellId, setSelectedShellId] = useState(null);
    const [selectedDiamondId, setSelectedDiamondId] = useState(null);

    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderDetailsData, setOrderDetailsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');


    const clearData = () => {
        setProductsPage({
            content: [],
            totalPages: 0,
            pageNumber: 0,
            totalElements: 0
        });
    };

    const navigateToDashboard = () => {
        setCurrentView('dashboard');
        setSelectedProductId(null);
        setSelectedShellId(null);
    };
    const navigateToShellDetail = (shellId) => {
        setCurrentView('shellDetail');
        setSelectedShellId(shellId);
    };
    const navigateToProductDetail = (productId) => {
        setCurrentView('productDetail');
        setSelectedProductId(productId);
    };

    const handleOrderClick = async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}order/OrdersData/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOrderDetailsData(response.data.data);
            setSelectedOrderId(orderId);
        } catch (err) {
            setError('Failed to fetch order details. Please try again.');
            console.error('Error fetching order details:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <Sidebar activePage={activePage} setActivePage={setActivePage} setCurrentView={setCurrentView} />
            <div className="main-content">
                {activePage === 'products' && (
                    <>
                        {currentView === 'dashboard' && (
                            <>
                                <ProductTable setSelectedProductId={setSelectedProductId} setCurrentView={setCurrentView}/>
                            </>
                        )}
                        {currentView === 'productDetail' && (
                            <>
                                <ViewProduct productId={selectedProductId} goBack={navigateToDashboard} />
                            </>
                        )}
                        {currentView === 'editProduct' && (
                            <>
                                <EditProduct productId={selectedProductId} goBack={navigateToDashboard} viewProduct={navigateToProductDetail}/>
                            </>
                        )}
                    </>
                )}
                {activePage === 'orders' && (
                    <>
                        {currentView === 'dashboard' && (
                            <OrderDashboard onOrderClick={handleOrderClick} />
                        )}
                        {selectedOrderId && (
                            <OrderDetailsDash orderData={orderDetailsData} />
                        )}
                    </>
                )}
                {activePage === 'shells' && (
                    <>
                        {currentView === 'dashboard' && (
                            <>
                                <ShellTable setSelectedShellId={setSelectedShellId} setCurrentView={setCurrentView}/>
                            </>
                        )}
                        {currentView === 'shellDetail' && (
                            <>
                                <ViewShell shellId={selectedShellId} goBack={navigateToDashboard} />
                            </>
                        )}
                        {currentView === 'editShell' && (
                            <>
                                <EditShell shellId={selectedShellId} goBack={navigateToDashboard} viewShell={navigateToShellDetail} />
                            </>
                        )}
                    </>
                )}
                {activePage === 'diamonds' && (
                    <>
                        {currentView === 'dashboard' && (
                            <>
                                <DiamondTable setSelectedDiamondId={setSelectedDiamondId} setCurrentView={setCurrentView}/>
                            </>
                        )}
                        {currentView === 'diamondDetail' && (
                            <ViewDiamond diamondId={selectedDiamondId} goBack={navigateToDashboard} />
                        )}
                        {currentView === 'editDiamond' && (
                            <EditDiamond diamondId={selectedDiamondId} goBack={navigateToDashboard} />
                        )}
                    </>
                )}
                {activePage === 'category' && (
                    <>
                        {currentView === 'dashboard' && (
                            <>
                            
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
