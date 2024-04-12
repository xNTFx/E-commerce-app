import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useCallback, useContext } from 'react';

import { UserContext } from '../context/UserContext';
import useUpdateCart from '../hooks/useUpdateCart';
import getIdTokenFunction from '../utils/getIdTokenFunction';

interface QuantitySelectType {
  productQuantity: number;
  cartId: string | undefined;
  productId: string;
}

export default function QuantitySelectWithUpdate({
  productQuantity,
  cartId,
  productId,
}: QuantitySelectType) {
  const numbers = Array.from({ length: 99 }, (_, i) => (i + 1).toString());

  const { user } = useContext(UserContext);
  const { updateCartApiMutate, updateCartLocalStorageMutate } = useUpdateCart();

  const updateCart = useCallback(
    async (cartId: string | undefined, newCount: number, productId: string) => {
      if (user) {
        const userId = await getIdTokenFunction();
        updateCartApiMutate({ userId, cartId, newCount });
      } else {
        updateCartLocalStorageMutate({ productId, newCount });
      }
    },
    [user, updateCartApiMutate, updateCartLocalStorageMutate],
  );

  return (
    <div>
      <FormControl style={{ width: '4rem' }}>
        <Autocomplete
          id={cartId}
          value={productQuantity.toString()}
          onInputChange={(_event, newValue) => {
            if (productQuantity.toString() !== newValue) {
              if (Number(newValue) && Number(newValue) <= 99) {
                updateCart(cartId, Number(newValue), productId);
              }
            }
          }}
          options={numbers}
          renderInput={(params) => {
            const { InputProps } = params;
            InputProps.endAdornment = null;

            return <TextField {...params} InputProps={{ ...InputProps }} />;
          }}
        />
      </FormControl>
    </div>
  );
}
