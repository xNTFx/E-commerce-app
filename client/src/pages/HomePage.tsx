import { PaginationItem, Rating } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import { QueryFunctionContext, useQuery } from 'react-query';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import Filters from '../components/Filters';
import { InfoBox } from '../components/InfoBox';
import LoadingDivComponent from '../components/LoadingComponents/LoadingDivComponent';
import { ProductType } from '../types/APITypes';

export default function HomePage() {
  const { page } = useParams();
  const pageItemsCount = 12;

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [searchParams] = useSearchParams();

  const categoryList = searchParams.get('category')?.split(',');
  const sortBy = searchParams.get('sortBy');
  const price = searchParams
    .get('price')
    ?.split(',')
    ?.map((element) => Number(element));

  async function fetchProducts(
    context: QueryFunctionContext<
      [
        string,
        {
          page: number;
          price?: number[];
          sortBy?: string | null;
          categoryList?: string[];
        },
      ]
    >,
  ) {
    const [, { page, price, sortBy, categoryList }] = context.queryKey;

    let baseURL = `https://shopping-page-server-9drtghyc7-ntfvs-projects.vercel.app/products?limit=${pageItemsCount}&offset=${page * 12 - 12}&sortBy=${sortBy}`;
    if (price && price[0] != null) {
      baseURL += `&minPrice=${price[0]}`;
    }
    if (price && price[1] != null) {
      baseURL += `&maxPrice=${price[1]}`;
    }
    if (categoryList) {
      baseURL += `&categoryList=${categoryList}`;
    }
    const response = await fetch(baseURL);
    const { data: productList, totalCount } = await response.json();
    return { productList, totalCount };
  }
  const { data, isLoading, error, isFetching } = useQuery(
    [
      'products',
      {
        page: Number(page),
        price: price,
        sortBy: sortBy,
        categoryList: categoryList,
      },
    ],
    fetchProducts,
    {
      keepPreviousData: true,
    },
  );

  const mapProducts = data?.productList?.map((product: ProductType) => {
    const discountedPrice = Math.round(
      product.price + (product.price * product.discountPercentage) / 100,
    ).toFixed(2);
    return (
      <article key={product._id} className="flex h-full flex-col p-3">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <section className="w-[80vw] cursor-pointer overflow-hidden shadow sm:size-56">
            <Link to={`/${product._id}/${product.title}`}>
              <img
                className="w-[90vw] object-scale-down transition-transform hover:scale-110 sm:size-56"
                src={product.thumbnail}
                alt={product.thumbnail}
              />
            </Link>
          </section>
          <section className="item-start flex w-full flex-row justify-start gap-2">
            <Rating readOnly precision={0.5} value={product.rating} />
            <p className="flex font-bold">{product.rating}</p>
          </section>
          <h2 className="line-clamp-2 w-full font-bold sm:max-w-[14rem]">
            {product.title.slice(0, 1).toUpperCase() + product.title.slice(1)}
          </h2>
        </div>
        <section className="flex w-full flex-col items-start justify-start">
          <div className="flex flex-row gap-2">
            {discountedPrice ? (
              <>
                <p>
                  <s>${discountedPrice}</s>
                </p>
                <p className="rounded-lg bg-green-200 px-1 font-bold text-green-800">
                  -{Math.round(product.discountPercentage)}%
                </p>
              </>
            ) : null}
          </div>
          <p className="font-bold">${product.price.toFixed(2)}</p>
        </section>
      </article>
    );
  });

  if (!data) return;
  if (error) {
    alert(error);
  }

  return (
    <main className="my-10 flex flex-col items-center justify-center overflow-hidden md:flex-row md:items-start">
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
                className="flex max-h-[100vh] flex-col items-center justify-center rounded-lg bg-white p-5 shadow"
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
      <section className="flex w-[90vw] sm:w-auto flex-col items-center justify-between">
        {data?.productList?.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center sm:w-[29rem] lg:w-[44.5rem]">
            <p className="text-2xl font-bold">No items to display</p>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 items-start justify-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mapProducts}
            {isFetching ? <LoadingDivComponent /> : null}
          </div>
        )}
        <div className="mt-5">
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
                  to={`/${item.page}`}
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
