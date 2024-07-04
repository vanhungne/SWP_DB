import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    DialogTitle,
    Select,
    MenuItem
} from '@material-ui/core';
import { API_URL } from "../../Config/config";
import {color} from "framer-motion";

const DiscountCode = () => {
    const [discountCodes, setDiscountCodes] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [form, setForm] = useState({
        codeId: null,
        code: '',
        discountPercentTage: 0,
        codeQuantity: 0,
        promotionID: ''
    });
    const [open, setOpen] = useState(false);
    const [searchPromotionId, setSearchPromotionId] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPromotions();
        fetchDiscountCodes(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const fetchDiscountCodes = async (page, size) => {
        try {
            const response = await axios.get(`${API_URL}manage/discountcode/get-all?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDiscountCodes(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching discount codes:', error);
        }
    };

    const fetchDiscountCodesByPromotionId = async () => {
        try {
            const response = await axios.get(`${API_URL}manage/discountcode/search-by-promotion/${searchPromotionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDiscountCodes(response.data.data);
        } catch (error) {
            console.error('Error searching discount codes:', error);
        }
    };

    const fetchPromotions = async () => {
        try {
            const response = await axios.get(`${API_URL}manage/promotion/get-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPromotions(response.data);
        } catch (error) {
            console.error('Error fetching promotions:', error);
        }
    };

    const handleCreateForm = async () => {
        try {
            await axios.post(`${API_URL}manage/discountcode/create`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchDiscountCodes(currentPage, pageSize);
            handleClose();
        } catch (error) {
            console.error('Error creating discount code:', error);
        }
    };

    const handleUpdateForm = async () => {
        try {
            console.log(form);
            await axios.put(`${API_URL}manage/discountcode/update`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchDiscountCodes(currentPage, pageSize);
            handleClose();
        } catch (error) {
            console.error('Error updating discount code:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}manage/discountcode/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchDiscountCodes(currentPage, pageSize);
        } catch (error) {
            console.error('Error deleting discount code:', error);
        }
    };

    const handleCreate = () => {
        setForm({
            codeId: null,
            code: '',
            discountPercentTage: 0,
            codeQuantity: 0,
            promotionID: ''
        });
        setOpen(true);
    };

    const handleUpdate = (discountCode) => {
        setForm(discountCode);
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
        <div className="discount-code-container">
            <div className="mb-5">
                <Select
                    value={searchPromotionId}
                    onChange={(e) => setSearchPromotionId(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {promotions.map((promotion) => (
                        <MenuItem key={promotion.promotionId} value={promotion.promotionId}>
                            {promotion.promotionName}
                        </MenuItem>
                    ))}
                </Select>
                <Button variant="contained" color="primary" onClick={fetchDiscountCodesByPromotionId}>
                    Search
                </Button>
                <Button className="float-end" variant="contained" color="primary" onClick={handleCreate}>
                    Create Discount Code
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Discount Percentage</TableCell>
                            <TableCell>Code Quantity</TableCell>
                            <TableCell>Promotion ID</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {discountCodes.map((discountCode) => (
                            <TableRow key={discountCode.codeId}>
                                <TableCell>{discountCode.codeId}</TableCell>
                                <TableCell>{discountCode.code}</TableCell>
                                <TableCell>{discountCode.discountPercentTage}</TableCell>
                                <TableCell>{discountCode.codeQuantity}</TableCell>
                                <TableCell>{discountCode.promotionID}</TableCell>
                                <TableCell>
                                    <Button
                                        className="me-3"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdate(discountCode)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(discountCode.codeId)}
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
                <DialogTitle>{form.codeId ? 'Update Discount Code' : 'Create Discount Code'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Code"
                        name="code"
                        value={form.code}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        label="Discount Percentage"
                        type="number"
                        name="discountPercentTage"
                        value={form.discountPercentTage}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        label="Code Quantity"
                        type="number"
                        name="codeQuantity"
                        value={form.codeQuantity}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <Select
                        label="Promotion ID"
                        name="promotionID"
                        value={form.promotionID}
                        onChange={handleFormChange}
                        fullWidth
                    >
                        {promotions.map((promotion) => (
                            <MenuItem key={promotion.promotionId} value={promotion.promotionId}>
                                {promotion.promotionName}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={form.codeId ? handleUpdateForm : handleCreateForm}
                        color="primary"
                    >
                        {form.codeId ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DiscountCode;
