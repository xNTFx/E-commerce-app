import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { CartItemsType, UpdateCartType } from '../types/APITypes';

export default function useUpdateCart() {
  const queryClient = useQueryClient();

  async function updateCartApi(newCart: UpdateCartType) {
    const URL = 'http://localhost:3001';
    const data = await axios.post(URL + '/updateCart', newCart);
    return data;
  }

  const { error: updateCartApiError, mutate: updateCartApiMutate } =
    useMutation(updateCartApi, {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      },
    });

  async function updateCartLocalStorage(newCart: UpdateCartType) {
    const cart = localStorage.getItem('cartItems');
    if (!cart) return;
    const parseCart = JSON.parse(cart);

    // Correctly update the count for the matching cart item
    const updatedCart = parseCart.map((cartItem: CartItemsType) =>
      cartItem.productId === newCart.productId
        ? { ...cartItem, count: newCart.newCount }
        : cartItem,
    );

    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    return updatedCart;
  }

  const {
    error: updateCartLocalStorageError,
    mutate: updateCartLocalStorageMutate,
  } = useMutation(updateCartLocalStorage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['localStorage', 'cartItems']);
    },
  });

  if (updateCartApiError) {
    alert(updateCartApiError);
  }
  if (updateCartLocalStorageError) {
    alert(updateCartLocalStorageError);
  }

  return { updateCartApiMutate, updateCartLocalStorageMutate };
}
