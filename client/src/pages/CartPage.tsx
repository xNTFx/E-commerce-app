import { Link } from 'react-router-dom';

import CartItems from '../components/CartItems';
import LoadingPageComponent from '../components/LoadingComponents/LoadingPageComponent';
import useGetCartItems from '../hooks/useGetCartItems';
import useSumOfProductPrices from '../hooks/useSumAndCountOfProducts';

export default function CartPage() {
  const { data, isLoading, isFetching } = useGetCartItems();
  const { sumOfProductPrices, allItemCount } = useSumOfProductPrices(data);

  if (isLoading || isFetching || data === undefined) {
    return <LoadingPageComponent />;
  }

  return (
    <main className="mt-4 flex flex-col items-center justify-center overflow-hidden sm:mt-10">
      {data?.length > 0 ? (
        <>
          <section className="relative flex w-[95vw] flex-col gap-4 p-1 sm:w-[80vw]">
            <h1 className="text-3xl font-bold">Cart ({allItemCount})</h1>
            <CartItems data={data} />
          </section>
          <section className="sticky bottom-0 flex w-full flex-col items-center justify-center bg-white pb-1  pt-5">
            <div className="flex w-[80%] flex-row">
              <h2>
                {'Subtotal: '}
                <strong>
                  {sumOfProductPrices ? `$${sumOfProductPrices}` : null}
                </strong>
              </h2>
            </div>
            <Link
              to="/order-user-data-form"
              className="mb-5 flex w-[80%] items-center justify-center rounded-lg bg-green-600 p-2 text-white transition hover:bg-green-400"
            >
              Checkout
            </Link>
          </section>
        </>
      ) : (
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold">No products in cart</h1>
          <Link
            to="/"
            className="p-y-3 flex items-center justify-center rounded-lg bg-blue-600 p-1 text-white transition-transform hover:scale-110"
          >
            Back to shopping
          </Link>
        </div>
      )}
    </main>
  );
}
