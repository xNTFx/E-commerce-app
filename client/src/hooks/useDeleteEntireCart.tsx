import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteEntireCart() {
  async function deleteCartItemFromLocalstorage() {
    const existingCart = localStorage.getItem('cartItems');
    if (!existingCart) return;
    localStorage.setItem('cartItems', '');
  }

  async function deleteCartItem(userId: string | undefined) {
    if (!userId) return;
    const URL = 'https://shopping-page-server.vercel.app';
    const data = await axios.delete(URL + '/deleteEntireCart', {
      data: { userId },
    });
    return data;
  }

  const queryClient = useQueryClient();

  const { error: removeCartLocalstorageError, mutate: removeCartLocalstorage } =
    useMutation(['cart'], deleteCartItemFromLocalstorage, {
      onSuccess: () => {
        queryClient.invalidateQueries(['localStorage', 'cartItems']);
      },
    });

  const { error: removeCart, mutate: deleteCart } = useMutation(
    ['cart'],
    deleteCartItem,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      },
    },
  );

  if (removeCart) {
    alert(removeCart);
  }

  if (removeCartLocalstorageError) {
    alert(removeCartLocalstorageError);
  }

  return { removeCartLocalstorage, deleteCart };
}
