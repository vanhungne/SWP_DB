import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, Link} from 'react-router-dom'; // Import Link for navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Scss/ProductDetails.scss';
import Swal from 'sweetalert2';
import {API_URL} from "../../Config/config";

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
    const [showDiamond, setShowDiamond] = useState(false);
    const [showShell, setShowShell] = useState(false);

    useEffect(() => {
        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    const fetchProductDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}product/${productId}`);
            const fetchedProduct = response.data;
            setProduct(fetchedProduct);
            setMainImage(fetchedProduct.image1);
            fetchSizesForCategory(fetchedProduct.categoryId);
            fetchDiamondDetail(fetchedProduct.productId);
            fetchShellDetail(fetchedProduct.shellId);
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
            Swal.fire({
                title: 'Select a Size',
                text: 'Please select a size before adding to cart.',
                icon: 'warning',
                confirmButtonText: 'Ok'
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
                totalPrice: product.price, // Total price for 1 item
                quantity: 1, // Quantity is 1
                size: sizes.find(size => size.sizeId === Number(selectedSize)).valueSize
            };

            cart.push(cartItem);

            setCookie('cart', btoa(JSON.stringify(cart)), 7);
            Swal.fire({
                title: 'Added to Cart',
                text: `${product.productName} (Size: ${cartItem.size}, Quantity: ${1}) has been added to your cart.`,
                icon: 'success',
                confirmButtonText: 'Ok'
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            Swal.fire({
                title: 'Error',
                text: 'There was an error adding the product to your cart. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Ok'
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

    const toggleDiamondDetails = () => {
        setShowDiamond(!showDiamond);
        setShowShell(false);
    };

    // const toggleShellDetails = () => {
    //     setShowShell(!showShell);
    //     setShowDiamond(false);
    // };

    return (<div style={{marginTop: '100px'}} className="container product-detail">
        <div className="py-3"></div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {product && (<div className="row">
            <div className="col-md-6">
                <div className="product-images">
                    <div className="d-flex justify-content-center">
                        <img
                            src={`${API_URL}product/load-image/${mainImage}.jpg`}
                            alt={product.productName}
                            className="img-fluid mb-2 border border-3 "
                        />
                    </div>
                    <div className="additional-images d-flex justify-content-center gap-4">
                        {[product.image1, product.image2, product.image3, product.image4].map((image, index) => (<img
                            key={index}
                            src={`${API_URL}product/load-image/${image}.jpg`}
                            alt={`${product.productName} ${index + 1}`}
                            className="img-thumbnail mr-2"
                            onClick={() => handleImageClick(image)}
                        />))}
                    </div>
                </div>
            </div>

            <div className="col-md-6 product-info">
                <h1>{product.productName}</h1>
                <p>{product.description}</p>
                <label htmlFor=" sizeSelect">Select Size:</label>
                <div>
                    <div className="row">
                        <div className='col-9 d-flex justify-content-around align-items-start'>
                            <div style={{height: '75px', width: '200px', margin: '0'}}>
                                <select
                                    className="form-control"
                                    id=" sizeSelect"
                                    value={selectedSize}
                                    onChange={handleSizeChange}
                                >
                                    <option value="">Choose...</option>
                                    {sizes.map((size) => (<option key={size.sizeId} value={size.sizeId}>
                                        {size.valueSize} cm
                                    </option>))}
                                </select>
                            </div>
                            <div className='card-header-none'>
                                <button style={{width: '200px', height: '40px'}}
                                        className='bg-dark text-white rounded-3 d-flex align-items-center justify-content-center'
                                        onClick={toggleDiamondDetails}>
                                    Information
                                </button>
                                {showDiamond && (<div style={{width: '370px'}}
                                                      className='card-body position-absolute'>
                                    <div style={{lineHeight: '30px'}}
                                         className="diamond-table text-bg-dark p-3 rounded-4 ">
                                        <table>
                                            <tbody>
                                            <tr>
                                                <th>Carat:</th>
                                                <td>{diamond.carat}</td>
                                            </tr>
                                            <tr>
                                                <th>Price:</th>
                                                <td>{diamond.price}</td>
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
                                </div>)}
                            </div>
                        </div>
                        <h5 className="text-success">Price: ${product.price.toFixed(2)}</h5>
                    </div>
                </div>
                <div className=" text-right">
                    <button className=" btn btn-dark mr-2 " onClick={handleAddToCart}>Add to Cart</button>
                    <Link to="/cart" className=" btn btn-outline-primary ms-3">View Cart</Link>
                </div>
            </div>
            {/*    */}
        </div>)}
    </div>);
};

export default ProductDetail;
