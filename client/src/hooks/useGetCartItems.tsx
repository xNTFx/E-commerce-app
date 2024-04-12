import { useContext, useEffect, useState } from 'react';
import { QueryFunctionContext, useQuery } from 'react-query';

import { UserContext } from '../context/UserContext';
import { CartItemsType, ProductType } from '../types/APITypes';
import getIdTokenFunction from '../utils/getIdTokenFunction';

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
    isFetching: localStorageisFetching,
    isLoading: localStorageIsLoading,
  } = useQuery(
    ['localStorage', 'cartItems'],
    async () => {
      const storedData = localStorage.getItem('cartItems');
      if (!storedData) return null;
      const parseStoredData = JSON.parse(storedData);
      const ids = parseStoredData.map((obj: ProductType) => obj.productId);
      if (ids.length === 0) return;
      const URL = `http://localhost:3001/productsFromIdArray?ids=${ids}`;
      const response = await fetch(URL);
      const data = await response.json();

      const mergedArray = parseStoredData.map(
        (item: CartItemsType, index: number) => ({
          ...item,
          productDetails: [data[index]],
        }),
      );

      return mergedArray;
    },
  );

  async function fetchProducts(
    context: QueryFunctionContext<[string, { userId: string | null }]>,
  ) {
    const [, { userId }] = context.queryKey;
    if (!userId) return;
    const URL = `http://localhost:3001/cart?userId=${userId}`;
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  }
  const { data, isLoading, isFetching, error } = useQuery(
    ['cart', { userId: idToken }],
    fetchProducts,
    {
      enabled: !!idToken,
      keepPreviousData: true,
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
      isFetching: localStorageisFetching,
    };
  }
  return { data: null, isLoading: false };
}
