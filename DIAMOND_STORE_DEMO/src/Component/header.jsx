import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import Swal from 'sweetalert2';
import '../Scss/Header.scss'; // Import the SCSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Cookies from 'js-cookie';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const [scrollDirection, setScrollDirection] = useState('up');
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const handleLogout = async () => {
        try {
            await logout();
            Cookies.remove('cart');
            Swal.fire({
                icon: 'success',
                title: 'Logged out successfully',
                showConfirmButton: false,
                timer: 1500,


            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Logout failed',
                text: error.message,
            });
        }
    };
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
            setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);

return (
    <Navbar className={`mb-4 custom-navbar ${scrollDirection === 'down' ? 'hidden' : ''}`} expand="lg">
        <Container>
            <Navbar.Brand as={Link} to="/" className="custom-brand">
                <img
                    src="https://ik.imagekit.io/tvlk/blog/2021/09/du-lich-anh-8-1024x576.jpg?tr=dpr-2,w-675"
                    alt="My Store"
                    height="50"
                    className="brand-logo"
                />
                <span>Ethers Diamonds</span>
                </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mx-auto custom-nav">
                    <NavDropdown title="Home" id="home-dropdown" className="custom-nav-link">
                    </NavDropdown>
                    <NavDropdown title="Products" id="products-dropdown" className="custom-nav-link">
                        <NavDropdown.Item as={Link} to="/products">All products</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/products">Product</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="About" id="about-dropdown" className="custom-nav-link">
                        <NavDropdown.Item as={Link} to="/about">About 1</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/about">About 2</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Contact" id="contact-dropdown" className="custom-nav-link">
                        <NavDropdown.Item as={Link} to="/contact">Contact 1</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/contact">Contact 2</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav className="nav-right">
                    <div className="nav-right-items">
                        <Nav.Link as={Link} to="/cart" className="custom-nav-link-cart">
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </Nav.Link>
                        <div className="nav-account">
                            {currentUser ? (
                                    <NavDropdown title={<FontAwesomeIcon icon={faUser} />} id="account-dropdown" className="custom-nav-link">
                                        <NavDropdown.Item as={Link} to="/account">My Account</NavDropdown.Item>
                                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>

                                    </NavDropdown>
                                    ) : (
                                        <NavDropdown title={<FontAwesomeIcon icon={faUser} />} id="account-dropdown" className="custom-nav-link">
                                            <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/register">Sign Up</NavDropdown.Item>
                                        </NavDropdown>
                                        )}
                                    </div>
                                </div>
                                </Nav>
                                </Navbar.Collapse>
                                </Container>
                                </Navbar>
                                );
                            };

export default Header;
