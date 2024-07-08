import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { API_URL } from '../../Config/config';
import Sidebar from './SidebarP';
import ProductCard from './ProductCard';
import Products from './AllProduct';

const PageContainer = styled.div`
  margin-top: 50px;
  padding: 0 20px;
`;

const ViewModeContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 3%;
  margin-bottom: 1.5rem;
`;

const ViewModeButton = styled.button`
  width: 120px;
  font-weight: bold;
  color: ${props => props.active ? '#fff' : '#007bff'};
  background-color: ${props => props.active ? '#007bff' : 'transparent'};
  border: 2px solid #007bff;
  margin-right: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#0056b3' : '#e6f2ff'};
  }

  @media (max-width: 768px) {
    width: auto;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidebarContainer = styled.div`
  flex: 0 0 25%;
  max-width: 25%;
  padding-right: 15px;

  @media (max-width: 768px) {
    flex: 0 0 100%;
    max-width: 100%;
    padding-right: 0;
    margin-bottom: 1rem;
  }
`;

const MainContainer = styled.div`
  flex: 0 0 75%;
  max-width: 75%;

  @media (max-width: 768px) {
    flex: 0 0 100%;
    max-width: 100%;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const FilterItem = styled.div`
  flex: 0 0 50%;
  max-width: 50%;
  padding: 0 0.5rem;

  @media (max-width: 576px) {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 0.5rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
`;

const SortSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
`;

const ProductsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -0.5rem;
`;

const PaginationContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
`;

const PaginationButton = styled.button`
  margin: 0 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #007bff;
  background-color: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#007bff'};
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    color: white;
  }
`;

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
    const [viewMode, setViewMode] = useState('categorized');

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

    const resetFilters = () => {
        setSelectedCategory(null);
        setPriceRange([500, 50000]);
        setSearchQuery('');
        setSortBy('default');
        setCollection('');
        setCurrentPage(0);
    };

    const handleCategoryChange = (category) => {
        resetFilters();
        setSelectedCategory(category);
    };

    const handlePriceRangeChange = (newValue) => {
        resetFilters();
        setPriceRange(newValue);
    };

    const handleSearchChange = (event) => {
        resetFilters();
        setSearchQuery(event.target.value);
    };

    const handleSortChange = (event) => {
        resetFilters();
        setSortBy(event.target.value);
    };

    const handleCollectionChange = (newCollection) => {
        resetFilters();
        setCollection(newCollection);
    };

    const handleViewModeChange = (mode) => {
        resetFilters();
        setViewMode(mode);
    };


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    return (
        <PageContainer>
            <ViewModeContainer>
                <ViewModeButton
                    active={viewMode === 'categorized'}
                    onClick={() => handleViewModeChange('categorized')}
                >
                    Categorized
                </ViewModeButton>
                <ViewModeButton
                    active={viewMode === 'all'}
                    onClick={() => handleViewModeChange('all')}
                >
                    All
                </ViewModeButton>
            </ViewModeContainer>
            {viewMode === 'categorized' ? (
                <ContentContainer>
                    <SidebarContainer>
                        <Sidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            priceRange={priceRange}
                            onCategoryChange={handleCategoryChange}
                            onPriceRangeChange={handlePriceRangeChange}
                            onCollectionChange={handleCollectionChange}
                        />
                    </SidebarContainer>
                    <MainContainer>
                        <FiltersContainer>
                            <FilterItem>
                                <SearchInput
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </FilterItem>
                            <FilterItem>
                                <SortSelect value={sortBy} onChange={handleSortChange}>
                                    <option value="default">Default sorting</option>
                                    <option value="asc">Price: Low to High</option>
                                    <option value="desc">Price: High to Low</option>
                                </SortSelect>
                            </FilterItem>
                        </FiltersContainer>
                        <ProductsContainer>
                            {products.map((product) => (
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </ProductsContainer>
                        <PaginationContainer>
                            {[...Array(totalPages).keys()].map((page) => (
                                <PaginationButton
                                    key={page}
                                    active={currentPage === page}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page + 1}
                                </PaginationButton>
                            ))}
                        </PaginationContainer>
                    </MainContainer>
                </ContentContainer>
            ) : (
                <Products />
            )}
        </PageContainer>
    );
};

export default ProductCategoryPage;