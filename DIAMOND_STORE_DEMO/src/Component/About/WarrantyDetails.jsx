import React from 'react';
import './warrantyDetails.scss';

const WarrantyPage = () => {
    const warranties = [
        {
            type: 'Standard',
            icon: '🛡️',
            duration: '1-2 years',
            coverage: 'Manufacturing defects, workmanship issues, normal wear and tear',
            services: ['Basic repairs', 'Annual cleaning', 'Prong tightening', 'Complimentary appraisal'],
            conditions: ['Must present proof of purchase', 'Void if altered by third party', 'Annual inspection required'],
            bestFor: 'Customers looking for basic protection',
            price: 'Product value is under 20.000$',
            color: '#4A90E2'
        },
        {
            type: 'Extended',
            icon: '🏅',
            duration: '3-5 years',
            coverage: 'Standard coverage + accidental damage, stone loss up to 0.25 carats',
            services: ['Advanced repairs', 'Bi-annual cleaning', 'One free resizing', 'Rhodium plating for white gold', 'Priority service'],
            conditions: ['Regular maintenance required', 'Must be purchased within 30 days of original purchase', 'Bi-annual inspection required'],
            bestFor: 'Frequent wearers, active lifestyles',
            price: 'Product value ranges from $20,000 to $100,000',
            color: '#F5A623'
        },
        {
            type: 'Lifetime',
            icon: '💎',
            duration: 'Product lifetime or 25 years, whichever is longer',
            coverage: 'All-inclusive coverage including theft and loss protection up to full item value',
            services: ['Unlimited cleaning', 'All repairs and maintenance', 'Free upgrades every 10 years', 'Annual gemstone check and tightening', 'VIP service and support'],
            conditions: ['Semi-annual inspections required', 'Non-transferable', 'Theft/loss claim requires police report'],
            bestFor: 'Heirloom pieces, high-value items, peace of mind',
            price: 'Product value ranges from 100,000 or more',
            color: '#7ED321'
        },
    ];

    const faqItems = [
        {
            question: "What's not covered by the warranty?",
            answer: "Intentional damage, cosmetic changes due to normal wear, or damage resulting from improper care or exposure to harsh chemicals are typically not covered. The Standard plan doesn't cover accidental damage or loss. Always refer to your specific warranty terms for full details."
        },
        {
            question: "Can I transfer my warranty to someone else?",
            answer: "Standard and Extended warranties are non-transferable. Lifetime warranties may be transferred once to an immediate family member for a fee of $100 or 10% of the original item value, whichever is greater. The transfer must be done in-store and both parties must be present."
        },
        {
            question: "How do I make a claim?",
            answer: "To make a claim, follow these steps: 1) Gather your original purchase receipt and warranty certificate. 2) Visit any of our stores or call our dedicated warranty hotline. 3) Our staff will guide you through filling out a claim form. 4) We'll assess your item and provide repair options or replacement details within 3-5 business days. 5) Once approved, repairs typically take 7-14 days, while replacements can be immediate if the item is in stock."
        },
        {
            question: "What if my item can't be repaired?",
            answer: "If an item cannot be repaired, we offer the following solutions: 1) Replacement with an identical item if available. 2) Store credit for the current market value of the item, which you can use to select a new piece. 3) For Lifetime warranty holders, we offer the option to upgrade to a higher value item by paying the difference. Our goal is to ensure your complete satisfaction."
        }
    ];

    return (
        <div className="warranty-page">
            <header className="header">
                <h1>Luxury Jewelry Protection Plans</h1>
                <p>Safeguard your treasures with our premium warranty options</p>
            </header>

            <section className="warranty-cards">
                {warranties.map((warranty, index) => (
                    <div key={index} className="warranty-card" style={{'--card-color': warranty.color}}>
                        <div className="card-icon">{warranty.icon}</div>
                        <h2>{warranty.type}</h2>
                        <p className="duration">{warranty.duration}</p>
                        <div className="details">
                            <h3>Coverage</h3>
                            <p>{warranty.coverage}</p>
                            <h3>Services</h3>
                            <ul>
                                {warranty.services.map((service, i) => (
                                    <li key={i}>{service}</li>
                                ))}
                            </ul>
                            <h3>Conditions</h3>
                            <ul>
                                {warranty.conditions.map((condition, i) => (
                                    <li key={i}>{condition}</li>
                                ))}
                            </ul>
                            <p className="best-for"><strong>Best For:</strong> {warranty.bestFor}</p>
                            <p className="price"><strong>Price:</strong> {warranty.price}</p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="comparison">
                <h2>Plan Comparison</h2>
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>Feature</th>
                            {warranties.map((w, i) => (
                                <th key={i}>{w.type}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Price</td>
                            <td>Product value is under 20.000$</td>
                            <td>Product value ranges from $20,000 to $100,000</td>
                            <td>Product value ranges from 100,000 or more</td>
                        </tr>
                        <tr>
                            <td>Duration</td>
                            <td>1-2 years</td>
                            <td>3-5 years</td>
                            <td>Lifetime/25 years</td>
                        </tr>
                        <tr>
                            <td>Accidental Damage</td>
                            <td>❌</td>
                            <td>✅</td>
                            <td>✅</td>
                        </tr>
                        <tr>
                            <td>Stone Loss Protection</td>
                            <td>❌</td>
                            <td>Up to 0.25ct</td>
                            <td>Full coverage</td>
                        </tr>
                        <tr>
                            <td>Theft Protection</td>
                            <td>❌</td>
                            <td>❌</td>
                            <td>✅</td>
                        </tr>
                        <tr>
                            <td>Cleaning Frequency</td>
                            <td>Annual</td>
                            <td>Bi-annual</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Transferable</td>
                            <td>❌</td>
                            <td>❌</td>
                            <td>Once (to family)</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="claim-process">
                <h2>Warranty Claim Process</h2>
                <div className="process-steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <p>Bring your item and warranty certificate to any store</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <p>Our experts assess eligibility and damage</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <p>Receive repair estimate or replacement options</p>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <p>We repair or replace your treasured item</p>
                    </div>
                    <div className="step">
                        <div className="step-number">5</div>
                        <p>Enjoy your restored or new jewelry piece</p>
                    </div>
                </div>
            </section>

            <section className="faq">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                    {faqItems.map((item, index) => (
                        <details key={index} className="faq-item">
                            <summary>{item.question}</summary>
                            <p>{item.answer}</p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default WarrantyPage;