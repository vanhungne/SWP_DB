import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../Scss/home.scss';
import VideoBanner from "../../Layouttest/VideoBanner";
import ProductCard from './ProductCard'; // Import the ProductCard component
import {API_URL} from "../../Config/config";
const Products = () => {
    const [productsPage, setProductsPage] = useState({
        content: [],
        totalPages: 0,
        pageNumber: 0,
        totalElements: 0
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(8);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const fetchProducts = async (page, size) => {
        try {
            const response = await axios.get(`${API_URL}home?page=${page}&size=${size}`);
            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error fetching products. Please try again later.');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const getPaginationRange = (currentPage, totalPages) => {
        const delta = 2; // Number of pages to show before and after the current page
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
            range.push(totalPages); // Always show the last page if there are multiple pages
        }

        return range;
    };

    const paginationRange = getPaginationRange(currentPage, productsPage.totalPages);

    return (
        <>
            <MetaTags>
                <title>Product - Featured & Collection Products</title>
                <meta name="description" content="Check out our featured and collection products!" />
            </MetaTags>
            {/*<VideoBanner />*/}

            <div className="container">
                <div className="row">
                    <div className="col-12 mb-4">
                        <h1>ALL PRODUCT</h1>
                    </div>
                    {productsPage.content.map((product) => (
                        <ProductCard key={product.productId} product={product} /> // Use the ProductCard component
                    ))}
                    {error && (
                        <div className="col-12">
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        </div>
                    )}
                </div>
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
        </>
    );
};

export default Products;