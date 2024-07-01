import React, {useEffect, useState} from 'react';
import axios from "axios";
import {API_URL} from "../../Config/config";
import {Link} from "react-router-dom";

const ProductTable = ({setSelectedProductId, setCurrentView} ) => {
    const [productsPage, setProductsPage] = useState({
        content: [],
        totalPages: 0,
        pageNumber: 0,
        totalElements: 0
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [error, setError] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (searchKeyword) {
            fetchProductsByKeyword(currentPage, pageSize, searchKeyword);
        } else {
            fetchProducts(currentPage, pageSize);
        }
    }, [currentPage, pageSize, searchKeyword]);

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

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${API_URL}product/delete/${id}`);
            fetchProducts(currentPage, pageSize);
        } catch (error) {
            console.error('Error deleting product:', error);
            setError('Error deleting product. Please try again later.');
        }
    };

    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
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

    const navigateToEditProduct = (productId) => {
        setCurrentView('editProduct');
        setSelectedProductId(productId);
    };

    const navigateToProductDetail = (productId) => {
        setCurrentView('productDetail');
        setSelectedProductId(productId);
    };

    const paginationRange = getPaginationRange(currentPage, productsPage.totalPages);

    return (
        <>
            <h1>Product tables</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchKeyword}
                    onChange={handleSearchChange}
                />
                <button onClick={() => navigateToEditProduct(null)} className="manager-float-end">Add new
                    product
                </button>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock Quantity</th>
                    <th>Collection</th>
                    <th>Category ID</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {productsPage.content.map((product, index) => (
                    <tr key={product.productId}>
                        <td>{product.productId}</td>
                        <td>{product.productName}</td>
                        <td>${product.price}</td>
                        <td>{product.stockQuantity}</td>
                        <td>{product.collection}</td>
                        <td>{product.categoryId}</td>
                        <td>
                            <button onClick={() => navigateToProductDetail(product.productId)}>View</button>
                            <button onClick={() => navigateToEditProduct(product.productId)}>Edit</button>
                            <button onClick={() => deleteProduct(product.productId)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
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
        </>
    );
};

export default ProductTable;
