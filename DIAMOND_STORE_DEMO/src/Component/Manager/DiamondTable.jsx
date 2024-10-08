import React, {useEffect, useState} from 'react';
import axios from "axios";
import {API_URL} from "../../Config/config";
import {Link} from "react-router-dom";
import '../../Scss/DiamondTable.scss'
import {Edit, Eye, Trash2} from "lucide-react";
import iziToast from 'izitoast';

const DiamondTable = ({ setSelectedDiamondId, setCurrentView}) => {
    const [productsPage, setProductsPage] = useState({
        content: [],
        totalPages: 0,
        pageNumber: 0,
        totalElements: 0
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const [searchCriteria, setSearchCriteria] = useState({
        cut: '',
        color: '',
        carat: '',
        clarity: ''
    });
    useEffect(() =>{
        if (searchCriteria.cut || searchCriteria.color || searchCriteria.carat || searchCriteria.clarity) {
            fetchDiamondsByCriteria(currentPage, pageSize, searchCriteria);
        } else {
            fetchDiamonds(currentPage, pageSize);
        }
        window.scrollTo(0, 0);
    }, [currentPage, pageSize, searchCriteria]);

    const fetchDiamonds = async (page, size) => {
        try {
            const response = await axios.get(`${API_URL}manage/diamond/get-all?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching diamonds:', error);
            setError('Error fetching diamonds. Please try again later.');
        }
    };

    const fetchDiamondsByCriteria = async (page, size, criteria) => {
        try {
            const { cut, carat, color, clarity } = criteria;

            // Create params object and only add non-null parameters
            const params = {};
            if (cut !== null && cut !== '') params.cut = cut;
            if (carat !== null && carat !== '') params.carat = carat;
            if (color !== null && color !== '') params.color = color;
            if (clarity !== null && clarity !== '') params.clarity = clarity;
            params.page = page;
            params.size = size;

            //console.log('Sending request with params:', params);

            const response = await axios.get(`${API_URL}manage/diamond/search-by-4c`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params
            });

            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching diamonds by criteria:', error);
            setError('Error fetching diamonds. Please try again later.');
        }
    };

    const deleteDiamond = async (id) => {
        iziToast.question({
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            title: 'Confirm',
            message: 'Are you sure you want to delete this diamond?',
            position: 'center',
            buttons: [
                ['<button><b>YES</b></button>', async function (instance, toast) {
                    try {
                        await axios.delete(`${API_URL}manage/diamond/delete/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        fetchDiamonds(currentPage, pageSize);
                        iziToast.success({
                            title: 'Success',
                            message: 'Delete diamond successfully',
                            position: 'topRight',
                            timeout: 1500,
                        });
                    } catch (error) {
                        console.error('Error deleting diamond:', error);
                        setError('Error deleting diamond. Please try again later.');
                    }
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true],
                ['<button>NO</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }]
            ]
        });
    };

    const handleDiamondSearchChange = (event) => {
        setSearchCriteria({
            ...searchCriteria,
            [event.target.name]: event.target.value
        });

    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPaginationRange = (currentPage, totalPages) => {
        const delta = 2;
        const range = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift('...');
        }

        if (currentPage + delta < totalPages - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    };

    const paginationRange = getPaginationRange(currentPage, productsPage.totalPages);

    const navigateToEditDiamond = (diamondId) => {
        setCurrentView('editDiamond');
        setSelectedDiamondId(diamondId);
    };

    const navigateToDiamondDetail = (diamondId) => {
        setCurrentView('diamondDetail');
        setSelectedDiamondId(diamondId);
    };


    return (
        <>
            <h1>Diamond Table</h1>
            <div className="search-bar">
                <label>Search Diamond:</label>
                <input
                    type="text"
                    placeholder="Cut"
                    name="cut"
                    value={searchCriteria.cut}
                    onChange={handleDiamondSearchChange}
                />
                <input
                    type="text"
                    placeholder="Color"
                    name="color"
                    value={searchCriteria.color}
                    onChange={handleDiamondSearchChange}
                />
                <input
                    type="number"
                    placeholder="Carat"
                    name="carat"
                    value={searchCriteria.carat}
                    onChange={handleDiamondSearchChange}
                />
                <input
                    type="text"
                    placeholder="Clarity"
                    name="clarity"
                    value={searchCriteria.clarity}
                    onChange={handleDiamondSearchChange}
                />
                <button onClick={() => navigateToEditDiamond(null)} className="manager-float-end">Add new
                    diamond
                </button>
            </div>
            <div className="diamond-table">
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Carat</th>
                        <th>Cut</th>
                        <th>Color</th>
                        <th>Clarity</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th style={{textAlign:'center'}}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productsPage.content.map(diamond => (
                        <tr key={diamond.diamondId}>
                            <td>{diamond.diamondId}</td>
                            <td>{diamond.carat}</td>
                            <td>{diamond.cut}</td>
                            <td>{diamond.color}</td>
                            <td>{diamond.clarity}</td>
                            <td>{diamond.price}</td>
                            <td>{diamond.status ? 'Active' : 'Inactive'}</td>
                            <td className="space-x-2" style={{textAlign:'center'}}>
                                <button
                                    onClick={() => navigateToDiamondDetail(diamond.diamondId)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                    title="View"
                                >
                                    <Eye size={20}/>
                                </button>
                                <button
                                    onClick={() => navigateToEditDiamond(diamond.diamondId)}
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={20}/>
                                </button>
                                <button
                                    onClick={() => deleteDiamond(diamond.diamondId)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                    title="Delete"
                                    disabled={!diamond.status}
                                >
                                    <Trash2 size={20}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination justify-content-end">
                            {paginationRange.map((pageNumber, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${pageNumber === currentPage + 1 ? 'active' : ''}`}
                                >
                                    <Link
                                        to="#"
                                        className="page-link"
                                        onClick={() => handlePageChange(pageNumber - 1)}
                                    >
                                        {pageNumber}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
        ;
};

export default DiamondTable;
