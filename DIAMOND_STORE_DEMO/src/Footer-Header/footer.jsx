import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import '../Scss/Footer.scss';

const Footer = () => {
    return (
        <footer className="bg-light py-5">
            <div className="mt-5"></div>
            <Container>
                <Row>
                    <Col md={3}>
                        <h2 className="h4 mb-4">ESTHER DIAMONDS</h2>
                        <p className="mb-2">ESTHER DIAMONDS LLC</p>
                        <p className="mb-2">Tax ID: 0123456789</p>
                        <p>Office: Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh</p>
                        <p className="mb-2">Email: hungse17002@gmail.com</p>
                    </Col>

                    <Col md={3}>
                        <h3 className="h5 mb-4">COMPANY</h3>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a style={{textDecoration:'none'}} href="/about" className="text-dark">About Esther Diamonds</a></li>
                            <li className="mb-2"><a style={{textDecoration:'none'}}  href="/story" className="text-dark">Our Story</a></li>
                            <li className="mb-2"><a style={{textDecoration:'none'}}  href="/knowledge" className="text-dark">Knowledge</a></li>
                            <li><a style={{textDecoration:'none'}}  href="/contact" className="text-dark">Contact Us</a></li>
                        </ul>
                    </Col>

                    <Col md={3}>
                        <h3 className="h5 mb-4">CUSTOMER POLICIES</h3>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a style={{textDecoration:'none'}}  href="/loyalty" className="text-dark">Loyalty Program</a></li>
                            <li className="mb-2"><a style={{textDecoration:'none'}}  href="/warranty" className="text-dark">Warranty Policy</a></li>
                            <li className="mb-2"><a style={{textDecoration:'none'}}  href="/policy" className="text-dark">FAQ</a></li>
                        </ul>
                    </Col>

                    <Col md={3}>
                        <h3 className="h5 mb-4">STORE INFORMATION</h3>
                        <ul className="list-unstyled">
                            <li className="mb-2"><strong>MAIN STORE</strong></li>
                            <li className="mb-2">Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh</li>
                            <li className="mb-2"><strong>ESTHER'S BIRTHDAY</strong></li>
                            <li>5-1-2024</li>
                            <li className="mb-2"><strong>BRANCH STORE</strong></li>
                            <li>789 Sparkle Road, Jewel Town, NY 10001</li>
                        </ul>
                        <a href="/" className="text-primary" style={{fontWeight: 'bold',textDecoration:'none'}}>HOME STORES</a>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col md={6}>
                        <h3 className="h5 mb-3">JOIN OUR NEWSLETTER</h3>
                        <Form className="d-flex">
                            <Form.Control type="email" placeholder="Enter your email" className="me-2"/>
                            <Button variant="dark" type="submit">SUBSCRIBE</Button>
                        </Form>
                    </Col>

                    <Col md={6}>
                        <h3 className="h5 mb-3">CONNECT WITH US</h3>
                        <div>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark me-3">
                                <FontAwesomeIcon icon={faFacebook} size="lg" />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-dark me-3">
                                <FontAwesomeIcon icon={faInstagram} size="lg" />
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-dark">
                                <FontAwesomeIcon icon={faYoutube} size="lg" />
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
