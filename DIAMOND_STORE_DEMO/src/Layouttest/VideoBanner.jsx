import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoBanner = () => {
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error('Error trying to play video:', error);
            });
        }
    }, []);

    const handleBuyNowClick = () => {
        navigate('/category');
    };

    return (
        <div className="video-banner" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
            <video
                ref={videoRef}
                className="video-bg"
                loop
                muted
                playsInline
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            >
                <source
                    src="https://media.tiffany.com/is/content/tiffanydm/2024-Icons-HP-Hero-HW-Video-Desktop-3"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>
            <div className="video-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}>
                <div className="video-content" style={{
                    textAlign: 'center',
                    color: 'white',
                    padding: '40px',
                    borderRadius: '10px',
                }}>
                    <h2 style={{
                        fontSize: '3rem',
                        fontWeight: '300',
                        letterSpacing: '4px',
                        marginBottom: '20px',
                        fontFamily: "'Playfair Display', serif"
                    }}>
                        ESTHER DIAMONDS
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        fontWeight: '300',
                        letterSpacing: '2px',
                        marginBottom: '30px',
                        fontFamily: "'Montserrat', sans-serif"
                    }}>
                        Discover our exquisite collection of timeless elegance
                    </p>
                    <button
                        className="btn"
                        onClick={handleBuyNowClick}
                        style={{
                            padding: '12px 30px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            border: '1px solid white',
                            color: 'white',
                            borderRadius: '0',
                            transition: 'all 0.3s ease',
                            letterSpacing: '2px',
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: '300'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = 'black';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = 'white';
                        }}
                    >
                        EXPLORE COLLECTION
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoBanner;