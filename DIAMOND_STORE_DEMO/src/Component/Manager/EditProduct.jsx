import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import '../../Scss/EditProduct.scss';
import iziToast from "izitoast";

const EditProduct = ({ productId, goBack, viewProduct }) => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [diamonds, setDiamonds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [shells, setShells] = useState([]);
    const [unusedDiamonds, setUnusedDiamonds] = useState([]);
    const [updatedProduct, setUpdatedProduct] = useState({
        productName: '',
        collection: '',
        description: '',
        markupRate: '',
        categoryId: '',
        shellId: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        diamonds: []
    });
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCategories();
        fetchShells();
        if (productId) {
            fetchProductDetails(productId);
        } else {
            setProduct({});
        }
        window.scrollTo(0, 0);
    }, [productId]);

    const fetchProductDetails = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}product/${id}`);
            setProduct(response.data);
            setDiamonds(response.data.diamonds);
            setUpdatedProduct({
                productName: response.data.productName,
                collection: response.data.collection,
                description: response.data.description,
                markupRate: response.data.markupRate,
                categoryId: response.data.categoryId,
                shellId: response.data.shellId,
                image1: response.data.image1,
                image2: response.data.image2,
                image3: response.data.image3,
                image4: response.data.image4,
                diamonds: response.data.diamonds
            });
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Error fetching product details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}manager/get-all-category`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchShells = async () => {
        try {
            const response = await axios.get(`${API_URL}manage/shell/get-all`);
            setShells(response.data);
        } catch (error) {
            console.error('Error fetching shells:', error);
        }
    };

    const fetchUnusedDiamonds = async () => {
        try {
            const response = await axios.get(`${API_URL}manager/get-all-unused-diamond`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUnusedDiamonds(response.data);
        } catch (error) {
            console.error('Error fetching unused diamonds:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(value !== null && value !== "") {
            setUpdatedProduct({
                ...updatedProduct,
                [name]: value,
            });
        }
    };

    const handleImageUpload = (e, imageField) => {
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
                    setUpdatedProduct((prevState) => ({
                        ...prevState,
                        [imageField]: response.data.url,
                    }));
                    setProduct((prevState) => ({
                        ...prevState,
                        [imageField]: response.data.url,
                    }));
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                    setError('Error uploading image. Please try again later.');
                });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if(productId) {
                await axios.put(
                    `${API_URL}product/update/${productId}`,
                    updatedProduct,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                viewProduct(productId);
            } else {
                const response = await axios.post(`${API_URL}product/add`, updatedProduct, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                viewProduct(response.data.productId);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setError('Error updating product. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDiamond = async (diamondId) => {
        try {
            if (diamondId && diamondId !== "") {
                const response = await axios.get(`${API_URL}manager/add-diamond`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        diamondId: parseInt(diamondId, 10),
                        productId: productId,
                    },
                });
                const newDiamond = response.data;
                setDiamonds((prevDiamonds) => [...prevDiamonds, newDiamond]);
                setUpdatedProduct((prevUpdatedProduct) => ({
                    ...prevUpdatedProduct,
                    diamonds: [...prevUpdatedProduct.diamonds, newDiamond],
                }));
            } else {
                console.error('Invalid diamondId:', diamondId);
                iziToast.error({
                    title: 'error',
                    message: 'Please select a valid diamond',
                    position: 'topRight'
                });
            }
        } catch (error) {
            console.error('Error adding diamond:', error);
            setError('Error adding diamond. Please try again later.');
        }
    };

    const handleRemoveDiamond = async (diamondId) => {
        try {
            await axios.post(
                `${API_URL}manager/remove-diamond`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        diamondId: parseInt(diamondId, 10)
                    }
                }
            );
            setDiamonds(diamonds.filter(diamond => diamond.diamondId !== diamondId));
            setUpdatedProduct((prevUpdatedProduct) => ({
                ...prevUpdatedProduct,
                diamonds: prevUpdatedProduct.diamonds.filter(diamond => diamond.diamondId !== diamondId),
            }));
        } catch (error) {
            console.error('Error removing diamond:', error);
            setError('Error removing diamond. Please try again later.');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!product) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="edit-product">
            <div className="header">
                <button className="back-button" onClick={goBack}>Back</button>
                <h1>{productId ? 'Edit Product' : 'Add New Product'}</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product ID:</label>
                    <span>{product.productId}</span>
                </div>
                <div className="form-group">
                    <label htmlFor="productName">Product Name:</label>
                    <input
                        id="productName"
                        type="text"
                        name="productName"
                        value={updatedProduct.productName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Stock Quantity:</label>
                    <span>{product.stockQuantity}</span>
                </div>
                <div className="form-group">
                    <label htmlFor="collection">Collection:</label>
                    <input
                        id="collection"
                        type="text"
                        name="collection"
                        value={updatedProduct.collection}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={updatedProduct.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="markupRate">Markup rate:</label>
                    <input
                        id="markupRate"
                        name="markupRate"
                        type="number"
                        value={updatedProduct.markupRate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categoryId">Category:</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={updatedProduct.categoryId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="shellId">Shell:</label>
                    <select
                        id="shellId"
                        name="shellId"
                        value={updatedProduct.shellId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Shell</option>
                        {shells.map(shell => (
                            <option key={shell.shellId} value={shell.shellId}>
                                {shell.shellName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Diamonds:</label>
                    <ul className="diamonds-list">
                        {diamonds.length > 0 ? (
                            diamonds.map((diamond, index) => (
                                <li key={index}>
                                    <span>{diamond.diamondId}</span>
                                    <button type="button" onClick={() => handleRemoveDiamond(diamond.diamondId)}
                                            className="remove-button">Remove
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>No diamonds</p>
                        )}
                    </ul>
                    <div className="add-diamond">
                        <button type="button" onClick={fetchUnusedDiamonds} className="load-diamonds-button">Load
                            Diamonds
                        </button>
                        <select
                            name="unusedDiamondId"
                            onChange={(e) => handleAddDiamond(e.target.value)}
                        >
                            <option value="">Select Diamond to Add</option>
                            {unusedDiamonds.map(diamond => (
                                <option key={diamond.diamondId} value={diamond.diamondId}>
                                    {diamond.diamondId}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="image-uploads">
                    {['image1', 'image2', 'image3', 'image4'].map((imageField, index) => (
                        <div key={imageField} className="image-upload">
                            <label htmlFor={imageField}>Image {index + 1}:</label>
                            <input
                                id={imageField}
                                type="file"
                                onChange={(e) => handleImageUpload(e, imageField)}
                            />
                            {product[imageField] && (
                                <img src={product[imageField]} alt={`Product Image ${index + 1}`}/>
                            )}
                        </div>
                    ))}
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-button">Save</button>
                    <button type="button" onClick={goBack} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;