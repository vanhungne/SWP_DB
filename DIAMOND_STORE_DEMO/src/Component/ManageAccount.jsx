import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Scss/account.css';

const ManageAccount = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', phoneNumber: '', address: '', role: '', status: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8080/manage/accounts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data && Array.isArray(response.data.content)) {
                setUsers(response.data.content);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Error fetching users. Please try again later.');
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleUpdateUser = async (updatedUser) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:8080/manage/accounts/${updatedUser.userid}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Error updating user. Please try again later.');
        }
    };

    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.role || !newUser.phoneNumber || !newUser.address || !newUser.status) {
            setError('Please fill in all required fields.');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8080/manage/accounts', newUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewUser({ name: '', email: '', phoneNumber: '', address: '', role: '', status: '' });
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Error creating user. Please try again later.');
        }
    };

    const handleDeleteUser = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/manage/accounts/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Error deleting user. Please try again later.');
        }
    };
    return (
        <div className="container">
            <h1 className="mt-4 mb-4">Admin Dashboard</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <h2 className="mb-4">Users</h2>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.userid}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.address}</td>
                        <td>{user.role}</td>
                        <td>{user.status ? 'Active' : 'Inactive'}</td>
                        <td>
                            <button className="btn btn-primary btn-sm mr-2 btn-normal" onClick={() => handleEditUser(user)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.userid)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {editingUser && (
                <div className="mt-4">
                    <h3>Edit User</h3>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={editingUser.name}
                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={editingUser.phoneNumber}
                            onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            className="form-control"
                            value={editingUser.address}
                            onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input
                            type="text"
                            className="form-control"
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            className="form-control"
                            value={editingUser.status}
                            onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <button className="btn btn-success mr-2" onClick={() => handleUpdateUser(editingUser)}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
                </div>
            )}

            <div className="mt-4">
                <h3>Create New User</h3>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Phone Number"
                        value={newUser.phoneNumber}
                        onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        className="form-control"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <select
                        className="form-control"
                        value={newUser.status}
                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <button className="btn btn-primary btn-sm btn-normal" onClick={handleCreateUser}>Create</button>
            </div>
        </div>
    );
};

export default ManageAccount;
