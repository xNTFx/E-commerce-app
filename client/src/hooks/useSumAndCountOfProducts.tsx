import { useMemo } from 'react';

import { CartItemsType } from '../types/APITypes';

export default function useSumAndCountOfProducts(data: CartItemsType[]) {
  const sumOfProductPrices = useMemo(() => {
    return data?.reduce((totalAccumulator: number, item: CartItemsType) => {
      const itemTotal = item.productDetails
        ? item.productDetails.reduce((productAccumulator, productDetail) => {
            return productAccumulator + productDetail.price * item.count;
          }, 0)
        : 0;
      return totalAccumulator + itemTotal;
    }, 0);
  }, [data]);

  const allItemCount = useMemo(() => {
    return data?.reduce((totalAccumulator: number, item: CartItemsType) => {
      return totalAccumulator + item.count;
    }, 0);
  }, [data]);

  return {
    sumOfProductPrices: isNaN(sumOfProductPrices)
      ? null
      : Number(sumOfProductPrices).toFixed(2),
    allItemCount: isNaN(allItemCount) ? 0 : Number(allItemCount),
  };
}
