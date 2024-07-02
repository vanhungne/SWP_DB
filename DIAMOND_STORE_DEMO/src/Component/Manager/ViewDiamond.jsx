import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import'../../Scss/ViewDiamond.scss'

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
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}manage/diamond/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
                <p><strong>Product ID:</strong> {diamond.productId}</p>
                <p><strong>Status:</strong> {diamond.status ? 'Active' : 'Inactive'}</p>
                <div>
                    <strong>Certification:</strong>
                    {diamond.certification ? (
                        <div>
                            <img src={diamond.certification} alt="Certification" />
                        </div>
                    ) : (
                        <p>No certification available</p>
                    )}
                </div>
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
