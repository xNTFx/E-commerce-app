import { Rating } from '@mui/material';
import { Link } from 'react-router-dom';

import { ProductType } from '../../../types/APITypes';

interface ProductListProps {
  data?: {
    productList: ProductType[] | undefined;
  };
}

export default function ProductList({ data }: ProductListProps) {
  const productList = data?.productList?.map((product: ProductType) => {
    const discountedPrice = Math.round(
      product.price + (product.price * product.discountPercentage) / 100,
    ).toFixed(2);

    return (
      <article key={product._id}>
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <section className="cursor-pointer overflow-hidden border bg-white shadow sm:size-56">
            <Link to={`/${product._id}/${product.title}`}>
              <img
                className="select-none bg-transparent object-contain transition-transform hover:scale-110 sm:h-56"
                src={product.thumbnail}
                alt={product.thumbnail}
              />
            </Link>
          </section>
          <section className="item-start flex w-full flex-row justify-start gap-2">
            <Rating readOnly precision={0.5} value={product.rating} />
            <p className="flex font-bold">{product.rating}</p>
          </section>
          <Link
            to={`/${product._id}/${product.title}`}
            className="flex w-full flex-row items-center justify-start hover:underline"
          >
            <h2 className="line-clamp-2 w-full font-bold sm:max-w-[14rem]">
              {product.title.slice(0, 1).toUpperCase() + product.title.slice(1)}
            </h2>
          </Link>
        </div>
        <section className="flex w-full flex-col items-start justify-start">
          <div className="flex flex-row gap-2">
            {discountedPrice ? (
              <>
                <p>
                  <s>${discountedPrice}</s>
                </p>
                <p className="rounded-lg bg-green-200 px-1 font-bold text-green-800">
                  -{Math.ceil(product.discountPercentage)}%
                </p>
              </>
            ) : null}
          </div>
          <p className="font-bold">${product.price.toFixed(2)}</p>
        </section>
      </article>
    );
  });

  return productList;
}
