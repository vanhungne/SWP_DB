import React, {useEffect, useState} from 'react';
import axios from "axios";
import {API_URL} from "../../Config/config";
import {Link} from "react-router-dom";
import {Edit, Eye, Trash2} from "lucide-react";
import iziToast from 'izitoast';

const ShellTable = ({ setSelectedShellId, setCurrentView }) => {
    const [productsPage, setProductsPage] = useState({
        content: [],
        totalPages: 0,
        pageNumber: 0,
        totalElements: 0
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [error, setError] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (searchKeyword) {
            fetchShellsByKeyword(currentPage, pageSize, searchKeyword);
        } else {
            fetchShells(currentPage, pageSize);
        }
        window.scrollTo(0, 0);
    }, [currentPage, pageSize, searchKeyword]);

    const fetchShells = async (page, size) => {
        try {
            const response = await axios.get(`${API_URL}manage/shell/get-all?page=${page}&size=${size}`);
            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching shells:', error);
            setError('Error fetching shells. Please try again later.');
        }
    };

    const fetchShellsByKeyword = async (page, size, keyword) => {
        try {
            const response = await axios.get(`${API_URL}manage/shell/search-by-name?name=${keyword}&page=${page}&size=${size}`);
            setProductsPage(response.data);
        } catch (error) {
            console.error('Error fetching shells:', error);
            setError('Error fetching shells. Please try again later.');
        }
    };

    const deleteShell = async (id) => {
        iziToast.question({
            timeout: 20000,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: 'Confirm',
            message: 'Are you sure you want to delete this shell?',
            position: 'center',
            buttons: [
                ['<button><b>YES</b></button>', async function (instance, toast) {
                    try {
                        await axios.delete(`${API_URL}manage/shell/delete/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        fetchShells(currentPage, pageSize);
                        iziToast.success({
                            title: 'Success',
                            message: 'Delete shell successfully',
                            position: 'topRight',
                            timeout: 1500,
                        });
                    } catch (error) {
                        console.error('Error deleting shell:', error);
                        setError('Error deleting shell. Please try again later.');
                    }
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }, true],
                ['<button>NO</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                }]
            ]
        });
    };

    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
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

    const navigateToEditShell = (shellId) => {
        setCurrentView('editShell');
        setSelectedShellId(shellId);
    };

    const navigateToShellDetail = (shellId) => {
        setCurrentView('shellDetail');
        setSelectedShellId(shellId);
    };

    return (
        <>
            <h1>Shell tables</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchKeyword}
                    onChange={handleSearchChange}
                />
                <button onClick={() => navigateToEditShell(null)} className="manager-float-end">Add new shell
                </button>
            </div>
            <div className="shell-table">
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th style={{textAlign:'center'}}>Name</th>
                        <th>Price</th>
                        <th style={{textAlign:'center'}}>Weight</th>
                        <th style={{textAlign:'center'}}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productsPage.content.map(shell => (
                        <tr key={shell.shellId}>
                            <td>{shell.shellId}</td>
                            <td>{shell.shellName}</td>
                            <td >{shell.shellPrice}</td>
                            <td style={{textAlign:'center'}}>{shell.shellWeight}</td>
                            <td className="space-x-2" style={{textAlign:'center'}}>
                                <button
                                    onClick={() => navigateToShellDetail(shell.shellId)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                    title="View"
                                >
                                    <Eye size={20}/>
                                </button>
                                <button
                                    onClick={() => navigateToEditShell(shell.shellId)}
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={20}/>
                                </button>
                                <button
                                    onClick={() => deleteShell(shell.shellId)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                    title="Delete"
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

    );
};

export default ShellTable;
