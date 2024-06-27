import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
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
        }, 5000); // Increased to 5 seconds for better viewing

        return () => clearInterval(timer);
    }, [images.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

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
                <button className="nav-button prev" onClick={goToPrevious}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className="nav-button next" onClick={goToNext}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
            <div className="carousel-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;