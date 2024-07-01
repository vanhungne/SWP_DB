import React from 'react';
import './AboutUs.scss';
import SnowEffect from "../Home/SnowEffect";

const AboutUs = () => {
    const handleContactUsClick = () => {
        // Replace with your contact page navigation logic
        window.location.href = '/contact';
    };

    return (
        <div className="about-us">
            <SnowEffect />
            <header className="hero">
                <h1>About Esther Diamonds</h1>
                <p style={{color:'darkgray'}}>Discover the brilliance of our legacy</p>
            </header>

            <section className="intro">
                <h2>Our Story</h2>
                <p>For over two decades, Esther Diamonds has been at the forefront of the diamond industry, offering unparalleled expertise and a stunning collection of the world's finest diamonds.</p>
            </section>

            <section className="values">
                <div className="value-item">
                    <img src="https://cdn.pnj.io/images/detailed/134/gn00ddw000502-vo-nhan-kim-cuong-vang-trang-18k-pnj-01.png" alt="Quality Icon" />
                    <h3>Quality</h3>
                    <p>We source only the highest quality diamonds, ensuring each stone meets our rigorous standards.</p>
                </div>
                <div className="value-item">
                    <img src="https://cdn.pnj.io/images/detailed/48/di10203.30072072-kim-cuong-7.2-7.2-vvs1-e-pnj-gia.png" alt="Integrity Icon" />
                    <h3>Integrity</h3>
                    <p>Our business is built on trust, transparency, and ethical practices in every transaction.</p>
                </div>
                <div className="value-item">
                    <img src="https://cdn.pnj.io/images/detailed/134/gn00ddw000502-vo-nhan-kim-cuong-vang-trang-18k-pnj-02.png" alt="Innovation Icon" />
                    <h3>Innovation</h3>
                    <p>We constantly evolve, embracing new technologies and trends in the diamond industry.</p>
                </div>
            </section>

            <section className="team">
                <h2>Our Expert Team</h2>
                <p>With decades of combined experience, our team of gemologists and diamond experts are here to guide you through your diamond journey.</p>
                <div className="team-gallery">
                    <img src="https://cdn.pnj.io/images/detailed/134/gn00ddw000502-vo-nhan-kim-cuong-vang-trang-18k-pnj-04.jpg" alt="Team Member 1" />
                    <img src="https://cdn.pnj.io/images/detailed/134/gn00ddw000502-vo-nhan-kim-cuong-vang-trang-18k-pnj-05.jpg" alt="Team Member 2" />
                    <img src="https://cdn.pnj.io/images/detailed/134/gn00ddw000502-vo-nhan-kim-cuong-vang-trang-18k-pnj-06.jpg" alt="Team Member 3" />
                    <img src="https://cdn.pnj.io/images/detailed/133/gb00ddw000092-vo-bong-tai-kim-cuong-vang-trang-18k-pnj-04.jpg" alt="Team Member 4" />
                </div>
            </section>

            <section className="commitment">
                <h2>Our Commitment</h2>
                <p>At Esther Diamonds, we are committed to providing an exceptional experience. From selection to purchase, we ensure every step reflects our dedication to quality and customer satisfaction.</p>
            </section>

            <section className="cta">
                <h2>Experience the Esther Diamonds Difference</h2>
                <p>Visit our showroom or book a consultation with one of our expert gemologists today.</p>
                <button onClick={handleContactUsClick}>Contact Us</button>
            </section>
        </div>
    );
};

export default AboutUs;