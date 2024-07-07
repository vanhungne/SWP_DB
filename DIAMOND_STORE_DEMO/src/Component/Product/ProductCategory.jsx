import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import Sidebar from './SidebarP';
import ProductCard from './ProductCard';
import Products from './AllProduct';
import '../../Scss/Category.scss';
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
    const [viewMode, setViewMode] = useState('categorized'); // 'categorized' or 'all'

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (viewMode === 'categorized') {
            fetchProducts();
        }
    }, [currentPage, selectedCategory, sortBy, searchQuery, priceRange, collection, viewMode]);

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
            let url = `${API_URL}home?page=${currentPage}&size=12`;

            if (selectedCategory) {
                url = `${API_URL}home/getProductByCategory?categoryName=${selectedCategory}&page=${currentPage}&size=12`;
            }

            if (sortBy !== 'default') {
                url = `${API_URL}home/sortByPrice?order=${sortBy}&page=${currentPage}&size=12`;
            }

            if (searchQuery) {
                url = `${API_URL}home/search-by-name?keyword=${searchQuery}&page=${currentPage}&size=12`;
            }

            if (priceRange[0] !== 500 || priceRange[1] !== 50000) {
                url = `${API_URL}home/by-price-range?minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&page=${currentPage}&size=12`;
            }

            if (collection) {
                url = `${API_URL}home/collection?collection=${collection}&page=${currentPage}&size=12`;
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

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        setCurrentPage(0);
    };
    return (
        <div className="product-category-page">
            <div className="product-category-page__view-mode" style={{display:'flex',justifyContent:'end'}}>
                <button
                    className={`product-category-page__view-mode-button btn ${viewMode === 'categorized' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleViewModeChange('categorized')}
                >
                    Categorized
                </button>
                <button
                    className={`product-category-page__view-mode-button btn ${viewMode === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleViewModeChange('all')}
                >
                    All
                </button>
            </div>
            {viewMode === 'categorized' ? (
                <div className="product-category-page__content">
                    <div className="product-category-page__sidebar">
                        <Sidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            priceRange={priceRange}
                            onCategoryChange={handleCategoryChange}
                            onPriceRangeChange={handlePriceRangeChange}
                            onCollectionChange={handleCollectionChange}
                        />
                    </div>
                    <div className="product-category-page__main">
                        <div className="product-category-page__filters">
                            <div className="product-category-page__filters-search">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="product-category-page__filters-sort">
                                <select className="form-select" value={sortBy} onChange={handleSortChange}>
                                    <option value="default">Default sorting</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                        <div className="product-category-page__products">
                            {products.map((product) => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                        <div className="product-category-page__pagination">
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
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
            ) : (
                <Products />
            )}
        </div>
    );
};

export default ProductCategoryPage;