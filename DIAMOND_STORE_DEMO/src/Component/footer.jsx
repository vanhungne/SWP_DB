import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '../Scss/Footer.scss'; // Import the SCSS file

const Footer = () => {
    return (
        <footer className="footer py-5 position-relative bottom-0 w-100">
            <Container>
                <Row>
                    <Col md={6}>
                        <p>&copy; Esther. All rights reserved.</p>
                    </Col>
                    <Col md={6} className="text-md-right">
                        <a href="#" className="text-white mr-3">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-white">
                            Terms of Service
                        </a>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col className="text-center">
                        <a href="#" className="text-white mx-2">
                            <FontAwesomeIcon icon={faFacebook} size="2x" />
                        </a>
                        <a href="#" className="text-white mx-2">
                            <FontAwesomeIcon icon={faTwitter} size="2x" />
                        </a>
                        <a href="#" className="text-white mx-2">
                            <FontAwesomeIcon icon={faInstagram} size="2x" />
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
