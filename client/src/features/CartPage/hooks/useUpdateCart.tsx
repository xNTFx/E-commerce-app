import { useMutation, useQueryClient } from 'react-query';

import { updateCartLocalStorage } from '../../../API/LocalStorageActions';
import { updateCartApi } from '../../../API/PostFetches';

export default function useUpdateCart() {
  const queryClient = useQueryClient();

  const { error: updateCartApiError, mutate: updateCartApiMutate } =
    useMutation(updateCartApi, {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      },
    });

  const {
    error: updateCartLocalStorageError,
    mutate: updateCartLocalStorageMutate,
  } = useMutation(updateCartLocalStorage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['localStorage', 'cartItems']);
    },
  });

  if (updateCartApiError) {
    console.error(updateCartApiError);
  }
  if (updateCartLocalStorageError) {
    console.error(updateCartLocalStorageError);
  }

  return { updateCartApiMutate, updateCartLocalStorageMutate };
}
