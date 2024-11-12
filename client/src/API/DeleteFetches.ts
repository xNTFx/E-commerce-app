import axios from 'axios';

import { DeleteCartItemType } from '../types/APITypes';

async function deleteEntireCart(userId: string | undefined) {
  if (!userId) return;
  const URL = 'http://localhost:3000';
  const data = await axios.delete(URL + '/deleteEntireCart', {
    data: { userId },
  });
  return data;
}

async function deleteCartItem({ userId, cartId }: DeleteCartItemType) {
  if (!userId || !cartId) return;
  const URL = 'http://localhost:3000';
  const response = await axios.delete(URL + '/deleteCartItem', {
    data: { userId, cartId },
  });
  return response;
}

export { deleteEntireCart, deleteCartItem };
