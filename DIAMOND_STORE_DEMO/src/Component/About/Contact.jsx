import React from 'react';
import './ContactInfo.scss';
import SnowEffect from "../Home/SnowEffect";

const ContactInfo = () => {
    return (
        <div className="contact-page">
            <SnowEffect />
            <div className="contact-header">
                <h1>Contact Diamonds Ethers</h1>
                <p>We're always ready to serve you</p>
            </div>

            <div className="contact-content">
                <div className="contact-info">
                    <h2 style={{textAlign:'center'}}>Contact Information</h2>
                    <ul>
                        <li>
                            <i className="icon-location"></i>
                            <span>Lot E2a-7, D1 Street, Hi-Tech Park, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City</span>
                        </li>
                        <li>
                            <i className="icon-phone"></i>
                            <span>+84-62-641-160</span>
                        </li>
                        <li>
                            <i className="icon-email"></i>
                            <span>hungse17002@gmail.com</span>
                        </li>
                        <li>
                            <i className="icon-clock"></i>
                            <span>Mon - Sat: 10:00 AM - 7:00 PM</span>
                        </li>
                    </ul>
                </div>

                <div className="contact-map">
                    <h2 style={{textAlign:'center'}}>Map</h2>
                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.455530412648!2d106.8073081!3d10.8411276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1683834417967!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{border:0}}
                            allowFullScreen=""
                            loading="lazy">
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;