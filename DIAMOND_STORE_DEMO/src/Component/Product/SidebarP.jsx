import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 100%;
  max-width: 360px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

const CategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CategoryItem = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 4px;
  background-color: ${props => props.active ? '#2196f3' : 'transparent'};
  color: ${props => props.active ? 'white' : 'inherit'};

  &:hover {
    background-color: ${props => props.active ? '#1976d2' : '#e0e0e0'};
  }
`;

const CollectionWrapper = styled.div`
  margin-top: 20px;
`;

const CollectionSelect = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 1rem;
`;

const SidebarP = ({ categories, selectedCategory, onCategoryChange, onCollectionChange }) => {
    return (
        <SidebarContainer>
            <div>
                <Title>Categories</Title>
                <CategoryList>
                    {categories.map((category) => (
                        <CategoryItem
                            key={category.categoryId}
                            active={selectedCategory === category.categoryName}
                            onClick={() => onCategoryChange(category.categoryName)}
                        >
                            {category.categoryName}
                        </CategoryItem>
                    ))}
                </CategoryList>
            </div>

            <CollectionWrapper>
                <Title>Collections</Title>
                <CollectionSelect
                    onChange={(e) => onCollectionChange(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>Select a collection</option>
                    <option value="Esther Lock">Esther Collection</option>
                    <option value="esther vip">VIP Collection</option>
                    <option value="luckyfull">Lucky Collection</option>
                    <option value="esther diamonds">Esther diamonds lucky</option>
                </CollectionSelect>
            </CollectionWrapper>
        </SidebarContainer>
    );
};

export default SidebarP;