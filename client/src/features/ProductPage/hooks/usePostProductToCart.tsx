import { useMutation, useQueryClient } from 'react-query';

import { addProductToLocalStorage } from '../../../API/LocalStorageActions';
import { addProduct } from '../../../API/PostFetches';

export default function usePostProductToCart() {
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
    console.error(addProductError);
  }
  if (localStorageError) {
    console.error(localStorageError);
  }

  return { apiMutate, isLoadingApiMutate, localStorageMutate };
}
