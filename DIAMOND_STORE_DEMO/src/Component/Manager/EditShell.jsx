import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { API_URL } from '../../Config/config';

const EditShell = ({ shellId, goBack, viewShell}) => {
    const [shell, setShell] = useState({
        shellId: '',
        shellName: '',
        shellPrice: '',
        shellMaterial: '',
        shellDesign: '',
        shellWeight: ''
    });
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setShell(prevShell => ({
            ...prevShell,
            [name]: value
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            if (shell.shellId) {
                await axios.put(`${API_URL}manage/shell/update`, shell, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.post(`${API_URL}manage/shell/create`, shell);
            }
            viewShell(shellId);
        } catch (error) {
            console.error('Error saving shell:', error);
            setError('Error saving shell. Please try again later.');
        }
    };

    return (
        <div className="edit-shell">
            <h2>{shell.shellId ? 'Edit Shell' : 'Add Shell'}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="shellName"
                        value={shell.shellName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="shellPrice"
                        value={shell.shellPrice}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Material</label>
                    <input
                        type="text"
                        name="shellMaterial"
                        value={shell.shellMaterial}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Design</label>
                    <input
                        type="text"
                        name="shellDesign"
                        value={shell.shellDesign}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Weight</label>
                    <input
                        type="number"
                        name="shellWeight"
                        value={shell.shellWeight}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={goBack}>Cancel</button>
            </form>
        </div>
    );
};

EditShell.propTypes = {
    shellId: PropTypes.number,
    goBack: PropTypes.func.isRequired,
};

export default EditShell;
