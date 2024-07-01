import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Config/config';
import '../../Scss/EditProduct.scss';

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
        categoryId: '',
        shellId: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        diamonds: []
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCategories();
        fetchShells();
        if (productId) {
            fetchProductDetails(productId);
        } else {setProduct({})}
    }, [productId]);

    const fetchProductDetails = async (id) => {
        try {
            const response = await axios.get(`${API_URL}product/${id}`);
            setProduct(response.data);
            setDiamonds(response.data.diamonds);
            setUpdatedProduct({
                productName: response.data.productName,
                collection: response.data.collection,
                description: response.data.description,
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
        setUpdatedProduct({
            ...updatedProduct,
            [name]: value,
        });
        console.log(name+": "+value);
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
                const respone = await  axios.post(`${API_URL}product/add`, updatedProduct, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                viewProduct(respone.data.productId);
            }

        } catch (error) {
            console.error('Error updating product:', error);
            setError('Error updating product. Please try again later.');
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
                setError('Please select a valid diamond.');
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

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-product">
            <div className="button-container">
                <button onClick={goBack}>Back</button>
            </div>
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Product ID:</label>
                    <span>{product.productId}</span>
                </div>
                <div>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        name="productName"
                        value={updatedProduct.productName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Stock Quantity:</label>
                    <span>{product.stockQuantity}</span>
                </div>
                <div>
                    <label>Collection:</label>
                    <input
                        type="text"
                        name="collection"
                        value={updatedProduct.collection}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={updatedProduct.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <select
                        name="categoryId"
                        value={updatedProduct.categoryId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled={true}>Select Category</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Shell:</label>
                    <select
                        name="shellId"
                        value={updatedProduct.shellId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled={true}>Select Shell</option>
                        {shells.map(shell => (
                            <option key={shell.shellId} value={shell.shellId}>
                                {shell.shellName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Diamonds:</label>
                    <ul className="diamonds">
                        {diamonds.length > 0 ? (
                            diamonds.map((diamond, index) => (
                                <li key={index}>
                                    <span>{diamond.diamondId}</span>
                                    <button type="button" onClick={() => handleRemoveDiamond(diamond.diamondId)} className={"float-end"}>Remove</button>
                                </li>
                            ))
                        ) : (
                            <p>No diamonds</p>
                        )}
                    </ul>
                    <div>
                        <button type="button" onClick={fetchUnusedDiamonds}>Load Diamonds</button>
                        <select
                            name="unusedDiamondId"
                            onChange={(e) => handleAddDiamond(e.target.value)}
                        >
                            <option value="" disabled={true}>Select Diamond to Add</option>
                            {unusedDiamonds.map(diamond => (
                                <option key={diamond.diamondId} value={diamond.diamondId}>
                                    {diamond.diamondId}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="image-uploads manager-product-images">
                    <label>Main Image:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'image1')} />
                    <img src={product.image1} alt="Product Image 1" />
                    <br />
                    <label>Image 2:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'image2')} />
                    <img src={product.image2} alt="Product Image 2" />
                    <br />
                    <label>Image 3:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'image3')} />
                    <img src={product.image3} alt="Product Image 3" />
                    <br />
                    <label>Image 4:</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, 'image4')} />
                    <img src={product.image4} alt="Product Image 4" />
                </div>
                <div className="button-container">
                    <button type="submit">Save</button>
                    <button type="button" onClick={goBack}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
