import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import '../Scss/Header.scss';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const [scrollDirection, setScrollDirection] = useState('up');
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            Cookies.remove('cart');
            iziToast.success({
                title: 'Success',
                message: 'Logged out successfully',
                position: 'topRight',
                timeout: 1500
            });
        } catch (error) {
            iziToast.error({
                title: 'Error',
                message: error.message || 'Logout failed',
                position: 'topRight',
                timeout: 5000
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

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const renderNavDropdown = (title, id, items) => (
        <NavDropdown
            title={title}
            id={id}
            className={`custom-nav-link ${isMobile ? '' : 'hover-dropdown'}`}
        >
            {items.map((item, index) => (
                <NavDropdown.Item key={index} as={Link} to={item.link}>
                    {item.text}
                </NavDropdown.Item>
            ))}
        </NavDropdown>
    );

    return (
        <Navbar className={`mb-4 custom-navbar ${scrollDirection === 'down' ? 'hidden' : ''}`} expand="lg" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="custom-brand">
                    <span>Ethers Diamonds</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto custom-nav">
                        <Nav.Link as={Link} to="/" className="custom-nav-link">Home</Nav.Link>
                        {renderNavDropdown("Products", "products-dropdown", [
                            {text: "Category", link: "/category"},
                            {text: "Featured Products", link: "/featured-products"},
                            {text: "New Arrivals", link: "/new-arrivals"}
                        ])}
                        <Nav.Link as={Link} to="/diamonds-price" className="custom-nav-link">Diamonds</Nav.Link>
                        {renderNavDropdown("About", "about-dropdown", [
                            {text: "Our Story", link: "/story"},
                            {text: "Our Team", link: "/about"}
                        ])}
                        {renderNavDropdown("Knowledge", "contact-dropdown", [
                            {text: "Warranty", link: "/warranty"},
                            {text: "Knowledge", link: "/knowledge"}
                        ])}
                        {renderNavDropdown("Contact", "contact-dropdown", [
                            {text: "Contact Us", link: "/contact"},
                            {text: "FAQ", link: "/policy"}
                        ])}
                    </Nav>
                    <Nav className="nav-right">
                        <div className="nav-right-items">
                            {/*<Nav.Link onClick={toggleSearch} className="custom-nav-link-icon">*/}
                            {/*    <FontAwesomeIcon icon={faSearch}/>*/}
                            {/*</Nav.Link>*/}
                            <Nav.Link as={Link} to="/cart" className="custom-nav-link-icon">
                                <FontAwesomeIcon icon={faShoppingCart}/>
                            </Nav.Link>
                            <div className="nav-account">
                                {currentUser ? (
                                    <NavDropdown
                                        title={<FontAwesomeIcon icon={faUser}/>}
                                        id="account-dropdown"
                                        className={`custom-nav-link ${isMobile ? '' : 'hover-dropdown'}`}
                                    >
                                        <NavDropdown.Item as={Link} to="/myAccount">My Account</NavDropdown.Item>
                                        {currentUser.roles === 'DELIVERY_STAFF' && (
                                            <NavDropdown.Item as={Link} to="/delivery-dashboard">Delivery
                                                Dashboard</NavDropdown.Item>
                                        )}
                                        {currentUser.roles === 'SALE_STAFF' && (
                                            <NavDropdown.Item as={Link} to="/sale-dashboard">Sale
                                                Dashboard</NavDropdown.Item>
                                        )}
                                        <NavDropdown.Item as={Link} to="/history">Purchase Order</NavDropdown.Item>
                                        {currentUser.roles === 'ADMIN' && (
                                            <NavDropdown.Item as={Link} to="/dashboard-account">Admin
                                                Dashboard</NavDropdown.Item>
                                        )}
                                        {currentUser.roles === 'MANAGER' && (
                                            <NavDropdown.Item as={Link} to="/manager">
                                                Dashboard manager</NavDropdown.Item>
                                        )}
                                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    <NavDropdown
                                        title={<FontAwesomeIcon icon={faUser}/>}
                                        id="account-dropdown"
                                        className={`custom-nav-link ${isMobile ? '' : 'hover-dropdown'}`}
                                    >
                                        <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/register">Sign Up</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                            </div>
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            {!currentUser && (
                <div className="auth-buttons">
                    <Link to="/login" className="auth-buttons__btn auth-buttons__btn--login">Sign in</Link>
                    <Link to="/register" className="auth-buttons__btn auth-buttons__btn--register">Sign up</Link>
                </div>
            )}
            {isSearchOpen && (
                <div className="search-overlay">
                    <Container>
                        <input type="text" placeholder="Search..." className="search-input"/>
                        <button onClick={toggleSearch} className="close-search">×</button>
                    </Container>
                </div>
            )}
        </Navbar>
    );
};

export default Header;