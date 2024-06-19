import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import '../Scss/Footer.scss'; // Import the SCSS file
const Footer = () => {
    return (
        <footer className="bg-dark text-white py-5 position-relative bottom-0 w-100">
            <Container>
                <Row>
                    <Col md={6}>
                        <p>&copy; 2023 My Store. All rights reserved.</p>
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
            </Container>
        </footer>
    );
};

export default Footer;