import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUser from './EditUser';
import CreateUser from './CreateUser';
import styles from '../../Scss/dashboard.scss';
import { API_URL } from "../../Config/config";

const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', phoneNumber: '', address: '', role: '', status: '' });
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 7;

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_URL}manage/accounts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    page: page,
                    size: pageSize
                }
            });
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setError('');
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Error fetching users. Please try again later.');
        }
    };
    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowEditModal(true);
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
        if (searchType === 'all' || !searchQuery) {
            fetchUsers(0);
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
            setTotalPages(1);
            setTotalElements(Array.isArray(response.data) ? response.data.length : 1);
            setCurrentPage(0);
            setError('');
        } catch (error) {
            console.error('Error searching users:', error);
            setError('Error searching users. Please try again later.');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className={`${styles['ud-container']} container`}>
            <div style={{marginTop: '20px'}}></div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h1 className={`${styles['ud-title']} mb-4`} style={{textAlign: 'center', fontWeight: 'bolder'}}>
                    <i className="fas fa-users-cog mr-2"></i>Account Management
                </h1>
            </div>

            {error && <div className={`alert alert-danger ${styles['ud-alert']}`}>{error}</div>}
            <div className={`${styles['ud-search-container']} mb-4`}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="input-group">
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
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 text-right">
                        <button
                            className={`btn ${styles['ud-create-button']}`}
                            onClick={() => setShowCreateUser(true)}
                            style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <i className="fas fa-plus mr-2"></i>Create New User
                        </button>
                    </div>
                </div>
            </div>
            <div className={`${styles['ud-table-container']} table-responsive`}
                 style={{
                     borderRadius: '20px',
                     boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                 }}>
                <table className={`table ${styles['ud-table']}`}
                       style={{
                           borderCollapse: 'collapse',
                           width: '100%',
                       }}>
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
                                <td
                                    style={{
                                        color: user.status ? 'green' : 'red',
                                        fontWeight: user.status ? 'bold' : 'bold'
                                    }}
                                    className={user.status ? styles['ud-status-active'] : styles['ud-status-inactive']}
                                >
                                    {user.status ? 'Active' : 'Inactive'}
                                </td>
                                <td>
                                    <button className={`btn btn-sm ${styles['ud-edit-button']}`}
                                            onClick={() => handleEditUser(user)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className={`btn btn-sm ${styles['ud-delete-button']}`}
                                            onClick={() => handleDeleteUser(user.userid)}>
                                        <i className="fas fa-trash"></i>
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

            {/* Pagination */}
            <div className={`${styles['ud-pagination']} d-flex justify-content-between align-items-center mt-4`}>
                <div>
                    Showing {users.length} of {totalElements} users
                </div>
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                        </li>
                        {[...Array(totalPages).keys()].map((page) => (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(page)}>
                                    {page + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {showCreateUser && (
                <div style={{

                    display: 'block',
                    position: 'fixed',
                    zIndex: 1050,
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    backgroundColor: 'rgba(0,0,0,0.4)'
                }}>
                    <div style={{
                        marginTop:'10%',
                        position: 'relative',
                        width: 'auto',
                        margin: '1.75rem auto',
                        maxWidth: '500px'
                    }}>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            backgroundColor: '#fff',
                            borderRadius: '.3rem',
                            outline: 0
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                borderBottom: '1px solid #dee2e6',
                                borderTopLeftRadius: '.3rem',
                                borderTopRightRadius: '.3rem'
                            }}>
                                <h5 style={{marginBottom: 0, lineHeight: 1.5}}>Create User</h5>
                                <button onClick={() => setShowCreateUser(false)} style={{
                                    padding: '1rem',
                                    margin: '-1rem -1rem -1rem auto',
                                    backgroundColor: 'transparent',
                                    border: 0,
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    color: '#000',
                                    textShadow: '0 1px 0 #fff',
                                    opacity: .5
                                }}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div style={{position: 'relative', flex: '1 1 auto', padding: '1rem'}}>
                                <CreateUser
                                    user={newUser}
                                    onSave={handleCreateUser}
                                    onCancel={() => setShowCreateUser(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div style={{
                    display: 'block',
                    position: 'fixed',
                    zIndex: 1050,
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    backgroundColor: 'rgba(0,0,0,0.4)'
                }}>
                    <div style={{
                        marginTop:'10%',
                        position: 'relative',
                        width: 'auto',
                        margin: '1.75rem auto',
                        maxWidth: '500px'
                    }}>
                        <div style={{
                            marginTop:'10%',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            backgroundColor: '#fff',
                            borderRadius: '.3rem',
                            outline: 0
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                borderBottom: '1px solid #dee2e6',
                                borderTopLeftRadius: '.3rem',
                                borderTopRightRadius: '.3rem'
                            }}>
                                <h5 style={{marginBottom: 0, lineHeight: 1.5}}>Edit User</h5>
                                <button onClick={() => setShowEditModal(false)} style={{
                                    padding: '1rem',
                                    margin: '-1rem -1rem -1rem auto',
                                    backgroundColor: 'transparent',
                                    border: 0,
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    color: '#000',
                                    textShadow: '0 1px 0 #fff',
                                    opacity: .5
                                }}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div style={{position: 'relative', flex: '1 1 auto', padding: '1rem'}}>
                                <EditUser
                                    user={editingUser}
                                    onSave={handleUpdateUser}
                                    onCancel={() => setShowEditModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;