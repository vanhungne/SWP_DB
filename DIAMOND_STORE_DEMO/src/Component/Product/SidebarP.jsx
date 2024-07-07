import React from 'react';
import './SidebarP.scss';

const SidebarP = ({ categories, selectedCategory, onCategoryChange, onCollectionChange }) => {
    return (
        <div className="sidebarP__container">
            <div className="sidebarP__category-wrapper">
                <h3 className="sidebarP__title">Categories</h3>
                <ul className="sidebarP__category-list">
                    {categories.map((category) => (
                        <li
                            key={category.categoryId}
                            className={`sidebarP__category-item ${selectedCategory === category.categoryName ? 'sidebarP__category-item--active' : ''}`}
                            onClick={() => onCategoryChange(category.categoryName)}
                        >
                            {category.categoryName}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="sidebarP__collection-wrapper">
                <h3 className="sidebarP__title">Collections</h3>
                <div className="sidebarP__collection-select">
                    <select
                        onChange={(e) => onCollectionChange(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>Select a collection</option>
                        <option value="Esther Lock">Esther Collection</option>
                        <option value="esther vip">VIP Collection</option>
                        <option value="luckyfull">Lucky Collection</option>
                        <option value="esther diamonds">Esther diamonds lucky</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SidebarP;