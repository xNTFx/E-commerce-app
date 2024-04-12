import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import useGetCartItems from '../hooks/useGetCartItems';
import useSumOfProductPrices from '../hooks/useSumAndCountOfProducts';
import { CartItemsType, ProductType } from '../types/APITypes';
import LoadingDivComponent from './LoadingComponents/LoadingDivComponent';
import LoadingPageComponent from './LoadingComponents/LoadingPageComponent';

export default function NavbarCart() {
  const { data, isLoading, isFetching } = useGetCartItems();

  const [isOpen, setIsOpen] = useState(false);

  const { sumOfProductPrices, allItemCount } = useSumOfProductPrices(data);

  const cartItems = data?.map((item: CartItemsType) =>
    item.productDetails
      ? item.productDetails.map((productDetail: ProductType) => (
          <article
            key={productDetail._id}
            className="cursor-pointer hover:underline"
          >
            <Link to={`${productDetail._id}/${productDetail.title}`}>
              <div className="flex flex-row items-center gap-2">
                <img
                  src={productDetail.thumbnail}
                  alt={productDetail.thumbnail}
                  className="h-[4rem] w-[4rem] object-scale-down"
                />
                <div>
                  <h1 className="line-clamp-2 font-bold">
                    {productDetail.title}
                  </h1>
                  <h2 className="font-bold">
                    ${productDetail.price.toFixed(2)}
                  </h2>
                  <h3>
                    {item.count}
                    {item.count === 1 ? ' pc' : ' pcs'}
                  </h3>
                </div>
              </div>
              <hr />
            </Link>
          </article>
        ))
      : null,
  );

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        to="/cart"
        onClick={() => {
          setIsOpen(false);
        }}
        className={`relative flex h-16 flex-row items-center justify-center gap-2 rounded-t-lg border border-b-0 p-2 hover:underline ${isOpen ? 'border-gray-300' : 'border-transparent'}`}
      >
        <span className="relative">
          <FaShoppingCart className="text-3xl" />
          {allItemCount > 0 ? (
            <p className="absolute right-[-30%] top-[-50%] flex size-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
              {allItemCount > 99 ? '99+' : allItemCount}
            </p>
          ) : null}
        </span>

        <p className="hidden font-bold sm:inline">
          {sumOfProductPrices
            ? Number(sumOfProductPrices) > 999999
              ? '$99999+'
              : '$' + sumOfProductPrices
            : null}
        </p>
      </Link>
      {isOpen ? (
        <div className="absolute right-0 mr-5 max-h-[24rem] w-60 max-w-60 overflow-y-auto rounded-b-lg rounded-tl-lg border border-gray-300 bg-white p-4">
          {!data || data?.length === 0 ? (
            <h1 className="font-bold">No products in cart</h1>
          ) : (
            <div className="relative flex flex-col gap-1">
              <h1 className="flex gap-1 font-bold">
                Cart <p>{allItemCount ? `(${allItemCount})` : null}</p>
              </h1>
              {cartItems}
              <Link
                to="/cart"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="flex items-center justify-center rounded-lg bg-green-600 p-1 text-white transition-transform hover:scale-110"
              >
                Go to cart
              </Link>
              {isFetching ? <LoadingDivComponent /> : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
