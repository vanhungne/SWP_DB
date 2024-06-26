import React, { useState, useEffect } from 'react';
import './ImageCarousel.scss';

const ImageCarousel = () => {
    const images = [
        "/images/slide1.jpg",
        "/images/slide2.jpg",
        "/images/slide3.jpg",
        "/images/slide4.jpg",
        "/images/slide5.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="image-carousel-container">
            <div className="single-image-carousel">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`carousel-image-wrapper ${index === currentIndex ? 'active' : ''}`}
                    >
                        <img src={image} alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;