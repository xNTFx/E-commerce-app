import { useMutation, useQueryClient } from 'react-query';

import { deleteEntireCart } from '../../../API/DeleteFetches';
import { deleteCartItemFromLocalstorage } from '../../../API/LocalStorageActions';

export default function useDeleteEntireCart() {
  const queryClient = useQueryClient();

  const { error: removeCartLocalstorageError, mutate: removeCartLocalstorage } =
    useMutation(['cart'], deleteCartItemFromLocalstorage, {
      onSuccess: () => {
        queryClient.invalidateQueries(['localStorage', 'cartItems']);
      },
    });

  const { error: removeCart, mutate: deleteCart } = useMutation(
    ['cart'],
    deleteEntireCart,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      },
    },
  );

  if (removeCart) {
    console.error(removeCart);
  }

  if (removeCartLocalstorageError) {
    console.error(removeCartLocalstorageError);
  }

  return { removeCartLocalstorage, deleteCart };
}
