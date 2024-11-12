import { PaginationItem } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { fetchProducts } from '../API/GetFetches';
import { InfoBox } from '../components/InfoBox';
import LoadingDivComponent from '../components/LoadingComponents/LoadingDivComponent';
import Filters from '../features/HomePage/components/Filters/Filters';
import ProductList from '../features/HomePage/components/ProductList';

export default function HomePage() {
  const { page } = useParams();
  const pageItemsCount = 12;

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [searchParams] = useSearchParams();

  const categoryList = searchParams.get('category')?.split(',') || [];
  const sortBy = searchParams.get('sortBy') || '';
  const price =
    searchParams
      .get('price')
      ?.split(',')
      ?.map((element) => Number(element)) || [];

  const queryProps = {
    page: Number(page),
    price,
    sortBy,
    categoryList,
    pageItemsCount,
  };

  const { data, isLoading, error, isFetching } = useQuery(
    ['products', queryProps],
    () => fetchProducts(queryProps),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  if (error) {
    console.error(error);
  }

  return (
    <main className="my-10 flex flex-col items-center justify-center overflow-hidden md:flex-row md:items-start">
      {isLoading || isFetching ? <LoadingDivComponent /> : null}
      <h1 className="hidden">Home Page</h1>
      <aside className="hidden md:inline">
        <Filters />
      </aside>
      <div>
        <div className="mb-5">
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="rounded-lg bg-black p-4 font-bold text-white transition-transform hover:scale-110 md:hidden"
          >
            Show Filters
          </button>
        </div>
        {isFiltersOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-5">
            <InfoBox onClickOutside={() => setIsFiltersOpen((prev) => !prev)}>
              <div
                id="mobile-filter"
                className="flex flex-col items-center justify-center rounded-lg bg-white p-5 shadow md:h-full md:w-auto"
              >
                <Filters />
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="mt-4 rounded bg-red-500 px-4 py-2 font-bold text-white transition hover:scale-110"
                >
                  Close Filters
                </button>
              </div>
            </InfoBox>
          </div>
        )}
      </div>
      <section className="flex w-[90vw] flex-col items-center justify-between sm:w-auto">
        {data?.productList?.length === 0 && data !== undefined && !isLoading ? (
          <div className="flex items-center justify-center sm:w-[29rem] lg:w-[44.5rem]">
            <p className="text-2xl font-bold">No items to display</p>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 items-start justify-start gap-5 sm:w-[30rem] sm:grid-cols-2 lg:w-[45rem] lg:grid-cols-3">
            <ProductList data={data} />
          </div>
        )}
        <div className="mt-5 flex w-screen flex-row items-center justify-center sm:w-full">
          {data?.totalCount > 12 ? (
            <Pagination
              count={Math.ceil(data?.totalCount / 12)}
              page={Number(page)}
              onChange={() => {
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'smooth',
                });
              }}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`/page/${item.page}`}
                  {...item}
                />
              )}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
