import { Rating } from '@mui/material';
import { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { getSingleProduct } from '../API/GetFetches';
import LoadingPageComponent from '../components/LoadingComponents/LoadingPageComponent';
import { UserContext } from '../context/UserContext';
import QuantitySelect from '../features/ProductPage/components/QuantitySelect';
import usePostProductToCart from '../features/ProductPage/hooks/usePostProductToCart';
import useShowNotification from '../hooks/useShowNotification';
import { ProductType } from '../types/APITypes';
import getIdTokenFunction from '../utils/getIdTokenFunction';

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { showNotification } = useShowNotification();

  const [productQuantity, setProductQuantity] = useState(1);

  const { apiMutate, localStorageMutate } = usePostProductToCart();

  const { data, isLoading, error } = useQuery(
    ['products', id],
    getSingleProduct,
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    },
  );

  const product: ProductType = data;

  if (isLoading || data === undefined) {
    return (
      <div>
        <LoadingPageComponent />
      </div>
    );
  }
  if (error) {
    console.error(error);
  }
  if (!data || data.length === 0) return;

  const discountedPrice = Math.ceil(
    product?.price + (product?.price * product?.discountPercentage) / 100,
  );

  const imagesMap = product.images.map((image: string, index: number) => {
    return (
      <SwiperSlide key={index}>
        <img
          className="h-[10rem] w-[95vw] border object-scale-down md:h-[20rem] md:w-[30rem]"
          src={image}
          alt={`Product Image ${index + 1}`}
        />
      </SwiperSlide>
    );
  });

  async function postProdut() {
    try {
      if (user) {
        const idToken = await getIdTokenFunction();
        apiMutate({
          userId: idToken,
          productId: product._id,
          count: productQuantity,
        });
      } else {
        localStorageMutate({
          productId: product._id,
          count: productQuantity,
        });
      }

      showNotification('Product added to cart', {
        backgroundColor: 'green',
        textColor: '#ffffff',
        duration: 1500,
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <main className="mt-10 flex min-h-[50vh] flex-col items-center justify-center gap-4 overflow-hidden">
      <section>
        <article className="rounded-lg border border-gray-400 p-5 shadow">
          <section className="flex w-[95vw] select-none shadow sm:w-[30rem]">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={true}
              slidesPerView={1}
            >
              {imagesMap}
            </Swiper>
          </section>
          <section className="mt-4 flex w-[95vw] flex-col gap-2 sm:w-[30rem]">
            <h1 className="text-3xl font-extrabold">{product.title}</h1>
            <p className="text-2xl font-[400]">{product.brand}</p>
            <Link
              to={`/page/1?category=${product.category}`}
              className="flex justify-start text-xl underline"
            >
              {product.category}
            </Link>
            <hr className="my-3" />
            <div className="flex flex-row gap-2">
              <Rating readOnly value={product.rating} precision={0.5} />
              <p className="font-bold">{product.rating}</p>
            </div>
            <div className="flex w-full flex-col items-start justify-start">
              <div className="flex flex-row gap-2 text-xl">
                {discountedPrice ? (
                  <>
                    <p>
                      <s className="text-xl">${discountedPrice.toFixed(2)}</s>
                    </p>
                    <p className="rounded-lg bg-green-200 px-1 text-xl font-bold text-green-800">
                      -{Math.ceil(product.discountPercentage)}%
                    </p>
                  </>
                ) : null}
              </div>
              <p className="mt-1 text-2xl font-bold">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <hr className="my-3 w-full" />
            <p>{product.description}</p>
            <div className="mt-2 flex flex-row gap-5">
              <QuantitySelect
                productQuantity={productQuantity}
                setProductQuantity={setProductQuantity}
              />
              <button
                onClick={postProdut}
                className="rounded-lg bg-green-600 p-2 text-white transition-transform hover:scale-110"
              >
                Add to cart
              </button>
              <Link
                to="/cart"
                onClick={postProdut}
                className="flex items-center justify-center rounded-lg bg-blue-600 p-2 text-white transition-transform hover:scale-110"
              >
                Buy now
              </Link>
            </div>
          </section>
        </article>
      </section>
    </main>
  );
}
