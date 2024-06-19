// src/components/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../Scss/home.scss';
import {API_URL} from "../../Config/config";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="col-md-3 mb-4">
            <div className="card h-100" onClick={() => handleProductClick(product.productId)}>
                <img
                    src={`${API_URL}product/load-image/${product.image1}.jpg`}
                    alt={product.productName}
                    className="card-img-top"
                />
                <div className="card-body d-flex flex-column">
                    <h2 className="card-title">{product.productName}</h2>
                    <p className="card-text mb-auto">Price: ${product.price.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        productId: PropTypes.number.isRequired,
        productName: PropTypes.string.isRequired,
        image1: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    }).isRequired,
};

export default ProductCard;
