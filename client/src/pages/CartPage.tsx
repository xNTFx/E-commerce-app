import { useContext } from 'react';
import { IoTrashBinSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import LoadingDivComponent from '../components/LoadingComponents/LoadingDivComponent';
import LoadingPageComponent from '../components/LoadingComponents/LoadingPageComponent';
import QuantitySelectWithUpdate from '../components/QuantitySelectWithUpdate';
import { UserContext } from '../context/UserContext';
import useDeleteCartItem from '../hooks/useDeleteCartItem';
import useGetCartItems from '../hooks/useGetCartItems';
import useSumOfProductPrices from '../hooks/useSumAndCountOfProducts';
import { CartItemsType, ProductType } from '../types/APITypes';
import getIdTokenFunction from '../utils/getIdTokenFunction';

export default function CartPage() {
  const { data, isLoading, isFetching } = useGetCartItems();
  const { sumOfProductPrices, allItemCount } = useSumOfProductPrices(data);
  const { removeProductApi, removeProductLocalstorage } = useDeleteCartItem();

  const { user } = useContext(UserContext);

  function discountedPrice(price: number, discountPercentage: number) {
    return Math.round(price + (price * discountPercentage) / 100).toFixed(2);
  }

  async function handleRemoveProduct(
    cartId: string | undefined,
    productId: string,
  ) {
    if (user) {
      const idToken = await getIdTokenFunction();
      removeProductApi({
        userId: idToken,
        cartId: cartId,
      });
    } else {
      removeProductLocalstorage({
        productId: productId,
      });
    }
  }

  const cartItems = data?.map((item: CartItemsType) =>
    item.productDetails
      ? item.productDetails.map((productDetail: ProductType) => (
          <article
            key={productDetail._id}
            className="flex w-full flex-col gap-5"
          >
            <div className="flex w-full justify-between gap-2">
              <div className="flex w-full flex-row gap-2">
                <section>
                  <Link to={`/${productDetail._id}/${productDetail.title}`}>
                    <img
                      src={productDetail.thumbnail}
                      className="h-[6rem] w-[6rem] min-w-[6rem] max-w-[6rem] cursor-pointer object-scale-down sm:w-[8rem] sm:min-w-[8rem] sm:max-w-[8rem]"
                      alt={productDetail.thumbnail}
                    />
                  </Link>
                </section>
                <section className="flex w-full flex-col justify-between">
                  <div className="flex justify-between">
                    <h2 className="max-w line-clamp-2 max-w-[50vw] cursor-pointer overflow-hidden font-bold hover:underline">
                      <Link to={`/${productDetail._id}/${productDetail.title}`}>
                        {productDetail.title.slice(0, 1).toUpperCase() +
                          productDetail.title.slice(1)}
                      </Link>
                    </h2>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveProduct(item._id, item.productId);
                      }}
                      className="rounded-lg p-1 hover:bg-gray-300"
                    >
                      <IoTrashBinSharp className="text-xl" />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <QuantitySelectWithUpdate
                      productQuantity={item.count}
                      cartId={item._id}
                      productId={item.productId}
                    />
                    <div className="flex flex-row items-center justify-center gap-2">
                      <div className="flex flex-col">
                        {discountedPrice ? (
                          <p>
                            <s>
                              $
                              {discountedPrice(
                                productDetail.price,
                                productDetail.discountPercentage,
                              )}
                            </s>
                          </p>
                        ) : null}
                        <p className="font-bold">
                          ${productDetail.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <hr />
          </article>
        ))
      : null,
  );

  if (isLoading) {
    return <LoadingPageComponent />;
  }

  return (
    <main className="mt-4 flex flex-col items-center justify-center overflow-hidden sm:mt-10">
      {data?.length > 0 ? (
        <>
          <section className="relative flex w-[95vw] flex-col gap-4 p-1 sm:w-[80vw]">
            <h1 className="text-3xl font-bold">Cart ({allItemCount})</h1>
            {cartItems}
            {isFetching ? <LoadingDivComponent /> : null}
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
              to="/order"
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
            className="flex items-center justify-center rounded-lg bg-blue-600 p-3 text-white transition-transform hover:scale-110"
          >
            Back to shopping
          </Link>
        </div>
      )}
    </main>
  );
}
