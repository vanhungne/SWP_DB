import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MetaTags from 'react-meta-tags';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../Scss/home.scss';
import VideoBanner from "../../Layouttest/VideoBanner";
import ProductCard from "../Product/ProductCard";
import { useNavigate } from 'react-router-dom';
import {API_URL} from "../../Config/config";
import ImageCarousel from "../../Layouttest/SliderHome";

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [collectionProducts, setCollectionProducts] = useState([]);
    const [collectionError, setCollectionError] = useState('');
    const [error, setError] = useState('');
    const [collection, setCollection] = useState(null);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedProducts();
        fetchCollectionProducts();
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && videoRef.current) {
                videoRef.current.play().catch((error) => {
                    console.error("Error trying to play video:", error);
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        if (videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.error("Error trying to play video:", error);
            });
        }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}home/featured`);
            setFeaturedProducts(response.data);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            setError('Error fetching featured products. Please try again later.');
        }
    };

    const fetchCollectionProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}home/collection`, {
                params: {
                    page: 0,
                    size: 4,
                    collection: 'Tiffany Lock'
                }
            });
            setCollection(response.data.collection);
            setCollectionProducts(response.data.content);
        } catch (error) {
            console.error('Error fetching collection products:', error);
            setCollectionError('Error fetching collection products. Please try again later.');
        }
    };

    return (
        <>
            <MetaTags>
                <title>Home - Featured & Collection Products</title>
                <meta name="description" content="Check out our featured and collection products!" />
            </MetaTags>
            <VideoBanner />

            <div className="container">
                <div className="row">
                    <div className="col-12 mb-4">
                        <h1>SPECIAL PRODUCT</h1>
                    </div>
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                    {error && <div className="col-12">
                        <div className="alert alert-danger" role="alert">{error}</div>
                    </div>}
                </div>

                <div className="row mt-5">
                    <div className="col-12 mb-4">
                        <h1>OUTSTANDING PRODUCT</h1>
                    </div>
                    <div className="col-md-4 mb-4">
                        <img
                            style={{ height: '100%', objectFit: 'cover', borderRadius: '15px' }}
                            src="/images/beau1.webp"
                            alt="Beautiful Image 1"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <img
                            style={{ height: '100%', objectFit: 'cover', borderRadius: '15px' }}
                            src="/images/beau2.webp"
                            alt="Beautiful Image 2"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <img
                            style={{ height: '100%', objectFit: 'cover', borderRadius: '15px' }}
                            src="/images/beau3.webp"
                            alt="Beautiful Image 3"
                            className="img-fluid"
                        />
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12 mb-4">
                        <h1>Esther Lock collection</h1>
                    </div>
                    {collectionProducts.length === 0 && !collectionError && <div className="col-12">Loading...</div>}
                    {collectionError && <div className="col-12">
                        <div className="alert alert-danger" role="alert">{collectionError}</div>
                    </div>}
                    {collectionProducts.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </div>
            <div style={{padding:'0 5%'}}> <ImageCarousel/></div>
        </>
    );
};

export default Home;
