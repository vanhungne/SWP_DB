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
        navigate('/products');
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
                <div className="video-content" style={{ textAlign: 'center', color: 'white' }}>
                    <h2>Welcome to Esther Diamonds</h2>
                    <p>Discover our exquisite collection of diamonds and jewelry.</p>
                    <button className="btn btn-primary" onClick={handleBuyNowClick} style={{
                        width:'30%',
                        padding: '8px 15px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        border: '2px solid white',
                        color: 'white',
                        borderRadius: '5px',
                        transition: 'background-color 0.3s, color 0.3s',
                    }}>
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoBanner;