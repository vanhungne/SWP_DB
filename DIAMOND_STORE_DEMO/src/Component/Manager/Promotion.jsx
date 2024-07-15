import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Authentication/AuthContext';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@material-ui/core';
import { API_URL } from "../../Config/config";
import iziToast from 'izitoast';

const Promotion = () => {
    const { currentUser} = useAuth();
    const [promotions, setPromotions] = useState([]);
    const [open, setOpen] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const token = localStorage.getItem('token');
    const [form, setForm] = useState({
        promotionId: null,
        promotionName: '',
        promotionStartDate: '',
        promotionEndDate: '',
        managerId: 0
    });

    useEffect(() => {
        if (searchCriteria) {
            fetchPromotionsByName(currentPage, pageSize, searchCriteria);
        } else {
            fetchPromotions(currentPage, pageSize);
        }
        window.scrollTo(0, 0);
    }, [currentPage, pageSize, searchCriteria]);

    const fetchPromotions = async (page, size) => {
        try {
            const response = await axios.get(`${API_URL}manage/promotion/get-all?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPromotions(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };

    const fetchPromotionsByName = async (page, size, name) => {
        try {
            const response = await axios.get(`${API_URL}manage/promotion/search?name=${name}&page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPromotions(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error searching promotions:', error);
        }
    };

    const handleCreateForm = async () => {
        try {
            await axios.post(`${API_URL}manage/promotion/create`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchPromotions(currentPage, pageSize);
            handleClose();
        } catch (error) {
            console.error('Error creating promotion:', error);
        }
    };

    const handleUpdateForm = async () => {
        try {
            console.log(form);
            await axios.put(`${API_URL}manage/promotion/update`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchPromotions(currentPage, pageSize);
            handleClose();
        } catch (error) {
            console.error('Error updating promotion:', error);
        }
    };

    const handleDelete = async (id) => {
        iziToast.question({
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: 'Confirm',
            message: 'Are you sure you want to delete this promotion?',
            position: 'center',
            buttons: [
                ['<button><b>YES</b></button>', async function (instance, toast) {
                    try {
                        await axios.delete(`${API_URL}manage/promotion/delete/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        fetchPromotions(currentPage, pageSize);
                        iziToast.success({
                            title: 'Success',
                            message: 'Delete promotion successfully',
                            position: 'topRight',
                            timeout: 1500,
                        });
                    } catch (error) {
                        console.error('Error deleting promotion:', error);
                    }
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true],
                ['<button>NO</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }]
            ]
        });
    };

    const handleCreate = () => {
        setForm({
            promotionId: null,
            promotionName: '',
            promotionStartDate: '',
            promotionEndDate: '',
            managerId: currentUser.userid
        });
        setOpen(true);
    };

    const handleUpdate = (promotion) => {
        setForm(promotion);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    return (
        <div>
            <h1>Promotion</h1>
            <div className="mb-5">
                <TextField
                    label="Promotion Name"
                    value={searchCriteria}
                    onChange={(e) => setSearchCriteria(e.target.value)}
                />
                <Button className={"float-end"} variant="contained" color="primary" onClick={handleCreate}>
                    Create Promotion
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Manager ID</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {promotions.map((promotion) => (
                            <TableRow key={promotion.promotionId}>
                                <TableCell>{promotion.promotionId}</TableCell>
                                <TableCell>{promotion.promotionName}</TableCell>
                                <TableCell>{new Date(promotion.promotionStartDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(promotion.promotionEndDate).toLocaleDateString()}</TableCell>
                                <TableCell>{promotion.managerId}</TableCell>
                                <TableCell>
                                    <Button
                                        className={"me-3"}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdate(promotion)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(promotion.promotionId)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="flex justify-between items-center">
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    Previous
                </Button>
                <span style={{color:'black'}}>Page {currentPage + 1} of {totalPages}</span>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    Next
                </Button>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{form.promotionId ? 'Update Promotion' : 'Create Promotion'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Promotion Name"
                        name="promotionName"
                        value={form.promotionName}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        name="promotionStartDate"
                        value={form.promotionStartDate.split('T')[0]}
                        onChange={handleFormChange}
                        fullWidth
                        InputLabelProps={{shrink: true}}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        name="promotionEndDate"
                        value={form.promotionEndDate.split('T')[0]}
                        onChange={handleFormChange}
                        fullWidth
                        InputLabelProps={{shrink: true}}
                    />
                    {/*<TextField*/}
                    {/*    label="Manager ID"*/}
                    {/*    type="number"*/}
                    {/*    name="managerId"*/}
                    {/*    value={form.managerId}*/}
                    {/*    onChange={handleFormChange}*/}
                    {/*    fullWidth*/}
                    {/*/>*/}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={form.promotionId ? handleUpdateForm : handleCreateForm}
                        color="primary"
                    >
                        {form.promotionId ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Promotion;
