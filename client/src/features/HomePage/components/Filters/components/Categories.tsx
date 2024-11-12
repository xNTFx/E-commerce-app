import { useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { useQuery } from 'react-query';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { getCategories } from '../../../../../API/GetFetches';
import { CategoriesProps } from '../../../../../types/APITypes';
import useAddSearchParam from '../hooks/useAddSearchParam';

export default function Categories() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const preventReload = location?.state?.preventReload;

  const [isMoreCategories, setIsMoreCategories] = useState(
    preventReload ? preventReload : false,
  );
  const { addSearchParam, removeSearchParam } = useAddSearchParam();
  const navigate = useNavigate();

  const currentCategory = searchParams.get('category') || '';

  const handleCategoryChange = (
    category: string,
    isChecked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    let params;
    if (isChecked) {
      params = addSearchParam('category', category);
    } else {
      params = removeSearchParam('category');
    }

    navigate(`/page/1?${params.toString()}`, {
      replace: true,
      state: { preventReload: isMoreCategories },
    });
  };

  const {
    data: categories,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
  });

  if (categories === undefined || isFetching || isLoading) return;

  return (
    <>
      <div>
        {categories.slice(0, 5).map((category: CategoriesProps) => {
          const isCategorySelected = currentCategory === category.category;

          return (
            <div key={category._id.toString()} className="p-1">
              <label className="flex cursor-pointer gap-1 hover:underline">
                <input
                  id={'category-list' + category._id.toString()}
                  type="checkbox"
                  value={category.category}
                  className="cursor-pointer"
                  onChange={(e) =>
                    handleCategoryChange(category.category, e.target.checked, e)
                  }
                  checked={isCategorySelected}
                />
                {category.category}
              </label>
            </div>
          );
        })}

        <div
          className={`additional-categories ${
            isMoreCategories ? 'additional-categories-expanded' : ''
          }`}
        >
          {categories.slice(5).map((category: CategoriesProps) => {
            const isCategorySelected = currentCategory === category.category;

            return (
              <div key={category._id} className="p-1">
                <label className="flex cursor-pointer gap-1 hover:underline">
                  <input
                    id={'category-list' + category._id.toString()}
                    type="checkbox"
                    value={category.category}
                    className="cursor-pointer"
                    onChange={(e) =>
                      handleCategoryChange(
                        category.category,
                        e.target.checked,
                        e,
                      )
                    }
                    checked={isCategorySelected}
                  />
                  {category.category}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => setIsMoreCategories((prev: boolean) => !prev)}
        className="sticky bottom-0 flex w-full justify-start bg-white p-1"
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
