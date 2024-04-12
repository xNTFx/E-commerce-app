import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { CartItemsType } from '../types/APITypes';

export default function usePostProductToCart() {
  async function addProduct(newProduct: CartItemsType) {
    if (!newProduct.userId || !newProduct.productId || !newProduct.count)
      return;
    const URL = 'https://shopping-page-server.vercel.app';
    const data = await axios.post(
      URL + '/add-or-update-item-in-cart',
      newProduct,
    );
    return data;
  }

  async function addProductToLocalStorage(newProduct: CartItemsType) {
    try {
      const existingProductsString = localStorage.getItem('cartItems');
      let existingProducts: CartItemsType[] = [];

      if (existingProductsString) {
        existingProducts = JSON.parse(existingProductsString);
        const foundIndex = existingProducts.findIndex(
          (prev) => prev.productId === newProduct.productId,
        );
        if (foundIndex !== -1) {
          existingProducts[foundIndex].count += 1;
        } else {
          existingProducts.push(newProduct);
        }
      } else {
        existingProducts.push(newProduct);
      }

      const updatedProductsString = JSON.stringify(existingProducts);

      localStorage.setItem('cartItems', updatedProductsString);

      return updatedProductsString;
    } catch (error) {
      console.error('Failed to add product to localStorage:', error);
      return null;
    }
  }

  const queryClient = useQueryClient();
  const {
    error: addProductError,
    mutate: apiMutate,
    isLoading: isLoadingApiMutate,
  } = useMutation(['cart'], addProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });

  const { error: localStorageError, mutate: localStorageMutate } = useMutation(
    addProductToLocalStorage,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['localStorage', 'cartItems']);
      },
    },
  );

  if (addProductError) {
    alert(addProductError);
  }
  if (localStorageError) {
    alert(localStorageError);
  }

  return { apiMutate, isLoadingApiMutate, localStorageMutate };
}
