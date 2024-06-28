import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../../Config/config';

const ViewDiamond = ({ diamondId, goBack }) => {
    const [diamond, setDiamond] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (diamondId) {
            fetchDiamond(diamondId);
        }
    }, [diamondId]);

    const fetchDiamond = async (id) => {
        try {
            const response = await axios.get(`${API_URL}diamond/${id}`);
            setDiamond(response.data);
        } catch (error) {
            console.error('Error fetching diamond:', error);
            setError('Error fetching diamond. Please try again later.');
        }
    };

    return (
        <div className="view-diamond">
            <h2>View Diamond</h2>
            {error && <p className="error">{error}</p>}
            <div className="diamond-details">
                <p><strong>ID:</strong> {diamond.diamondId}</p>
                <p><strong>Carat:</strong> {diamond.carat}</p>
                <p><strong>Price:</strong> {diamond.price}</p>
                <p><strong>Cut:</strong> {diamond.cut}</p>
                <p><strong>Color:</strong> {diamond.color}</p>
                <p><strong>Clarity:</strong> {diamond.clarity}</p>
                <p><strong>Certification:</strong> {diamond.certification}</p>
                <p><strong>Product ID:</strong> {diamond.productId}</p>
                <p><strong>Status:</strong> {diamond.status ? 'Active' : 'Inactive'}</p>
            </div>
            <button onClick={goBack}>Go Back</button>
        </div>
    );
};

ViewDiamond.propTypes = {
    diamondId: PropTypes.number.isRequired,
    goBack: PropTypes.func.isRequired,
};

export default ViewDiamond;
