import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUser from './EditUser';
import CreateUser from './CreateUser';
import styles from '../../Scss/dashboard.scss';
import {API_URL} from "../../Config/config";

const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', phoneNumber: '', address: '', role: '', status: '' });
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('id');


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        const allUsers = [];
        let page = 0;
        let hasMoreData = true;

        while (hasMoreData) {
            try {
                const response = await axios.get(`${API_URL}manage/accounts`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        page: page,
                        size: 10
                    }
                });

                allUsers.push(...response.data.content);
                hasMoreData = page < response.data.totalPages - 1;
                page++;
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users. Please try again later.');
                hasMoreData = false;
            }
        }

        setUsers(allUsers);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const toggleCreateUserModal = (value) => {
        setShowCreateUser(value);
    };

    const handleUpdateUser = async (updatedUser) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_URL}manage/accounts/${updatedUser.userid}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEditingUser(null);
            setShowEditModal(false);
            await fetchUsers();
            setError('');
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Error updating user. Please try again later.');
        }
    };

    const handleCreateUser = async (user) => {
        if (!user.name || !user.email || !user.role) {
            setError('Please fill in all required fields.');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            user.status = user.status === 'active' ? true : false;
            await axios.post(`${API_URL}manage/accounts`, user, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewUser({ name: '', email: '', phoneNumber: '', address: '', role: '', status: '' });
            await fetchUsers();
            setError('');
            setShowCreateUser(false);
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Error creating user. Please try again later.');
        }
    };

    const handleDeleteUser = async (userid) => {
        if (!userid) {
            setError('Invalid user ID.');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}manage/accounts/${userid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await fetchUsers();
            setError('');
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Error deleting user. Please try again later.');
        }
    };

    const handleSearch = async () => {
        if (searchType === 'all') {
            fetchUsers();
            return;
        }

        if (!searchQuery) {
            fetchUsers();
            return;
        }

        const token = localStorage.getItem('token');
        let url = '';
        if (searchType === 'id') {
            url = `${API_URL}manage/accounts/${searchQuery}`;
        } else if (searchType === 'name') {
            url = `${API_URL}manage/searchAccount-name`;
        } else if (searchType === 'email') {
            url = `${API_URL}manage/searchAccount-email`;
        }

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: searchType !== 'id' ? { [searchType]: searchQuery } : {}
            });
            setUsers(Array.isArray(response.data) ? response.data : [response.data]);
            setError('');
        } catch (error) {
            console.error('Error searching users:', error);
            setError('Error searching users. Please try again later.');
        }
    };

    return (
        <div className={styles['ud-container']}>
            <h1 className={styles['ud-title']}>
                <i className="fas fa-users-cog"></i> Admin Dashboard
            </h1>
            {error && <div className={`alert alert-danger ${styles['ud-alert']}`}>{error}</div>}
            <div className={styles['ud-search-container']} >
                <div className="input-group" style={{width:'50%'}}>
                    <input
                        type="text"
                        className={`form-control ${styles['ud-search-input']}`}
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className={`form-control ${styles['ud-search-select']}`}
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="all">Show All</option>
                        <option value="id">ID</option>
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                    </select>
                    <div className="input-group-append">
                        <button className={`btn ${styles['ud-search-button']}`} onClick={handleSearch}>
                            <i className="fas fa-search"></i> Search
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles['ud-table-container']}>
                <table className={`table ${styles['ud-table']}`}>
                    <thead>
                    <tr>
                        <th>ID</th>
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
                    {users && users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.userid}>
                                <td>{user.userid}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.address}</td>
                                <td>{user.role}</td>
                                <td style={{color: user.status ? 'green' : 'red'}}>
                                    {user.status ? 'Active' : 'Inactive'}
                                </td>

                                <td>
                                    <button className={`btn btn-sm ${styles.editButton}`}
                                            onClick={() => handleEditUser(user)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className={`btn btn-sm ${styles.deleteButton}`}
                                            onClick={() => handleDeleteUser(user.userid)}>
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No users found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="text-center">
                <button className={`btn ${styles.createButton}`} onClick={() => setShowCreateUser(true)}>
                    <i className="fas fa-user-plus"></i> Create New User
                </button>
            </div>

            {showCreateUser && (
                <div className="modal" style={{display: 'block'}}>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{width:'140%'}}>
                            <div className="modal-header">
                                <h5 className="modal-title">Create User</h5>
                                <button type="button" className="close" onClick={() => setShowCreateUser(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <CreateUser user={newUser} onSave={handleCreateUser} onCancel={() => setShowCreateUser(false)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{width: '140%'}}>
                            <div className="modal-header">
                                <h5 className="modal-title">Edit User</h5>
                                <button type="button" className="close" onClick={() => setShowEditModal(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <EditUser user={editingUser} onSave={handleUpdateUser}
                                          onCancel={() => setShowEditModal(false)}/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
