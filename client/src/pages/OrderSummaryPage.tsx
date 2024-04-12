import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import LoadingPageComponent from '../components/LoadingComponents/LoadingPageComponent';
import { UserContext } from '../context/UserContext';
import useDeleteEntireCart from '../hooks/useDeleteEntireCart';
import useGetCartItems from '../hooks/useGetCartItems';
import { CartItemsType, ProductType } from '../types/APITypes';
import getIdTokenFunction from '../utils/getIdTokenFunction';

export default function OrderSummaryPage() {
  const locate = useLocation();
  const { name, surname, addres, zipCode, cityTown, phone, email } =
    locate.state;

  const { user } = useContext(UserContext);

  const { data, isLoading } = useGetCartItems();

  const { removeCartLocalstorage, deleteCart } = useDeleteEntireCart();

  function discountedPrice(price: number, discountPercentage: number) {
    return Math.round(price + (price * discountPercentage) / 100).toFixed(2);
  }

  async function deleteCartFunction() {
    if (user) {
      const userId = await getIdTokenFunction();
      deleteCart(userId);
    } else {
      removeCartLocalstorage();
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
              <div className="flex w-[95vw] flex-row gap-2">
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
                  </div>
                  <div className="flex items-end justify-between">
                    <p>
                      <span className="font-bold">{item.count}</span>{' '}
                      {item.count === 1 ? 'pc' : 'pcs'}
                    </p>
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

  if (isLoading || !data) {
    return <LoadingPageComponent />;
  }

  return (
    <main className="mt-5 flex flex-col items-center justify-center overflow-hidden">
      <div className="flex w-[95vw] flex-col gap-4 sm:w-[50vw]">
        <h1 className="text-2xl font-bold">Order Summary</h1>
        <section>
          <article>
            <div className="flex gap-1">
              <h2 className="font-bold">Full Name:</h2>
              <p className="break-all">{name + surname}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">Addres:</h2>
              <p className="break-all">{addres}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">Zip Code:</h2>
              <p className="break-all">{zipCode}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">City/Town:</h2>
              <p className="break-all">{cityTown}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">Phone Number:</h2>
              <p className="break-all">{phone}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">Email:</h2>
              <p className="break-all">{email}</p>
            </div>
          </article>
        </section>
        <Link
          to="/payment"
          onClick={deleteCartFunction}
          className="flex w-full items-center justify-center rounded-lg bg-green-500 p-1 text-white transition hover:bg-green-400"
        >
          Proceed to payment
        </Link>
        <section>{cartItems}</section>
      </div>
    </main>
  );
}
