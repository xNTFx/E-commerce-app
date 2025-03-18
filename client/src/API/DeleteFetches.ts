import axios from 'axios';

import { DeleteCartItemType } from '../types/APITypes';
import apiURL from './apiURL';

async function deleteEntireCart(userId: string | undefined) {
  if (!userId) return;
  const URL = `${apiURL}`;
  const data = await axios.delete(URL + '/cart/deleteEntireCart', {
    data: { userId },
  });
  return data;
}

async function deleteCartItem({ userId, cartId }: DeleteCartItemType) {
  if (!userId || !cartId) return;
  const URL = `${apiURL}`;
  const response = await axios.delete(URL + '/cart/deleteCartItem', {
    data: { userId, cartId },
  });
  return response;
}

export { deleteEntireCart, deleteCartItem };
