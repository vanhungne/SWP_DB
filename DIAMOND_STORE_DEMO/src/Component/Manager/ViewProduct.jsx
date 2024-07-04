import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Config/config';

const ViewProduct = ({ productId, goBack }) => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [diamonds, setDiamonds] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchProductDetails(productId);
        }
    }, [productId]);

    const fetchProductDetails = async (id) => {
        try {
            const response = await axios.get(`${API_URL}product/${id}`);
            setProduct(response.data);
            setDiamonds(response.data.diamonds);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Error fetching product details. Please try again later.');
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-details" >
            <div className="button-container">
                <button onClick={goBack}>Back</button>
            </div>
            <h1>Product Details</h1>
            <div>
                <label>Product ID:</label>
                <span>{product.productId}</span>
            </div>
            <div>
                <label>Product Name:</label>
                <span>{product.productName}</span>
            </div>
            <div>
                <label>Price:</label>
                <span>${product.price}</span>
            </div>
            <div>
                <label>Stock Quantity:</label>
                <span >{product.stockQuantity}</span>
            </div>
            <div>
                <label>Collection:</label>
                <span>{product.collection}</span>
            </div>
            <div>
                <label>Description:</label>
                <span>{product.description}</span>
            </div>
            <div>
                <label>Category ID:</label>
                <span>{product.categoryId}</span>
            </div>
            <div>
                <label>Shell ID:</label>
                <span>{product.shellId}</span>
            </div>
            <div className="diamonds">
                <label>Diamonds:</label>
                <ul>
                    {diamonds.length > 0 ? (
                        diamonds.map((diamond, index) => (
                            <li key={index}>
                                <div>
                                    <label>Diamond ID:</label>
                                    <span>{diamond.diamondId}</span>
                                </div>
                                <div>
                                    <label>Carat:</label>
                                    <span>{diamond.carat}</span>
                                </div>
                                <div>
                                    <label>Color:</label>
                                    <span>{diamond.color}</span>
                                </div>
                                <div>
                                    <label>Clarity:</label>
                                    <span>{diamond.clarity}</span>
                                </div>
                                <div>
                                    <label>Cut:</label>
                                    <span>{diamond.cut}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No diamond</p>
                    )}
                </ul>
            </div>
            <div className="manager-product-images">
                <label>Main Image:</label>
                <img src={product.image1} alt="Product Image 1"/>

                <label>Image 2:</label>
                <img src={product.image2} alt="Product Image 2"/>

                <label>Image 3:</label>
                <img src={product.image3} alt="Product Image 3"/>

                <label>Image 4:</label>
                <img src={product.image4} alt="Product Image 4"/>
            </div>
        </div>
    );
};

export default ViewProduct;
