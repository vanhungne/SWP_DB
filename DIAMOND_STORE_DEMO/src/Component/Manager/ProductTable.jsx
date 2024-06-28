import React from 'react';

const ProductTable = ({ products, editProduct, deleteProduct, viewProductDetails }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock Quantity</th>
                <th>Collection</th>
                <th>Category ID</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product, index) => (
                <tr key={product.productId}>
                    <td>{product.productId}</td>
                    <td>{product.productName}</td>
                    <td>${product.price}</td>
                    <td>{product.stockQuantity}</td>
                    <td>{product.collection}</td>
                    <td>{product.categoryId}</td>
                    <td>
                        <button onClick={() => editProduct(product.productId)}>Edit</button>
                        <button onClick={() => deleteProduct(product.productId)}>Delete</button>
                        <button onClick={() => viewProductDetails(product.productId)}>View</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ProductTable;
