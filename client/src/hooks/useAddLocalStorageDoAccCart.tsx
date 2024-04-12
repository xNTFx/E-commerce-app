import axios from 'axios';
import { useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import getIdTokenFunction from '../utils/getIdTokenFunction';

export default function useAddLocalStorageDoAccCart() {
  const firstTime = useRef(true);
  const queryClient = useQueryClient();

  // Update to handle a batch of items
  async function addProducts(products: string[]) {
    if (!products || products.length === 0) return;
    const URL = 'https://shopping-page-server.vercel.app/add-or-update-items-in-cart';
    const idToken = await getIdTokenFunction();
    const data = await axios.post(URL, {
      userId: idToken,
      items: products,
    });
    return data;
  }

  const { error: addProductsError, mutate: addProductsMutate } = useMutation(
    addProducts,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      },
    },
  );

  const addLocalStorageToAccCart = useCallback(async () => {
    if (firstTime.current) {
      const localStorageData = localStorage.getItem('cartItems');
      if (!localStorageData) return;
      const parseLocalStorageData = JSON.parse(localStorageData);

      // Pass all items to mutate function for a single API call
      addProductsMutate(parseLocalStorageData);

      localStorage.removeItem('cartItems');
      firstTime.current = false;
    }
  }, [addProductsMutate]);

  if (addProductsError) {
    console.error('Failed to add products:', addProductsError);
    alert('Failed to update cart.');
  }

  return addLocalStorageToAccCart;
}
