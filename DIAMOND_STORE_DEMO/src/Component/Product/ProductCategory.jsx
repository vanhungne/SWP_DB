import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CategoryProducts = () => {
    const { categoryId } = useParams();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoryId) {
            fetchProductsByCategory(categoryId);
        }
    }, [categoryId, page, size]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/home/getCategories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Error fetching categories. Please try again later.');
        }
    };

    const fetchProductsByCategory = async (categoryId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/home/getProductByCategoryId`, {
                params: {
                    categoryId: categoryId,
                    page: page,
                    size: size
                }
            });
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching category products:', error);
            setError('Error fetching category products. Please try again later.');
            setLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-12 mb-4">
                    <h1>Categories</h1>
                </div>
                {categories.map((category) => (
                    <div key={category.categoryId} className="col-md-3">
                        <Link to={`/category/${category.categoryId}`} className="btn btn-success btn-block">
                            {category.categoryName}
                        </Link>
                    </div>
                ))}
            </div>

            <h1>{categoryId}</h1>
            {loading && <p>Loading...</p>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <div className="row">
                {products.map(product => (
                    <div key={product.productId} className="col-md-3 mb-4">
                        <div className="card h-100" onClick={() => handleProductClick(product.productId)}>
                            <img
                                src={`http://localhost:8080/product/load-image/${product.image1}`}
                                alt={product.productName}
                                className="card-img-top"
                            />
                            <div className="card-body d-flex flex-column">
                                <h2 className="card-title">{product.productName}</h2>
                                <p className="card-text mb-auto">Price: ${product.price.toFixed(2)}</p>
                                <button className="btn btn-secondary mt-auto">
                                    <i className="fas fa-info-circle"></i> Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(index)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default CategoryProducts;