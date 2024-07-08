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
import SnowEffect from "./SnowEffect";
import { motion, useAnimation } from 'framer-motion';
import ProductSlider from './ProductSlider';

// Hàm xáo trộn mảng
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [collectionProducts, setCollectionProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [collectionError, setCollectionError] = useState('');
    const [error, setError] = useState('');
    const videoRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedProducts();
        fetchCollectionProducts();
        fetchAllProducts();


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
                    collection: 'Esther Lock'
                }
            });
            setCollectionProducts(response.data.content);
        } catch (error) {
            console.error('Error fetching collection products:', error);
            setCollectionError('Error fetching collection products. Please try again later.');
        }
    };
    const fetchAllProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}home`);
            setAllProducts(shuffleArray(response.data.content));
        } catch (error) {
            console.error('Error fetching all products:', error);
            setError('Error fetching products. Please try again later.');
        }
    };

    const faqItems = [
        {
            question: "How can I distinguish between natural and lab-grown diamonds?",
            answer: "Natural and lab-grown diamonds have identical physical properties, making them indistinguishable to the naked eye. However, they can be differentiated using specialized equipment. At Diamonds Ethers, we use advanced spectroscopic tools to identify the origin of each diamond. Natural diamonds often have tiny inclusions, while lab-grown diamonds may have specific growth patterns. We provide a detailed certificate for each diamond, clearly stating its origin and characteristics."
        },
        {
            question: "What are the 4Cs in diamond grading?",
            answer: "The 4Cs stand for Cut, Color, Clarity, and Carat weight. Cut refers to the diamond's proportions, symmetry, and polish. Color grades the absence of color, with D being colorless and Z having a light yellow or brown tint. Clarity measures the absence of inclusions and blemishes. Carat is the standard unit of weight for diamonds, with one carat equaling 0.2 grams. At Diamonds Ethers, we provide a comprehensive explanation of each diamond's 4C grades to help you make an informed decision."
        },
        {
            question: "How should I care for and clean my diamond jewelry?",
            answer: "To maintain your diamond's brilliance, clean it regularly using a soft-bristled brush and a mixture of warm water and mild dish soap. Gently scrub the diamond, paying attention to the underside where dirt can accumulate. Rinse thoroughly and dry with a lint-free cloth. Avoid using harsh chemicals or ultrasonic cleaners at home. For professional cleaning, visit any Diamonds Ethers store twice a year. We also recommend storing your diamond jewelry separately to prevent scratching, and removing it before engaging in strenuous activities or applying lotions and perfumes."
        },
        {
            question: "Does Diamonds Ethers offer custom design services for diamond jewelry?",
            answer: "Yes, Diamonds Ethers provides custom design services to create unique diamond jewelry pieces. Our process involves: 1) An initial consultation to discuss your vision and budget. 2) Creation of detailed sketches or 3D renderings for your approval. 3) Selection of the perfect diamond and other materials. 4) Crafting of the piece by our expert artisans. 5) Quality control and final adjustments. 6) Presentation of your custom piece, complete with a certificate of authenticity. This service allows you to create a one-of-a-kind piece that perfectly matches your style and preferences."
        }
    ];
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <>
            <MetaTags>
                <title>Home - Featured & Collection Products</title>
                <meta name="description" content="Check out our featured and collection products!"/>
            </MetaTags>
            <SnowEffect/>
            <VideoBanner/>

            <motion.div
                className="container"
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <div className="row">
                    <div className="col-12 mb-4">
                        <h1>SPECIAL PRODUCT</h1>
                    </div>
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.productId} product={product}/>
                    ))}
                    {error && <div className="col-12">
                        <div className="alert alert-danger" role="alert">{error}</div>
                    </div>}
                </div>
            </motion.div>

            <motion.div
                className="row mt-5"
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <div className="col-12 mb-4">
                    <h1>OUTSTANDING PRODUCT</h1>
                </div>
                <div className="col-md-4 mb-4">
                    <img
                        style={{height: '100%', objectFit: 'cover', borderRadius: '15px'}}
                        src="/images/beau1.webp"
                        alt="Beautiful Image 1"
                        className="img-fluid"
                    />
                </div>
                <div className="col-md-4 mb-4">
                    <img
                        style={{height: '100%', objectFit: 'cover', borderRadius: '15px'}}
                        src="/images/beau2.webp"
                        alt="Beautiful Image 2"
                        className="img-fluid"
                    />
                </div>
                <div className="col-md-4 mb-4">
                    <img
                        style={{height: '100%', objectFit: 'cover', borderRadius: '15px'}}
                        src="/images/beau3.webp"
                        alt="Beautiful Image 3"
                        className="img-fluid"
                    />
                </div>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <ProductSlider products={allProducts} title="You may like" />
            </motion.div>

            <motion.div
                className="row mt-5"
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <div className="col-12 mb-4">
                    <h1>Esther Lock Collection</h1>
                </div>
                {collectionProducts.length === 0 && !collectionError && <div className="col-12">Loading...</div>}
                {collectionError && <div className="col-12">
                    <div className="alert alert-danger" role="alert">{collectionError}</div>
                </div>}
                {collectionProducts.map((product) => (
                    <ProductCard key={product.productId} product={product}/>
                ))}
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <ImageCarousel/>
            </motion.div>

            <motion.section
                className="faq"
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                    {faqItems.map((item, index) => (
                        <motion.details
                            key={index}
                            className="faq-item"
                            initial="hidden"
                            animate="visible"
                            variants={sectionVariants}
                        >
                            <summary>{item.question}</summary>
                            <p>{item.answer}</p>
                        </motion.details>
                    ))}
                </div>
            </motion.section>
        </>
    );
};

export default Home;