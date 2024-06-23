import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import '../../Scss/ProductCard.scss';
import { API_URL } from "../../Config/config";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const formatCurrency = (price) => {
        return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="col-md-3 mb-4">
            <div className="card product-card" onClick={() => handleProductClick(product.productId)}>
                <div className="card-img-wrapper">
                    <img
                        src={product.image1}
                        alt={product.productName}
                        className="card-img-top"
                    />
                    <button className="btn btn-light btn-sm favorite-btn">
                        <Heart size={16} />
                    </button>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{product.productName}</h5>
                    <p className="card-text price">
                        {formatCurrency(product.price)}
                        {product.originalPrice && (
                            <span className="original-price">
                                {formatCurrency(product.originalPrice)}
                            </span>
                        )}
                    </p>
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
        originalPrice: PropTypes.number,
    }).isRequired,
};

export default ProductCard;