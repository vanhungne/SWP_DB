import React from 'react';

const SidebarP = ({ categories, selectedCategory, onCategoryChange, onCollectionChange }) => {
    return (
        <div className="sidebarP bg-white rounded-3 shadow-sm p-4">
            <h3 className="mb-3 text-center">Category</h3>
            <ul className="list-group">
                {categories.map((category) => (
                    <li
                        key={category.categoryId}
                        className={`list-group-item list-group-item-action ${selectedCategory === category.categoryName ? 'active' : ''}`}
                        onClick={() => onCategoryChange(category.categoryName)}
                    >
                        {category.categoryName}
                    </li>
                ))}
            </ul>

            <h3 className="mb-3 mt-4">Collections</h3>
            <select className="form-select mb-3" onChange={(e) => onCollectionChange(e.target.value)}>
                <option value="">All Collections</option>
                {/* Add more collection options as needed */}
            </select>
        </div>
    );
};

export default SidebarP;