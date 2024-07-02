import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import'../../Scss/ViewDiamond.scss'

const ViewShell = ({ shellId, goBack }) => {
    const [shell, setShell] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (shellId) {
            fetchShell(shellId);
        }
    }, [shellId]);

    const fetchShell = async (id) => {
        try {
            const response = await axios.get(`${API_URL}manage/shell/${id}`);
            setShell(response.data);
        } catch (error) {
            console.error('Error fetching shell:', error);
            setError('Error fetching shell. Please try again later.');
        }
    };

    return (
        <div className="view-diamond">
            <h2>View Shell</h2>
            {error && <p className="error">{error}</p>}
            <div className="diamond-details">
                <p><strong>ID:</strong> {shell.shellId}</p>
                <p><strong>Name:</strong> {shell.shellName}</p>
                <p><strong>Price:</strong> {shell.shellPrice}</p>
                <p><strong>Material:</strong> {shell.shellMaterial}</p>
                <p><strong>Design:</strong> {shell.shellDesign}</p>
                <p><strong>Weight:</strong> {shell.shellWeight}</p>
            </div>
            <button onClick={goBack}>Go Back</button>
        </div>
    );
};

ViewShell.propTypes = {
    shellId: PropTypes.number.isRequired,
    goBack: PropTypes.func.isRequired,
};

export default ViewShell;
