import React, {useEffect, useState} from 'react';
import axios from "axios";
import {API_URL} from "../../Config/config";
import {Link} from "react-router-dom";
import { Eye, Edit, Trash2 } from 'lucide-react';
import iziToast from 'izitoast';

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
        window.scrollTo(0, 0);
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
        iziToast.question({
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            title: 'Confirm',
            message: 'Are you sure you want to delete this product?',
            position: 'center',
            buttons: [
                ['<button><b>YES</b></button>', async function (instance, toast) {
                    try {
                        await axios.delete(`${API_URL}product/delete/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        fetchProducts(currentPage, pageSize);
                        iziToast.success({
                            title: 'Success',
                            message: 'Delete product successfully',
                            position: 'topRight',
                            timeout: 1500,
                        });
                    } catch (error) {
                        console.error('Error deleting product:', error);
                        setError('Error deleting product. Please try again later.');
                    }
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true],
                ['<button>NO</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }]
            ]
            });
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
                    <th style={{textAlign:'center'}}>Name</th>
                    <th>Price</th>
                    <th>Stock Quantity</th>
                    <th>Collection</th>
                    <th>Category ID</th>
                    <th style={{textAlign:'center'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {productsPage.content.map((product, index) => (
                    <tr key={product.productId}>
                        <td style={{textAlign:'center'}}>{product.productId}</td>
                        <td>{product.productName}</td>
                        <td style={{textAlign:'center'}}>${product.price}</td>
                        <td style={{textAlign:'center'}}>{product.stockQuantity}</td>
                        <td style={{textAlign:'center'}}>{product.collection}</td>
                        <td style={{textAlign:'center'}}>{product.categoryId}</td>
                        <td className="space-x-2">
                            <button
                                onClick={() => navigateToProductDetail(product.productId)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                title="View"
                            >
                                <Eye size={20}/>
                            </button>
                            <button
                                onClick={() => navigateToEditProduct(product.productId)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                title="Edit"
                            >
                                <Edit size={20}/>
                            </button>
                            <button
                                onClick={() => deleteProduct(product.productId)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={20}/>
                            </button>
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
