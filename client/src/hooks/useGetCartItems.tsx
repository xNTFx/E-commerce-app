import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { fetchProductsFromCart, getProductsFromArray } from '../API/GetFetches';
import { UserContext } from '../context/UserContext';
import { CartItemsType, ProductType } from '../types/APITypes';
import getIdTokenFunction from '../utils/getIdTokenFunction';

async function getCartItems() {
  const storedData = localStorage.getItem('cartItems');
  if (!storedData) return null;

  const parseStoredData = JSON.parse(storedData);
  const ids = parseStoredData.map((obj: ProductType) => obj.productId);

  const data = await getProductsFromArray(ids);
  if (!data) return null;

  const dataMap = new Map(
    data.map((item: ProductType) => {
      if (!item._id) {
        console.warn('Product without _id:', item);
      }
      return [item._id, item];
    }),
  );

  const mergedArray = parseStoredData.map((item: CartItemsType) => {
    const productDetails = dataMap.get(item.productId);
    return {
      ...item,
      productDetails: productDetails ? [productDetails] : [],
    };
  });

  return mergedArray;
}

export default function useGetCartItems() {
  const [idToken, setIdToken] = useState<string | null>(null);

  const { user, isUserLoading } = useContext(UserContext);

  useEffect(() => {
    async function getToken() {
      if (user) {
        const id = await getIdTokenFunction();
        setIdToken(id ? id : null);
      } else {
        setIdToken(null);
      }
    }
    getToken();
  }, [user]);

  const {
    data: localStorageData,
    isFetching: localStorageIsFetching,
    isLoading: localStorageIsLoading,
  } = useQuery(['localStorage', 'cartItems'], getCartItems);

  const { data, isLoading, isFetching, error } = useQuery(
    ['cart', { userId: idToken }],
    fetchProductsFromCart,
    {
      enabled: !!idToken,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  if (error) {
    console.error(error);
  }

  if (!isUserLoading && user) {
    return { data, isLoading, isFetching };
  }
  if (!user && !isUserLoading) {
    return {
      data: localStorageData,
      isLoading: localStorageIsLoading,
      isFetching: localStorageIsFetching,
    };
  }
  return { data: null, isLoading: false };
}
