import React from 'react';
import './know.scss';
import SnowEffect from "../../Home/SnowEffect";

const DiamondKnowledge = () => {
    return (
        <div className="diamond-knowledge" style={{paddingBottom:'10%'}}>
            <SnowEffect />
            <header className="hero">
                <h1>Knowledge About Diamonds</h1>
                <p className="subtitle">Uncover the brilliance of diamond expertise</p>
            </header>

            <section className="intro">
                <p>To choose a truly luxurious diamond, consumers must undergo thorough research. Understanding the 4C standards and the Rapaport Diamond Price List is crucial. This guide will provide you with essential knowledge about diamond pricing, helping you navigate the market and avoid potential pitfalls.</p>
            </section>

            <section className="pricing-factors">
                <h2>Diamond Price Factors</h2>
                <div className="factor-grid">
                    <div className="factor">
                        <h3>Carat</h3>
                        <p>The weight or size of the diamond</p>
                    </div>
                    <div className="factor">
                        <h3>Color</h3>
                        <p>The color grade of the diamond</p>
                    </div>
                    <div className="factor">
                        <h3>Clarity</h3>
                        <p>The purity or cleanliness of a diamond</p>
                    </div>
                    <div className="factor">
                        <h3>Cut</h3>
                        <p>The proportions and angles of the facets</p>
                    </div>
                </div>
            </section>

            <section className="carat-weight">
                <h2>Weight (Carat) - The First Pricing Factor</h2>
                <img src="https://static.wixstatic.com/media/452282_8564f860e9fe496aade2c34fb0b82a92~mv2.png/v1/fill/w_925,h_254,al_c,lg_1,q_85,enc_auto/452282_8564f860e9fe496aade2c34fb0b82a92~mv2.png" alt="Diamond carat weight chart"/>
                <p>Carat is a unit of weight and a crucial factor in diamond pricing. It represents the rarity of a diamond, with larger diamonds being scarcer and thus more valuable. However, the relationship between size and price is not linear - a 2-carat diamond is not simply twice the price of a 1-carat diamond.</p>
            </section>

            <section className="color-grade">
                <h2>Color - Second Pricing Factor</h2>
                <img src="https://beyond4cs.com/wp-content/uploads/2019/02/diamond-color-chart-with-example-diamonds-of-each-alphabet.jpg" alt="Diamond color grade chart"/>
                <p>For colorless diamonds, the absence of color determines quality. The more transparent a diamond, the rarer and more valuable it becomes. Most consumers opt for diamonds in the G-H-I range, balancing quality and price.</p>
            </section>

            <section className="clarity">
                <h2>Clarity - The Third Price Factor</h2>
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjlIrxg9rl6yL7ABQ1fA51xbaUb5AVZ2NPGwTu-XPr2VP4BCm-hvGbndXD3BMEEx3SeBlSPlMYIzE5AeagVeAjB9QGB6Yoho55fewChkroWA4Iu5z3DXc7nbwWYyALwQFUIuUnvpsavz38/s1600/tim-hieu-do-tinh-khiet-cua-kim-cuong-01.jpg" alt="Diamond clarity chart"/>
                <p>Clarity refers to the absence of inclusions and blemishes. Higher clarity grades indicate fewer imperfections, resulting in increased value. Most buyers prefer diamonds with clarity grades of VS2 or higher.</p>
            </section>

            <section className="cut">
                <h2>Cut Form - The Fourth Price Factor</h2>
                <img src="https://cdn.shopify.com/s/files/1/0634/1473/0987/files/Types-of-Diamond-Cuts---How-to-Choose-The-Right-Shape.jpg?v=1648226450" alt="Diamond cut shapes"/>
                <p>The cut of a diamond significantly impacts its brilliance and fire. It determines how light enters and reflects within the diamond, playing a crucial role in the stone's overall beauty and value.</p>
            </section>

            <section className="price-calculation">
                <h2>How to Calculate the Price of Diamonds</h2>
                <div className="calculation-steps">
                    <h3>1. Price per Carat</h3>
                    <img src="https://www.diamonds.pro/wp-content/uploads/2009/06/rapaport.gif" alt="Rapaport price list"/>
                    <p>The basic formula is: <strong>Diamond price = Price per Carat × carat weight</strong></p>
                    <p>For example, a 3 carat, G color, VS1 clarity diamond at $28,270 per carat would cost: 28,270 × 3 = $84,810</p>
                </div>
                <div className="calculation-steps">
                    <h3>2. Rapaport Diamond Price List</h3>
                    <p>The Rapaport price list is a standard reference in the diamond trade. It provides a starting point for negotiations based on a diamond's characteristics.</p>
                    <img src="https://static.wixstatic.com/media/452282_0fc5037bf33c491192a99fa04694f367~mv2.png/v1/fill/w_750,h_439,al_c,lg_1,q_85,enc_auto/452282_0fc5037bf33c491192a99fa04694f367~mv2.png" alt="Rapaport price calculation example"/>
                </div>
            </section>

            <section className="conclusion">
                <h2>Final Thoughts</h2>
                <p>Understanding the 4C standards and the Rapaport table empowers you to make informed decisions when purchasing diamonds. By mastering these pricing methods, you can select a diamond that not only fits your budget but also meets your quality expectations.</p>
            </section>
        </div>
    );
};

export default DiamondKnowledge;