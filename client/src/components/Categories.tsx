import { useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { useSearchParams } from 'react-router-dom';

import useAddSearchParam from '../hooks/useAddSearchParam';

export default function Categories() {
  const [searchParams] = useSearchParams();
  const [isMoreCategories, setIsMoreCategories] = useState(false);
  const { addSearchParam, removeSearchParam } = useAddSearchParam();

  const categoryList = searchParams.get('category')?.split(',');

  const categories = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
    'furniture',
    'tops',
    'womens-dresses',
    'womens-shoes',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'sunglasses',
    'automotive',
    'motorcycle',
    'lighting',
  ];
  return (
    <>
      <div>
        {categories.slice(0, 5).map((category, index) => {
          const currentCategories = searchParams.get('category')
            ? searchParams.get('category')?.split(',')
            : [];

          const isCategorySelected = categoryList
            ? categoryList?.some(
                (categoryElement) => categoryElement === category,
              )
            : false;

          const handleCategoryChange = (
            category: string,
            isChecked: boolean,
          ) => {
            if (isChecked && currentCategories) {
              if (!currentCategories.includes(category)) {
                addSearchParam(
                  'category',
                  [...currentCategories, category].join(','),
                );
              }
            } else {
              const newCategories = currentCategories?.filter(
                (c) => c !== category,
              );
              if (newCategories && newCategories.length > 0) {
                addSearchParam('category', newCategories.join(','));
              } else {
                removeSearchParam('category');
              }
            }
          };
          return (
            <div key={index} className="p-1">
              <label className="flex cursor-pointer gap-1 hover:underline">
                <input
                  id={'category-input' + 1 + index}
                  type="checkbox"
                  value={category}
                  className="cursor-pointer"
                  onChange={(e) =>
                    handleCategoryChange(category, e.target.checked)
                  }
                  checked={isCategorySelected}
                />
                {category}
              </label>
            </div>
          );
        })}

        <div
          className={`additional-categories ${isMoreCategories ? 'additional-categories-expanded' : ''}`}
        >
          {categories.slice(5).map((category, index) => (
            <div key={index} className="p-1">
              <label className="flex cursor-pointer gap-1 hover:underline">
                <input
                  id={'category-input' + 2 + index}
                  type="checkbox"
                  value={category}
                  className="cursor-pointer"
                />
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => setIsMoreCategories((prev) => !prev)}
        className="flex justify-start"
      >
        {isMoreCategories ? (
          <p className="flex items-center gap-1 font-bold hover:underline">
            <MdExpandLess />
            Hide
          </p>
        ) : (
          <p className="flex items-center gap-1 font-bold hover:underline">
            <MdExpandMore />
            Show More
          </p>
        )}
      </button>
    </>
  );
}
