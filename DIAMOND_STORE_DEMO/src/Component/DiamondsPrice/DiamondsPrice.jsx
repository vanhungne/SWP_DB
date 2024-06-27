import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DiamondPrice.scss';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Slider,
    Select,
    MenuItem,
    Card,
    CardContent,
    Button,
    Tabs,
    Tab,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { API_URL } from "../../Config/config";

const DiamondSearch = () => {
    const [diamonds, setDiamonds] = useState([]);
    const [searchParams, setSearchParams] = useState({
        cut: '',
        minCarat: 0,
        maxCarat: 10,
        color: '',
        clarity: '',
        minPrice: '',
        maxPrice: '',
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [categoryValue, setCategoryValue] = useState('');

    const cutOptions = ["Oval", "Heart", "Round"];
    const clarityOptions = ["VS1", "VS2", "VVS1", "VVS2"];
    const colorOptions = ["D", "E", "G", "J"];

    const fetchDiamonds = async (endpoint, params = {}) => {
        try {
            const response = await axios.get(`${API_URL}manage/diamond-price/${endpoint}`, {
                params: {
                    ...params,
                    page: currentPage,
                    size: pageSize
                }
            });
            setDiamonds(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching diamonds:', error);
        }
    };

    useEffect(() => {
        if (activeTab === 0) {
            fetchDiamonds('search', searchParams);
        } else {
            const endpoints = ['get-all-cut', 'get-all-color', 'get-all-clarity'];
            const params = { [['cut', 'color', 'clarity'][activeTab - 1]]: categoryValue };
            fetchDiamonds(endpoints[activeTab - 1], params);
        }
    }, [currentPage, pageSize, searchParams, activeTab, categoryValue]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleCaratChange = (event, newValue) => {
        setSearchParams(prev => ({
            ...prev,
            minCarat: newValue[0],
            maxCarat: newValue[1]
        }));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setCurrentPage(0);
        setCategoryValue('');
    };

    return (
        <div className="diamond-search">
            <Tabs value={activeTab} onChange={handleTabChange} className="mb-4">
                <Tab label="Search" />
                <Tab label="By Cut" />
                <Tab label="By Color" />
                <Tab label="By Clarity" />
            </Tabs>

            {activeTab === 0 ? (
                <Card className="mb-4 p-4">
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4" style={{ display: 'flex', gap: '15px' }}>
                            <Select
                                name="cut"
                                label="Cut"
                                value={searchParams.cut}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Cut</em>
                                </MenuItem>
                                {cutOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                            <Select
                                name="color"
                                label="Color"
                                value={searchParams.color}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Color</em>
                                </MenuItem>
                                {colorOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                            <Select
                                name="clarity"
                                label="Clarity"
                                value={searchParams.clarity}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Clarity</em>
                                </MenuItem>
                                {clarityOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                name="minPrice"
                                label="Min Price"
                                type="number"
                                value={searchParams.minPrice}
                                onChange={handleInputChange}
                            />
                            <TextField
                                name="maxPrice"
                                label="Max Price"
                                type="number"
                                value={searchParams.maxPrice}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Carat Range:</label>
                            <Slider
                                min={0}
                                max={10}
                                step={0.1}
                                value={[searchParams.minCarat, searchParams.maxCarat]}
                                onChange={handleCaratChange}
                                valueLabelDisplay="auto"
                            />
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setCurrentPage(0)}
                            startIcon={<SearchIcon />}
                        >
                            Search
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="mb-4 p-4">
                    <CardContent>
                        {activeTab === 1 ? (
                            <Select
                                value={categoryValue}
                                onChange={(e) => setCategoryValue(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select Cut</em>
                                </MenuItem>
                                {cutOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        ) : activeTab === 2 ? (
                            <Select
                                value={categoryValue}
                                onChange={(e) => setCategoryValue(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select Color</em>
                                </MenuItem>
                                {colorOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <Select
                                value={categoryValue}
                                onChange={(e) => setCategoryValue(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select Clarity</em>
                                </MenuItem>
                                {clarityOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setCurrentPage(0)}
                            startIcon={<SearchIcon />}
                        >
                            Get Diamonds
                        </Button>
                    </CardContent>
                </Card>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Cut</TableCell>
                            <TableCell>Carat</TableCell>
                            <TableCell>Color</TableCell>
                            <TableCell>Clarity</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {diamonds.map((diamond) => (
                            <TableRow key={diamond.diamondId}>
                                <TableCell>{diamond.cut}</TableCell>
                                <TableCell>{diamond.carat}</TableCell>
                                <TableCell>{diamond.color}</TableCell>
                                <TableCell>{diamond.clarity}</TableCell>
                                <TableCell>${diamond.price.toFixed(2)}</TableCell>
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
        </div>
    );
};

export default DiamondSearch;