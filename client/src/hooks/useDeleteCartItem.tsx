import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { ProductType } from '../types/APITypes';

interface DeleteCartItemType {
  userId?: string | undefined;
  cartId?: string;
  productId?: string;
}

export default function useDeleteCartItem() {
  async function deleteCartItem({ userId, cartId }: DeleteCartItemType) {
    if (!userId || !cartId) return;
    const URL = 'https://shopping-page-server.vercel.app';
    const data = await axios.delete(URL + '/deleteCart', {
      data: { userId, cartId },
    });
    return data;
  }
  async function deleteCartItemFromLocalstorage({
    productId,
  }: DeleteCartItemType) {
    const existingProductsString = localStorage.getItem('cartItems');
    if (!existingProductsString) return;
    const parseLocalstorage = JSON.parse(existingProductsString);
    const filteredLocalstorage = parseLocalstorage.filter(
      (element: ProductType) => element.productId !== productId,
    );
    if (filteredLocalstorage) {
      localStorage.setItem('cartItems', JSON.stringify(filteredLocalstorage));
    } else {
      localStorage.removeItem('cartItems');
    }
  }

  const queryClient = useQueryClient();
  const { error: removeProductApiError, mutate: removeProductApi } =
    useMutation(['cart'], deleteCartItem, {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      },
    });

  const {
    error: removeProductLocalstorageError,
    mutate: removeProductLocalstorage,
  } = useMutation(['cart'], deleteCartItemFromLocalstorage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['localStorage', 'cartItems']);
    },
  });

  if (removeProductApiError) {
    alert(removeProductApiError);
  }

  if (removeProductLocalstorageError) {
    alert(removeProductLocalstorageError);
  }

  return { removeProductApi, removeProductLocalstorage };
}
