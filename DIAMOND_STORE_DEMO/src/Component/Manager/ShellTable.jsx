import React from 'react';
import PropTypes from 'prop-types';

const ShellTable = ({ shells, editShell, deleteShell, viewShellDetails }) => {
    return (
        <div className="shell-table">
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Weight</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {shells.map(shell => (
                    <tr key={shell.shellId}>
                        <td>{shell.shellId}</td>
                        <td>{shell.shellName}</td>
                        <td>{shell.shellPrice}</td>
                        <td>{shell.shellWeight}</td>
                        <td>
                            <button onClick={() => viewShellDetails(shell.shellId)}>View</button>
                            <button onClick={() => editShell(shell.shellId)}>Edit</button>
                            <button onClick={() => deleteShell(shell.shellId)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShellTable;
