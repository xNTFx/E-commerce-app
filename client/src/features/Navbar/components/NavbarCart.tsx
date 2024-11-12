import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import CartItems from '../../../components/CartItems';
import LoadingDivComponent from '../../../components/LoadingComponents/LoadingDivComponent';
import useGetCartItems from '../../../hooks/useGetCartItems';
import useSumOfProductPrices from '../../../hooks/useSumAndCountOfProducts';

export default function NavbarCart() {
  const { data, isLoading, isFetching } = useGetCartItems();

  const [isOpen, setIsOpen] = useState(false);

  const { sumOfProductPrices, allItemCount } = useSumOfProductPrices(data);

  if (isLoading || isFetching) {
    return <LoadingDivComponent />;
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
        <div className="absolute right-0 mr-5 max-h-[24rem] w-[20rem] overflow-y-auto rounded-b-lg rounded-tl-lg border border-gray-300 bg-white p-4 pb-0">
          {!data || data?.length === 0 ? (
            <h1 className="pb-4 font-bold">No products in cart</h1>
          ) : (
            <div className="relative flex flex-col gap-1">
              <h1 className="flex gap-1 font-bold">
                Cart <p>{allItemCount ? `(${allItemCount})` : null}</p>
              </h1>
              <CartItems
                data={data}
                isDeleteButtonOrCountSelectVisible={false}
              />
              <div className="sticky bottom-0 bg-white pb-4">
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
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
