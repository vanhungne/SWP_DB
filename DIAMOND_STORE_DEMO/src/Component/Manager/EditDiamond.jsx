import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import '../../Scss/EditDiamond.scss';

const EditDiamond = ({ diamondId, goBack }) => {
    const [diamond, setDiamond] = useState({});
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [updatedDiamond, setUpdatedDiamond] = useState({
        diamondId: '',
        carat: '',
        price: '',
        cut: '',
        color: '',
        clarity: '',
        certification: '',
        productId: '',
        status: ''
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (diamondId) {
            fetchDiamondDetails(diamondId);
        } else {
            setDiamond({});
        }
    }, [diamondId]);

    const fetchDiamondDetails = async (id) => {
        try {
            const response = await axios.get(`${API_URL}manage/diamond/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDiamond(response.data);
            setUpdatedDiamond({
                diamondId: response.data.diamondId,
                carat: response.data.carat,
                price: response.data.price,
                cut: response.data.cut,
                color: response.data.color,
                clarity: response.data.clarity,
                certification: response.data.certification,
                productId: response.data.productId,
                status: response.data.status
            });
        } catch (error) {
            console.error('Error fetching diamond details:', error);
            setError('Error fetching diamond details. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedDiamond({
            ...updatedDiamond,
            [name]: value,
        });
        // Clear the error for this field when the user starts typing
        setFormErrors({
            ...formErrors,
            [name]: ''
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            axios.post(`${API_URL}manager/cloudinary/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                    setUpdatedDiamond((prevState) => ({
                        ...prevState,
                        certification: response.data.url,
                    }));
                    setDiamond((prevState) => ({
                        ...prevState,
                        certification: response.data.url,
                    }));
                    // Clear the error for certification when a file is uploaded
                    setFormErrors({
                        ...formErrors,
                        certification: ''
                    });
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                    setError('Error uploading image. Please try again later.');
                });
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Check each required field
        ['carat', 'cut', 'color', 'clarity', 'certification'].forEach(field => {
            if (!updatedDiamond[field]) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                isValid = false;
            }
        });

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            if (diamondId) {
                await axios.put(`${API_URL}manage/diamond/update`, updatedDiamond, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                await axios.post(`${API_URL}manage/diamond/create`, updatedDiamond, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
            goBack();
        } catch (error) {
            console.error('Error saving diamond:', error);
            setError('Error saving diamond. Please try again later.');
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!diamond && diamondId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-product">
            <div className="button-container">
                <button onClick={goBack}>Back</button>
            </div>
            <h1>{diamondId ? 'Edit Diamond' : 'Add Diamond'}</h1>
            <form onSubmit={handleSubmit}>
                {diamondId && (
                    <div>
                        <label>Diamond ID:</label>
                        <span>{diamond.diamondId}</span>
                    </div>
                )}
                <div>
                    <label>Carat:</label>
                    <input
                        type="number"
                        name="carat"
                        value={updatedDiamond.carat}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.carat && <span className="error">{formErrors.carat}</span>}
                </div>
                <div>
                    <span>{updatedDiamond.price}</span>
                </div>
                <div>
                    <label>Cut:</label>
                    <input
                        type="text"
                        name="cut"
                        value={updatedDiamond.cut}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.cut && <span className="error">{formErrors.cut}</span>}
                </div>
                <div>
                    <label>Color:</label>
                    <input
                        type="text"
                        name="color"
                        value={updatedDiamond.color}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.color && <span className="error">{formErrors.color}</span>}
                </div>
                <div>
                    <label>Clarity:</label>
                    <input
                        type="text"
                        name="clarity"
                        value={updatedDiamond.clarity}
                        onChange={handleInputChange}
                        required
                    />
                    {formErrors.clarity && <span className="error">{formErrors.clarity}</span>}
                </div>
                <div>
                    <label>Certification:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                    {formErrors.certification && <span className="error">{formErrors.certification}</span>}
                </div>
                {diamond.certification && <img src={diamond.certification} alt="Certification" />}
                <div className="button-container">
                    <button type="submit">Save</button>
                    <button type="button" onClick={goBack}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditDiamond;