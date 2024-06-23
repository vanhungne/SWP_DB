import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import Sidebar from './SidebarP';
import ProductCard from './ProductCard';

const ProductCategoryPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([500, 50000]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [collection, setCollection] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [currentPage, selectedCategory, sortBy, searchQuery, priceRange, collection]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}home/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            let url = `${API_URL}home?page=${currentPage}&size=8`;

            if (selectedCategory) {
                url = `${API_URL}home/getProductByCategory?categoryName=${selectedCategory}&page=${currentPage}&size=8`;
            }

            if (sortBy !== 'default') {
                url = `${API_URL}home/sortByPrice?order=${sortBy}&page=${currentPage}&size=8`;
            }

            if (searchQuery) {
                url = `${API_URL}home/search-by-name?keyword=${searchQuery}&page=${currentPage}&size=8`;
            }

            if (priceRange[0] !== 500 || priceRange[1] !== 50000) {
                url = `${API_URL}home/by-price-range?minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&page=${currentPage}&size=8`;
            }

            if (collection) {
                url = `${API_URL}home/collection?collection=${collection}&page=${currentPage}&size=8`;
            }

            const response = await axios.get(url);
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSortBy('default');
        setCurrentPage(0);
    };

    const handlePriceRangeChange = (newValue) => {
        setPriceRange(newValue);
        setCurrentPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setCurrentPage(0);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleCollectionChange = (newCollection) => {
        setCollection(newCollection);
        setCurrentPage(0);
    };

    return (
        <div className="container-fluid">
            <div style={{marginTop:'50px'}}></div>
            <div style={{marginTop:'3%'}}></div>
            <div className="row">
                <div className="col-md-3">
                    <Sidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        priceRange={priceRange}
                        onCategoryChange={handleCategoryChange}
                        onPriceRangeChange={handlePriceRangeChange}
                        onCollectionChange={handleCollectionChange}
                    />
                </div>
                <div className="col-md-9">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <select className="form-select" value={sortBy} onChange={handleSortChange}>
                                <option value="default">Default sorting</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        {products.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-12">
                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center">
                                    {[...Array(totalPages).keys()].map((page) => (
                                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(page)}>
                                                {page + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCategoryPage;