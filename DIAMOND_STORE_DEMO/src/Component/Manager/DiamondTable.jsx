import React from 'react';
import PropTypes from 'prop-types';

const DiamondTable = ({ diamonds, editDiamond, deleteDiamond, viewDiamondDetails }) => {
    return (
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
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {diamonds.map(diamond => (
                    <tr key={diamond.diamondId}>
                        <td>{diamond.diamondId}</td>
                        <td>{diamond.carat}</td>
                        <td>{diamond.cut}</td>
                        <td>{diamond.color}</td>
                        <td>{diamond.clarity}</td>
                        <td>{diamond.price}</td>
                        <td>{diamond.status ? 'Active' : 'Inactive'}</td>
                        <td>
                            <button onClick={() => viewDiamondDetails(diamond.diamondId)}>View</button>
                            <button onClick={() => editDiamond(diamond.diamondId)}>Edit</button>
                            <button onClick={() => deleteDiamond(diamond.diamondId)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

DiamondTable.propTypes = {
    diamonds: PropTypes.array.isRequired,
    editDiamond: PropTypes.func.isRequired,
    deleteDiamond: PropTypes.func.isRequired,
    viewDiamondDetails: PropTypes.func.isRequired,
};

export default DiamondTable;
