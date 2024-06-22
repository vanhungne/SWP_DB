import React, { useEffect, useState } from 'react';
import Sidebar from '../Manager/Sidebar';
import ProductTable from '../Manager/ProductTable';
import '../../Scss/ManagerDashBoard.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import ProductView from "./ProductView";
import OrderTable from '../Manager/OrderTable';

const Dashboard = () => {
    const [productsPage, setProductsPage] = useState({
        content: [],
        totalPages: 0,
        pageNumber: 0,
        totalElements: 0
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(12);
    const [error, setError] = useState('');
    const [activePage, setActivePage] = useState('products');
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentView, setCurrentView] = useState('productDashboard'); // new state
    const [selectedProductId, setSelectedProductId] = useState(null); // new state

    useEffect(() => {
        if (currentView === 'productDashboard') {
            fetchProducts(currentPage, pageSize);
        }


    }, [currentPage, pageSize, currentView]);

    const fetchProducts = async (page, size) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}product/get-all?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products. Please try again later.');
        }
    };

    const addProduct = async (product) => {
        try {
            await axios.post(`${API_URL}add`, product);
            fetchProducts(currentPage, pageSize);
        } catch (error) {
            console.error('Error adding product:', error);
            setError('Error adding product. Please try again later.');
        }
    };

    const updateProduct = async (updatedProduct) => {
        try {
            await axios.put(`${API_URL}update/${updatedProduct.productId}`, updatedProduct);
            fetchProducts(currentPage, pageSize);
            setEditingProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
            setError('Error updating product. Please try again later.');
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${API_URL}delete/${id}`);
            fetchProducts(currentPage, pageSize);
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Error deleting product. Please try again later.');
        }
    };

    const editProduct = (product) => {
        setEditingProduct(product);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPaginationRange = (currentPage, totalPages) => {
        const delta = 2;
        const range = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift('...');
        }

        if (currentPage + delta < totalPages - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    };

    const paginationRange = getPaginationRange(currentPage, productsPage.totalPages);

    const navigateToProductDetail = (productId) => {
        setCurrentView('productDetail');
        setSelectedProductId(productId);
    };

    const navigateToDashboard = () => {
        setCurrentView('productDashboard');
        setSelectedProductId(null);
    };

    return (
        <div className="dashboard">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="main-content">
                {activePage === 'products' && (
                    <>
                        {currentView === 'productDashboard' && (
                            <>
                                <div className="search-bar">
                                    <input type="text" placeholder="Search"/>
                                </div>
                                <h1>Product tables</h1>

                                <ProductTable
                                    products={productsPage.content}
                                    editProduct={editProduct}
                                    deleteProduct={deleteProduct}
                                    viewProductDetails={navigateToProductDetail}
                                />

                            </>
                        )}
                        {currentView === 'productDetail' && (
                            <>
                                <ProductView productId={selectedProductId} goBack={navigateToDashboard}/>
                            </>
                        )}
                    </>
                )}
                {activePage === 'orders' && <OrderTable/>} {

                }
                <div className="row mt-4">
                    <div className="col-md-6">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination justify-content-end">
                                {paginationRange.map((pageNumber, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${pageNumber === currentPage + 1 ? 'active' : ''}`}
                                    >
                                        <Link
                                            to="#"
                                            className="page-link"
                                            onClick={() => handlePageChange(pageNumber - 1)}
                                        >
                                            {pageNumber}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
