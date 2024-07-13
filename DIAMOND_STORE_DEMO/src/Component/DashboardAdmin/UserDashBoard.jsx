import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Table, Input, Button, Modal, message, Tooltip, Tag, Space, Popconfirm, Select } from 'antd';
import { SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditUser from './EditUser';
import CreateUser from './CreateUser';
import { API_URL } from "../../Config/config";

const { Option } = Select;

const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('email');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        fetchUsers();
    }, [pagination.current, pagination.pageSize]);

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_URL}manage/accounts`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: pagination.current - 1,
                    size: pagination.pageSize,
                },
            });
            setUsers(response.data.content);
            setPagination(prev => ({
                ...prev,
                total: response.data.totalElements,
            }));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Failed to fetch users. Please try again.');
            setLoading(false);
        }
    };

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsEditModalVisible(true);
    };

    const handleUpdateUser = async (updatedUser) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${API_URL}manage/accounts/${updatedUser.userid}`, updatedUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsEditModalVisible(false);
            message.success('User updated successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            message.error('Failed to update user. Please try again.');
        }
    };

    const handleCreateUser = async (newUser) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_URL}manage/accounts`, newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsCreateModalVisible(false);
            message.success('User created successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            message.error('Failed to create user. Please try again.');
        }
    };

    const handleDeleteUser = async (userid) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}manage/accounts/${userid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Failed to delete user. Please try again.');
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'userid',
            key: 'userid',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                { text: 'Admin', value: 'ADMIN' },
                { text: 'Customer', value: 'CUSTOMER' },
                { text: 'Sale', value: 'SALE_STAFF' },
                { text: 'Delivery', value: 'DELIVERY_STAFF' },
                { text: 'Manager', value: 'MANAGER' },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status ? 'green' : 'red'}>
                    {status ? 'Active' : 'Inactive'}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit">
                        <Button icon={<EditOutlined />} onClick={() => handleEditUser(record)} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure you want to delete this user?"
                            onConfirm={() => handleDeleteUser(record.userid)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            if (searchField === 'status') {
                return user.status.toString().toLowerCase().includes(searchText.toLowerCase());
            }
            return user[searchField] && user[searchField].toString().toLowerCase().includes(searchText.toLowerCase());
        });
    }, [users, searchText, searchField]);

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ marginBottom: '24px' }}>User Management</h1>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                    <Select
                        defaultValue="email"
                        style={{ width: 120 }}
                        onChange={(value) => setSearchField(value)}
                    >
                        <Option value="email">Email</Option>
                        <Option value="phoneNumber">Phone</Option>
                        <Option value="role">Role</Option>
                        <Option value="status">Status</Option>
                    </Select>
                    <Input.Search
                        placeholder={`Search by ${searchField}`}
                        onSearch={(value) => setSearchText(value)}
                        style={{ width: 300 }}
                    />
                </Space>
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => setIsCreateModalVisible(true)}
                >
                    Create User
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="userid"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
            <Modal
                title="Edit User"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <EditUser
                    user={editingUser}
                    onSave={handleUpdateUser}
                    onCancel={() => setIsEditModalVisible(false)}
                />
            </Modal>
            <Modal
                title="Create User"
                visible={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                footer={null}
            >
                <CreateUser
                    onSave={handleCreateUser}
                    onCancel={() => setIsCreateModalVisible(false)}
                />
            </Modal>
        </div>
    );
};

export default UserDashboard;