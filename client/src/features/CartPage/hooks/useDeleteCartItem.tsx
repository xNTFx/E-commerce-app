import { useMutation, useQueryClient } from 'react-query';

import { deleteCartItem } from '../../../API/DeleteFetches';
import { deleteCartItemFromLocalStorage } from '../../../API/LocalStorageActions';

export default function useDeleteCartItem() {
  const queryClient = useQueryClient();

  const { error: removeProductApiError, mutate: removeProductApi } =
    useMutation(['cart'], deleteCartItem, {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      },
    });

  const {
    error: removeProductLocalStorageError,
    mutate: removeProductLocalStorage,
  } = useMutation(['cart'], deleteCartItemFromLocalStorage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['localStorage', 'cartItems']);
    },
  });

  if (removeProductApiError) {
    console.error(removeProductApiError);
  }

  if (removeProductLocalStorageError) {
    console.error(removeProductLocalStorageError);
  }

  return { removeProductApi, removeProductLocalStorage };
}
