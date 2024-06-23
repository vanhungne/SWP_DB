import React from 'react';
import './OurStory.scss';

const OurStory = () => {
    return (
        <section className="our-story">
            <div className="our-story-header">
                <img src="https://www.michaeltrio.com/pub/media/0story/01.jpg" alt="Our Story" />
                <img src="https://www.michaeltrio.com/pub/media/0story/02.jpg" alt="Our Story" />
                <h1>THREE SONS, THREE GENERATIONS, THREE VALUES.</h1>
            </div>
            <div className="our-story-content">
                <div className="container">
                    <div className="row"
                         style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40%'}}>
                        <div className="col-md-6" style={{textAlign: 'center'}}>
                            <img src="https://www.michaeltrio.com/pub/media/0story/03.png" alt="Our Story"
                                 style={{maxWidth: '100%', height: 'auto'}}/>
                        </div>
                        <div className="col-md-6" style={{textAlign: 'center'}}>
                            <p>
                                Michael Trio is a homegrown custom jewellery brand, founded in 2012 as an ode to our
                                late father. With over 40 years of experience in the jewellery industry, our mission is
                                to provide quality products and exceptional services at a remarkable price.
                            </p>
                            <p>
                                From sourcing raw materials to delivering an exceptional online-to-offline retail
                                experience, we adopted the vertical integration model which allows us to reduce cost and
                                at the same time make your jewellery-buying experience a memorable one!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="our-story-inspiration">
                <img src="https://www.michaeltrio.com/pub/media/0story/04.jpg" alt="Our Inspiration"/>
                <h1>Our Inspiration</h1>
                <p>
                    A story of love, a love between mom and dad. At the end of the day, what matters most is the
                    0.9-carat yellow gold, classic ring. Mom still wears her wedding ring to this day, despite having
                    many other bigger diamond rings. This is a story of love that goes beyond "Till death do us part".
                </p>
            </div>
            <div className="our-story-values">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <img src="https://www.michaeltrio.com/pub/media/0story/06.png" alt="Family"/>
                        </div>
                        <div className="col-md-4">
                            <img src="https://www.michaeltrio.com/pub/media/0story/07.png" alt="Trust"/>
                        </div>
                        <div className="col-md-4">
                            <img src="https://www.michaeltrio.com/pub/media/0story/08.jpg" alt="Love" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="our-story-pricing">
                <div className="container">
                    <h1>Expect Lower Markups</h1>
                    <p>
                        With lesser steps, we reduce the cost, bringing you the diamonds at a lower price. Come down to our showrooms where our knowledgeable consultants will be able to assist in delivering your needs.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default OurStory;