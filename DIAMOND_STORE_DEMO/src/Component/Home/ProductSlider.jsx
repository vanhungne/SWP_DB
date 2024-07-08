import React from 'react';
import { Helmet } from 'react-helmet';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../Product/ProductCard";
import './ProductSlider.scss';

const ProductSlider = ({ products, title }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <>
            <Helmet>
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet" />
            </Helmet>
            <div className="product-slider">
                <h2 className="slider-title">{title}</h2>
                <Slider {...settings}>
                    {products.map((product) => (
                        <div key={product.productId} className="slider-item">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    );
};

export default ProductSlider;