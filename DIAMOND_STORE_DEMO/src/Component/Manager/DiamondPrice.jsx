import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DiamondPirce.scss';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@material-ui/core';
import { API_URL } from "../../Config/config";

const DiamondPrice = () => {
    const [diamonds, setDiamonds] = useState([]);
    const [form, setForm] = useState({
        diamondId:'',
        cut: '',
        carat: 0,
        color: '',
        clarity: '',
        price: 0
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(false);

    const [searchCriteria, setSearchCriteria] = useState({
        cut: '',
        color: '',
        carat: '',
        clarity: ''
    });

    useEffect(() => {
        if (searchCriteria.cut || searchCriteria.color || searchCriteria.carat || searchCriteria.clarity) {
            fetchDiamondPricesByCriteria(currentPage, pageSize, searchCriteria);
        } else {
            fetchDiamondPrices(currentPage, pageSize);
        }
    }, [currentPage, pageSize, searchCriteria]);

    const fetchDiamondPrices = async (page, size) => {
        try {
            const response = await axios.get(`${API_URL}manage/diamond-price/get-all?page=${page}&size=${size}`);
            setDiamonds(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching diamond prices:', error);
            setError('Error fetching diamond prices. Please try again later.');
        }
    };

    const fetchDiamondPricesByCriteria = async (page, size, criteria) => {
        try {
            const { cut, carat, color, clarity } = criteria;

            // Create params object and only add non-null parameters
            const params = {};
            if (cut !== null && cut !== '') params.cut = cut.trim();
            if (carat !== null && carat !== '') params.carat = carat.trim();
            if (color !== null && color !== '') params.color = color.trim();
            if (clarity !== null && clarity !== '') params.clarity = clarity.trim();
            params.page = page;
            params.size = size;

            const response = await axios.get(`${API_URL}manage/diamond-price/search-by-4C`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params
            });

            setDiamonds(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching diamonds by criteria:', error);
            setError('Error fetching diamonds. Please try again later.');
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSearchCriteria({
            ...searchCriteria,
            [name]: value
        });
    };

    const handleCreate = async () => {
        setForm({
            diamondId:'',
            cut: '',
            carat: 0,
            color: '',
            clarity: '',
            price: 0
        })
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleFormSubmit = async () => {
        try {
            await axios.post(`${API_URL}manage/diamond-price/create`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchDiamondPrices(currentPage, pageSize);
            handleDialogClose();
        } catch (error) {
            console.error('Error creating diamond price:', error);
            setError('Error creating diamond price. Please try again later.');
        }
    };

    const handleUpdate = async (diamond) => {
        setForm(diamond);
        setOpen(true);
    };

    const handleUpdateSubmit = async () => {
        try {
            await axios.put(`${API_URL}manage/diamond-price/update`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchDiamondPrices(currentPage, pageSize);
            handleDialogClose();
            setForm({
                diamondId:'',
                cut: '',
                carat: 0,
                color: '',
                clarity: '',
                price: 0
            })
        } catch (error) {
            console.error('Error updating diamond price:', error);
            setError('Error updating diamond price. Please try again later.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}manage/diamond-price/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchDiamondPrices(currentPage, pageSize);
        } catch (error) {
            console.error('Error deleting diamond price:', error);
            setError('Error deleting diamond price. Please try again later.');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="diamond-price">
            <Card className="mb-4 p-4">
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'flex', gap: '15px' }}>
                        <TextField
                            name="cut"
                            label="Cut"
                            onChange={handleChange}
                            value={searchCriteria.cut}
                        />
                        <TextField
                            name="carat"
                            label="Carat"
                            type="number"
                            value={searchCriteria.carat}
                            onChange={handleChange}
                        />
                        <TextField
                            name="color"
                            label="Color"
                            value={searchCriteria.color}
                            onChange={handleChange}
                        />
                        <TextField
                            name="clarity"
                            label="Clarity"
                            value={searchCriteria.clarity}
                            onChange={handleChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreate}
                        >
                            Create
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Cut</TableCell>
                            <TableCell>Carat</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Clarity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell style={{textAlign:'center'}}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {diamonds.map((diamond) => (
                            <TableRow key={diamond.diamondId}>
                                <TableCell>{diamond.diamondId}</TableCell>
                                <TableCell>{diamond.cut}</TableCell>
                                <TableCell>{diamond.carat}</TableCell>
                                <TableCell>{diamond.color}</TableCell>
                                <TableCell>{diamond.clarity}</TableCell>
                                <TableCell>${diamond.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <div className="action-butt" style={{textAlign:'center'}}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleUpdate(diamond)}
                                        >
                                            Update Price
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="default"
                                            onClick={() => handleDelete(diamond.diamondId)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="mt-4 flex justify-between items-center">
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    Previous
                </Button>
                <span>Page {currentPage + 1} of {totalPages}</span>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                >
                    Next
                </Button>
            </div>

            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>{form.diamondId ? 'Update Diamond Price' : 'Create New Diamond'}</DialogTitle>
                <DialogContent>
                    {form.diamondId ? (
                        <>
                            <TextField
                                name="price"
                                label="Price"
                                type="number"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                fullWidth
                            />
                            <DialogActions>
                                <Button onClick={handleDialogClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdateSubmit} color="primary">
                                    Update
                                </Button>
                            </DialogActions>
                        </>
                    ) : (
                        <>
                            <TextField
                                name="cut"
                                label="Cut"
                                onChange={handleFormChange}
                                value={form.cut}
                                fullWidth
                            />
                            <TextField
                                name="carat"
                                label="Carat"
                                type="number"
                                onChange={handleFormChange}
                                value={form.carat}
                                fullWidth
                            />
                            <TextField
                                name="color"
                                label="Color"
                                onChange={handleFormChange}
                                value={form.color}
                                fullWidth
                            />
                            <TextField
                                name="clarity"
                                label="Clarity"
                                onChange={handleFormChange}
                                value={form.clarity}
                                fullWidth
                            />
                            <TextField
                                name="price"
                                label="Price"
                                type="number"
                                onChange={handleFormChange}
                                value={form.price}
                                fullWidth
                            />
                            <DialogActions>
                                <Button onClick={handleDialogClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleFormSubmit} color="primary">
                                    Create
                                </Button>
                            </DialogActions>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DiamondPrice;
