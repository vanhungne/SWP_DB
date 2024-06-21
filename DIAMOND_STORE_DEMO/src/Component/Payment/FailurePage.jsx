import React from 'react';
import { Link } from 'react-router-dom';

const FailurePage = () => {
    return (
        <div className="container mt-5">
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Payment Failed!</h4>
                <p>There was an error processing your payment.</p>
                <hr />
                <p className="mb-0">Please try again or contact support.</p>
            </div>
            <Link to="/" className="btn btn-primary mt-3">Return to Home</Link>
        </div>
    );
};

export default FailurePage;
