import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from "../Component/header";
import Footer from "../Component/footer";

const Layout = () => {
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const header = document.querySelector('.custom-navbar');
            if (header) {
                setHeaderHeight(header.offsetHeight);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='d-flex flex-column min-vh-100'>
            <Header />
            <div className='flex-grow-1' style={{ paddingTop: `${headerHeight + 0.5}px` }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;