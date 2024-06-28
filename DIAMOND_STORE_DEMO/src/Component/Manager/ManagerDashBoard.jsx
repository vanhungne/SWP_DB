import React, { useEffect, useState } from 'react';
import Sidebar from '../Manager/Sidebar';
import ProductTable from '../Manager/ProductTable';
import '../../Scss/ManagerDashBoard.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import OrderTable from '../Manager/OrderTable';
import ShellTable from '../Manager/ShellTable';
import EditProduct from "../Manager/EditProduct";
import ViewShell from '../Manager/ViewShell';
import EditShell from '../Manager/EditShell';
import DiamondTable from "./DiamondTable";
import ViewDiamond from "./ViewDiamond";
import EditDiamond from "./EditDiamond";
import ViewProduct from "./ViewProduct";

const Dashboard = () => {
    const [productsPage, setProductsPage] = useState({
        content: [],
        totalPages: 0,
        pageNumber: 0,
        totalElements: 0
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [error, setError] = useState('');
    const [activePage, setActivePage] = useState('products');
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedShellId, setSelectedShellId] = useState(null);
    const [selectedDiamondId, setSelectedDiamondId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchCriteria, setSearchCriteria] = useState({
        cut: '',
        color: '',
        carat: '',
        clarity: ''
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        clearData();
        if (activePage === 'products' && currentView === 'dashboard') {
            if (searchKeyword) {
                fetchProductsByKeyword(currentPage, pageSize, searchKeyword);
            } else {
                fetchProducts(currentPage, pageSize);
            }
        } else if (activePage === 'shells' && currentView === 'dashboard') {
            if (searchKeyword) {
                fetchShellsByKeyword(currentPage, pageSize, searchKeyword);
            } else {
                fetchShells(currentPage, pageSize);
            }
        } else if (activePage === 'diamonds' && currentView === 'dashboard') {
            if (searchCriteria.cut || searchCriteria.color || searchCriteria.carat || searchCriteria.clarity) {
                fetchDiamondsByCriteria(currentPage, pageSize, searchCriteria);
            } else {
                fetchDiamonds(currentPage, pageSize);
            }
        }
    }, [currentPage, pageSize, currentView, searchKeyword, activePage, searchCriteria]);

    const clearData = () => {
        setProductsPage({
            content: [],
            totalPages: 0,
            pageNumber: 0,
            totalElements: 0
        });
    };

    const fetchProducts = async (page, size) => {
        try {
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

    const fetchProductsByKeyword = async (page, size, keyword) => {
        try {
            const response = await axios.get(`${API_URL}product/search-by-name?keyword=${keyword}&page=${page}&size=${size}`, {
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

    const fetchShells = async (page, size) => {
        try {
            const response = await axios.get(`${API_URL}manage/shell/get-all?page=${page}&size=${size}`);
            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching shells:', error);
            setError('Error fetching shells. Please try again later.');
        }
    };

    const fetchShellsByKeyword = async (page, size, keyword) => {
        try {
            const response = await axios.get(`${API_URL}manage/shell/search-by-name?name=${keyword}&page=${page}&size=${size}`);
            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching shells:', error);
            setError('Error fetching shells. Please try again later.');
        }
    };

    const fetchDiamonds = async (page, size) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}manage/diamond/get-all?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching diamonds:', error);
            setError('Error fetching diamonds. Please try again later.');
        }
    };

    const fetchDiamondsByCriteria = async (page, size, criteria) => {
        try {
            const token = localStorage.getItem('token');
            const { cut, carat, color, clarity } = criteria;

            // Create params object and only add non-null parameters
            const params = {};
            if (cut !== null && cut !== '') params.cut = cut;
            if (carat !== null && carat !== '') params.carat = carat;
            if (color !== null && color !== '') params.color = color;
            if (clarity !== null && clarity !== '') params.clarity = clarity;
            params.page = page;
            params.size = size;

            //console.log('Sending request with params:', params);

            const response = await axios.get(`${API_URL}manage/diamond/search-by-4c`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params
            });

            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching diamonds by criteria:', error);
            setError('Error fetching diamonds. Please try again later.');
        }
    };



    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${API_URL}product/delete/${id}`);
            fetchProducts(currentPage, pageSize);
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Error deleting product. Please try again later.');
        }
    };

    const deleteShell = async (id) => {
        try {
            await axios.delete(`${API_URL}manage/shell/delete/${id}`);
            fetchShells(currentPage, pageSize);
        } catch (error) {
            console.error('Error deleting shell:', error);
            setError('Error deleting shell. Please try again later.');
        }
    };

    const deleteDiamond = async (id) => {
        try {
            await axios.delete(`${API_URL}manage/diamond/delete/${id}`);
            fetchDiamonds(currentPage, pageSize);
        } catch (error) {
            console.error('Error deleting diamond:', error);
            setError('Error deleting diamond. Please try again later.');
        }
    };

    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const handleDiamondSearchChange = (event) => {
        setSearchCriteria({
            ...searchCriteria,
            [event.target.name]: event.target.value
        });
        
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

    const navigateToEditProduct = (productId) => {
        setCurrentView('editProduct');
        setSelectedProductId(productId);
    };

    const navigateToEditShell = (shellId) => {
        setCurrentView('editShell');
        setSelectedShellId(shellId);
    };

    const NavigateToEditDiamond = (diamondId) => {
        setCurrentView('editDiamond');
        setSelectedDiamondId(diamondId);
    };

    const navigateToProductDetail = (productId) => {
        setCurrentView('productDetail');
        setSelectedProductId(productId);
    };

    const navigateToDiamondDetail = (diamondId) => {
        setCurrentView('diamondDetail');
        setSelectedDiamondId(diamondId);
    };
    const navigateToShellDetail = (shellId) => {
        setCurrentView('shellDetail');
        setSelectedShellId(shellId);
    };

    const navigateToDashboard = () => {
        setCurrentView('dashboard');
        setSelectedProductId(null);
        setSelectedShellId(null);
    };

    return (
        <div className="dashboard">
            <Sidebar activePage={activePage} setActivePage={setActivePage} setCurrentView={setCurrentView} />
            <div className="main-content">
                {activePage === 'products' && (
                    <>
                        {currentView === 'dashboard' && (
                            <>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchKeyword}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <h1>Product tables</h1>
                                <button onClick={() => navigateToEditProduct(null)} className="float-end">Add new product</button>
                                <ProductTable
                                    products={productsPage.content}
                                    editProduct={navigateToEditProduct}
                                    deleteProduct={deleteProduct}
                                    viewProductDetails={navigateToProductDetail}
                                />
                            </>
                        )}
                        {currentView === 'productDetail' && (
                            <>
                                <ViewProduct productId={selectedProductId} goBack={navigateToDashboard} />
                            </>
                        )}
                        {currentView === 'editProduct' && (
                            <>
                                <EditProduct productId={selectedProductId} goBack={navigateToDashboard} />
                            </>
                        )}
                    </>
                )}
                {activePage === 'orders' && <OrderTable />}
                {activePage === 'shells' && (
                    <>
                        {currentView === 'dashboard' && (
                            <>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchKeyword}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <h1>Shell tables</h1>
                                <button onClick={() => navigateToEditShell(null)} className="float-end">Add new shell</button>
                                <ShellTable
                                    shells={productsPage.content}
                                    editShell={navigateToEditShell}
                                    deleteShell={deleteShell}
                                    viewShellDetails={navigateToShellDetail}
                                />
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
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Cut"
                                        name="cut"
                                        value={searchCriteria.cut}
                                        onChange={handleDiamondSearchChange}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Color"
                                        name="color"
                                        value={searchCriteria.color}
                                        onChange={handleDiamondSearchChange}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Carat"
                                        name="carat"
                                        value={searchCriteria.carat}
                                        onChange={handleDiamondSearchChange}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Clarity"
                                        name="clarity"
                                        value={searchCriteria.clarity}
                                        onChange={handleDiamondSearchChange}
                                    />
                                </div>
                                <h1>Diamond Table</h1>
                                <button onClick={() => NavigateToEditDiamond(null)} className="float-end">Add new diamond</button>
                                <DiamondTable
                                    diamonds={productsPage.content}
                                    editDiamond={NavigateToEditDiamond}
                                    deleteDiamond={deleteDiamond}
                                    viewDiamondDetails={navigateToDiamondDetail}
                                />
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
