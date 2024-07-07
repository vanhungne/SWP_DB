import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import '../../Scss/ProductCard.scss';

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
            <div className="product-card" onClick={() => handleProductClick(product.productId)}>
                <div className="card-img-wrapper">
                    <img
                        src={product.image1}
                        alt={product.productName}
                        className="card-img-top"
                    />
                    <button className="favorite-btn" aria-label="Add to favorites">
                        <Heart size={18} />
                    </button>
                    {product.originalPrice && (
                        <span className="discount-badge">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                    )}
                </div>
                <div className="card-body">
                    <h5 className="card-title">{product.productName}</h5>
                    <div className="price-container">
                        <p className="current-price">{formatCurrency(product.price)}</p>
                        {product.originalPrice && (
                            <p className="original-price">
                                {formatCurrency(product.originalPrice)}
                            </p>
                        )}
                    </div>
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
