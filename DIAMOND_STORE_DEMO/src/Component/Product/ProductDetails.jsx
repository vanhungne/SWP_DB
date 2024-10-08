import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Scss/ProductDetails.scss';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { API_URL } from "../../Config/config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faRuler, faTimes } from '@fortawesome/free-solid-svg-icons';
import ProductCard from "./ProductCard";

// Utility function to set a cookie
const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

// Utility function to get a cookie
const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const ProductDetail = () => {
    const {productId} = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [error, setError] = useState('');
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState('');
    const [diamond, setDiamond] = useState(null);
    const [shell, setShell] = useState(null);
    // const [showDiamond, setShowDiamond] = useState(false);
    // const [showShell, setShowShell] = useState(false);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [showProductInfo, setShowProductInfo] = useState(false);

    useEffect(() => {
        if (productId) {
            fetchProductDetail();
            setAddedToCart(isProductInCart(parseInt(productId)));
        }
        window.scrollTo(0, 0);
    }, [productId]);

    const fetchProductDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}product/${productId}`);
            const fetchedProduct = response.data;
            setProduct(fetchedProduct);
            setMainImage(fetchedProduct.image1);
            fetchSizesForCategory(fetchedProduct.categoryId);
            fetchSimilarProducts(fetchedProduct.categoryId)
            if (fetchedProduct.stockQuantity > 0) {
                fetchDiamondDetail(fetchedProduct.productId);
                fetchShellDetail(fetchedProduct.shellId);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Error fetching product details. Please try again later.');
        }
    };


    const fetchSizesForCategory = async (categoryId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}sizes/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSizes(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching sizes:', error);
            setError('Error fetching sizes. Please try again later.');
        }
    };

    const handleImageClick = (image) => {
        setMainImage(image);
    };

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            iziToast.warning({
                title: 'Select a Size',
                message: 'Please select a size before adding to cart.',
                position: 'topRight',
                timeout: 5000
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const input = {
                productId: product.productId,
                quantity: 1,
                sizeId: selectedSize
            };

            const response = await axios.post(`${API_URL}cart/add`, input, {
                headers: {
                    'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'
                }
            });

            const currentCart = getCookie('cart');
            let cart = [];
            if (currentCart) {
                const decodedCart = atob(currentCart);
                cart = JSON.parse(decodedCart);
            }

            const cartItem = {
                productId: product.productId,
                productName: product.productName,
                image1: product.image1,
                totalPrice: product.price,
                quantity: 1,
                size: sizes.find(size => size.sizeId === Number(selectedSize)).valueSize
            };

            cart.push(cartItem);

            setCookie('cart', btoa(JSON.stringify(cart)), 7);
            setAddedToCart(true);
            iziToast.success({
                title: 'Added to Cart',
                message: 'Add to cart successfully',
                position: 'topRight',
                timeout: 5000
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            iziToast.error({
                title: 'Error',
                message: 'There was an error adding the product to your cart. Please try again later.',
                position: 'topRight',
                timeout: 5000
            });
        }
    };

    const fetchDiamondDetail = async (ProductId) => {
        if (ProductId) {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${API_URL}manage/diamond/pro/${ProductId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDiamond(response.data);
            } catch (error) {
                console.error('Error fetching diamond details:', error);
            }
        }
    };
    const fetchSimilarProducts = async (categoryId) => {
        try {
            const response = await axios.get(`${API_URL}home/getProductByCategoryId?categoryId=${categoryId}&page=0&size=4`);
            setSimilarProducts(response.data.content);
        } catch (error) {
            console.error('Error fetching similar products:', error);
            setError('Error fetching similar products. Please try again later.');
        }
    };

    const toggleSizeGuide = () => {
        setShowSizeGuide(!showSizeGuide);
    };

    const toggleProductInfo = () => {
        setShowProductInfo(!showProductInfo);
    };

    const fetchShellDetail = async (shellId) => {
        if (shellId) {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${API_URL}manage/shell/${shellId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setShell(response.data);
            } catch (error) {
                console.error('Error fetching shell details:', error);
            }
        }
    };

    // const toggleDiamondDetails = () => {
    //     setShowDiamond(!showDiamond);
    //     setShowShell(false);
    // };

    //check nêếu có product đó trong card thì disable
    const isProductInCart = (productId) => {
        const currentCart = getCookie('cart');
        if (currentCart) {
            const decodedCart = atob(currentCart);
            const cart = JSON.parse(decodedCart);
            return cart.some((item) => item.productId === productId);
        }
        return false;
    };


    return (
        <div className="container product-detail">
            <div className="py-3"></div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            {product && (
                <div className="row">
                    <div className="col-md-6">
                        <div className="product-images">
                            <div className="main-image-container">
                                <img
                                    src={mainImage}
                                    alt={product.productName}
                                    className="img-fluid mb-2 border border-3"
                                />
                            </div>
                            <div className="additional-images">
                                {[product.image1, product.image2, product.image3, product.image4].map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${product.productName} ${index + 1}`}
                                        className="img-thumbnail"
                                        onClick={() => handleImageClick(image)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 product-info">
                        <h1>{product.productName}</h1>
                        <p>{product.description}</p>
                        <h5>Stock quantity: <span className="text-danger"
                                                  style={{
                                                      fontSize: '20px',
                                                      fontWeight: 'bold'
                                                  }}>{product.stockQuantity}</span></h5>
                        <div className="size-select-container">
                            <label htmlFor="sizeSelect">Select Size:</label>
                            <div className="size-select-wrapper">
                                <select
                                    className="form-control"
                                    id="sizeSelect"
                                    value={selectedSize}
                                    onChange={handleSizeChange}
                                >
                                    <option value="">Choose...</option>
                                    {sizes.map((size) => (
                                        <option key={size.sizeId} value={size.sizeId}>
                                            {size.valueSize} cm
                                        </option>
                                    ))}
                                </select>
                                {product.categoryId !== 6 && (
                                    <button className="size-guide-btn" style={{width: '30%'}} onClick={toggleSizeGuide}>
                                        <FontAwesomeIcon icon={faRuler}/> Size Guide
                                    </button>
                                )}
                            </div>
                        </div>

                        {showSizeGuide && (
                            <div className="popup-overlay" onClick={toggleSizeGuide}>
                                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                                    <button className="close-btn" onClick={toggleSizeGuide}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                    <h3>Size Guide</h3>
                                    <img
                                        src={
                                            product.categoryId <= 4
                                                ? "/images/size1.png"
                                                : product.categoryId === 5
                                                    ? "/images/size2.png"
                                                    : "/images/size3.png"
                                        }
                                        alt="Size Guide"
                                    />
                                </div>
                            </div>
                        )}

                        {product.stockQuantity > 0 && (
                            <div className="product-info-section">
                                <button
                                    className="product-info-button"
                                    onClick={toggleProductInfo}
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                                    <span>Product Information</span>
                                </button>
                            </div>
                        )}

                        {showProductInfo && (
                            <div className="popup-overlay" onClick={toggleProductInfo}>
                                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                                    <button className="close-btn" onClick={toggleProductInfo}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                    <h3>Product Information</h3>
                                    <div className="product-details-card">
                                        <h4>Diamond Details</h4>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <th>Carat:</th>
                                                <td>{diamond.carat}</td>
                                            </tr>
                                            <tr>
                                                <th>Price:</th>
                                                <td>${diamond.price}</td>
                                            </tr>
                                            <tr>
                                                <th>Cut:</th>
                                                <td>{diamond.cut}</td>
                                            </tr>
                                            <tr>
                                                <th>Color:</th>
                                                <td>{diamond.color}</td>
                                            </tr>
                                            <tr>
                                                <th>Clarity:</th>
                                                <td>{diamond.clarity}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <h4>Shell Details</h4>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <th>Name:</th>
                                                <td>{shell.shellName}</td>
                                            </tr>
                                            <tr>
                                                <th>Material:</th>
                                                <td>{shell.shellMaterial}</td>
                                            </tr>
                                            <tr>
                                                <th>Design:</th>
                                                <td>{shell.shellDesign}</td>
                                            </tr>
                                            <tr>
                                                <th>Weight:</th>
                                                <td>{shell.shellWeight}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="product-price-actions">
                            <div className="price-display">
                                <span className="price-value">${product.price.toFixed(2)}</span>
                            </div>
                            <div className="action-buttons">
                                {product.stockQuantity > 0 && !addedToCart ? (
                                    <button className="btn btn-add-to-cart" onClick={handleAddToCart}>
                                        Add to Cart
                                    </button>
                                ) : product.stockQuantity > 0 && addedToCart ? (
                                    <button className="btn btn-add-to-cart" disabled>
                                        Added to Cart
                                    </button>
                                ) : (
                                    <button className="btn btn-add-to-cart" disabled>
                                        Sold Out
                                    </button>
                                )}
                                <Link to="/cart" className="btn btn-view-cart">
                                    View Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="similar-products">
                <div style={{textAlign: 'center', padding: '45px 0'}}><span
                    style={{color: 'black', fontSize: '38px', fontWeight: 'bold'}}>Similar Products</span>
                </div>

                <div className="row">
                    {similarProducts.length === 0 && !error && (
                        <div className="col-12">Loading...</div>
                    )}
                    {error && (
                        <div className="col-12">
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        </div>
                    )}
                    {similarProducts.map((product) => (
                        <ProductCard key={product.productId} product={product}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;