import { useContext } from 'react';
import { IoTrashBinSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import { UserContext } from '../context/UserContext';
import QuantitySelectWithUpdate from '../features/CartPage/components/QuantitySelectWithUpdate';
import useDeleteCartItem from '../features/CartPage/hooks/useDeleteCartItem';
import { CartItemsType, ProductType } from '../types/APITypes';
import getIdTokenFunction from '../utils/getIdTokenFunction';

interface CartItemsProps {
  data: CartItemsType[];
  isDeleteButtonOrCountSelectVisible?: boolean;
}

export default function CartItems({
  data,
  isDeleteButtonOrCountSelectVisible = true,
}: CartItemsProps) {
  const { removeProductApi, removeProductLocalStorage } = useDeleteCartItem();

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
      removeProductLocalStorage({
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
              <div className="flex w-full flex-row gap-2 p-1">
                <section>
                  <Link to={`/${productDetail._id}/${productDetail.title}`}>
                    <img
                      src={productDetail.thumbnail}
                      className="h-[6rem] w-[6rem] min-w-[6rem] max-w-[6rem] cursor-pointer select-none object-scale-down sm:w-[8rem] sm:min-w-[8rem] sm:max-w-[8rem]"
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
                    {isDeleteButtonOrCountSelectVisible ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveProduct(item._id, item.productId);
                        }}
                        className="rounded-lg p-1 hover:bg-gray-300"
                      >
                        <IoTrashBinSharp className="text-xl" />
                      </button>
                    ) : null}
                  </div>
                  <div className="flex items-end justify-between">
                    {isDeleteButtonOrCountSelectVisible ? (
                      <QuantitySelectWithUpdate
                        productQuantity={item.count ? item.count : 1}
                        productId={item.productId}
                      />
                    ) : (
                      `${item.count ? item.count : productDetail.count ? productDetail.count : 1} ${item.count === 1 ? 'pc' : 'pcs'}`
                    )}
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

  return <div>{cartItems}</div>;
}
