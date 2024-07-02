import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Scss/ManagerDashBoard.scss';
import { API_URL } from "../../Config/config";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ categoryId: '', categoryName: '' });
    const [editing, setEditing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}manager/get-all-category`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCreate = async () => {
        try {
            await axios.post(`${API_URL}manager/category/create`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCategories();
            setForm({ categoryId: '', categoryName: '' });
            setShowModal(false);
        } catch (error) {
            console.error('Error creating category', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${API_URL}manager/category/update`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCategories();
            setForm({ categoryId: '', categoryName: '' });
            setEditing(false);
            setShowModal(false);
        } catch (error) {
            console.error('Error updating category', error);
        }
    };

    const handleEdit = (category) => {
        setForm(category);
        setEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}manager/category/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category', error);
        }
    };

    const handleShowModal = () => {
        setForm({ categoryId: '', categoryName: '' });
        setEditing(false);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="main-content">
            <div className="table-container">
                <div className="table-header">
                    <h1>Category Management</h1>
                    <button className="btn-create manager-float-end float-end" onClick={handleShowModal}>
                        Create Category
                    </button>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr key={category.categoryId}>
                            <td>{category.categoryId}</td>
                            <td>{category.categoryName}</td>
                            <td>
                                <button className="btn btn-edit" onClick={() => handleEdit(category)}>
                                    Edit
                                </button>
                                <button className="btn btn-delete" style={{backgroundColor: '#dc3545', color: '#fff'}}
                                        onClick={() => handleDelete(category.categoryId)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="category-dashboard-modal">
                    <div className="modal-content">
                        <div>
                            <span className="close float-end me-3" onClick={handleCloseModal}>
                            &times;
                        </span>
                        </div>
                        <h2>{editing ? 'Edit Category' : 'Create Category'}</h2>
                        <input
                            type="text"
                            name="categoryName"
                            value={form.categoryName}
                            onChange={handleInputChange}
                            placeholder="Category Name"
                        />
                        {editing ? (
                            <button className="btn-create" onClick={handleUpdate}>
                                Update Category
                            </button>
                        ) : (
                            <button className="btn-create" onClick={handleCreate}>
                                Create Category
                            </button>
                        )}
                        <button className="btn-cancel" onClick={handleCloseModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;
