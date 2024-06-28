import React from 'react';
import './Policy.scss';
import SnowEffect from "../Home/SnowEffect";
const WarrantyPolicy = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' ,marginBottom:'10%',marginTop:'3%'}}>
            <SnowEffect />
            <div className="policy-container">
            <h1>PRODUCT POLICIES</h1>
            <div>
                <h4>Pricing</h4>
                <p>Although we strive to provide our customers with the utmost accuracy in our product pricing, we
                    acknowledge that mistakes occasionally occur due to system or human errors. We reserve the right to
                    correct erroneous pricing and may not honor any order placed for an item at an incorrect price. Our
                    prices also are subject to change without notice. We apologize for any inconvenience this policy may
                    cause. All prices listed on our website are in U.S. dollars. (Please note that where a price is
                    designated as discounted, interim markdowns may have been taken, and the original price may not have
                    resulted in actual sales.)</p>
            </div>
            <div>
                <h4>Availability</h4>
                <p>Due to the volume of orders we receive, items may temporarily go out of stock. If you would like to
                    purchase a piece that is on back-order, contact our Customer Service department to find out when the
                    item will be back in stock. Occasionally, an item might even go out of stock before we have the
                    chance to update our product information on the website. If this is the case, our Customer Service
                    representatives will personally contact you to help you find another item.</p>
            </div>
            <div>
                <h4>Information</h4>
                <p>We want to help you make an informed, confident purchase whenever you buy from Diamonds
                    International. Our goal is to provide you with as much information as possible about each item we
                    sell so you can appreciate the beauty of our merchandise. In compliance with jewelry industry
                    standards and FTC regulations, all of the total carat weights listed for our diamond jewelry may
                    vary by 0.05 carats. Also, if an item contains multiple diamonds, we list the average grade for
                    color, clarity and carat weight, based on a mean average of all grades or measurements for that
                    particular piece in our inventory. Although we have made every effort to present accurate
                    information, we reserve the right to correct any descriptive or typographical errors.</p>
            </div>
            <div>
                <h4>Pictures</h4>
                <p>The color and size you see in depictions of products on this website depends in part on your computer
                    monitor, including both its manufacture and your hardware and software settings. For this reason,
                    although Diamonds International makes every effort to assure the most accurate and highest quality
                    representations of its merchandise on its website, we cannot guarantee that the color you see will
                    be accurate. Items are not shown to scale as compared to each other unless appearing in the same
                    photograph, and you are responsible to examine merchandise descriptions to ascertain actual size.
                    Some photographs have been enlarged to show detail.</p>
            </div>
        </div>
        </div>
    );
};

export default WarrantyPolicy;