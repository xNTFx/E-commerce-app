import { useMutation, useQueryClient } from 'react-query';

import { addProductsFromFromLocalStorageToAccountCart } from '../API/LocalStorageActions';
import { addProductsToCart } from '../API/PostFetches';

export default function useAddProductsFromFromLocalStorageToAccountCart() {
  const queryClient = useQueryClient();

  const { error: addProductsError, mutate: addProductsMutate } = useMutation(
    addProductsToCart,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      },
    },
  );

  if (addProductsError) {
    console.error('Failed to add products:', addProductsError);
    console.error('Failed to update cart.');
  }

  return async function handleAddProducts() {
    await addProductsFromFromLocalStorageToAccountCart(addProductsMutate);
  };
}
