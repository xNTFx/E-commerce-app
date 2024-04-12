import { useCallback } from 'react';
import { CartItemsType } from '../types/APITypes';
import getIdTokenFunction from '../utils/getIdTokenFunction';
import usePostProductToCart from './usePostProductToCart';

export default function useAddLocalStorageDoAccCart() {
  const { apiMutate } = usePostProductToCart();

  const addLocalStorageToAccCart = useCallback(async () => {
    const localStorageData = localStorage.getItem('cartItems');

    if (!localStorageData) return;
    const parseLocalStorageData = JSON.parse(localStorageData);

    const idToken = await getIdTokenFunction();

    const mutationPromises = parseLocalStorageData.map((element: CartItemsType) => 
      apiMutate({
        userId: idToken,
        productId: element.productId,
        count: element.count,
      })
    );

    await Promise.all(mutationPromises);

    localStorage.removeItem('cartItems');
  }, [apiMutate]);

  return addLocalStorageToAccCart;
}
