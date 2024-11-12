import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useCallback, useContext } from 'react';

import { UserContext } from '../../../context/UserContext';
import getIdTokenFunction from '../../../utils/getIdTokenFunction';
import useUpdateCart from '../hooks/useUpdateCart';

interface QuantitySelectType {
  productQuantity: number;
  productId: string | undefined;
}

export default function QuantitySelectWithUpdate({
  productQuantity,
  productId,
}: QuantitySelectType) {
  const numbers = Array.from({ length: 99 }, (_, i) => (i + 1).toString());

  const { user } = useContext(UserContext);
  const { updateCartApiMutate, updateCartLocalStorageMutate } = useUpdateCart();

  const updateCart = useCallback(
    async (productId: string | undefined, count: number) => {
      if (user) {
        const userId = await getIdTokenFunction();
        updateCartApiMutate({ userId, productId, count });
      } else {
        updateCartLocalStorageMutate({ productId, count });
      }
    },
    [user, updateCartApiMutate, updateCartLocalStorageMutate],
  );

  const isValidQuantity = (value: string) => {
    const numValue = Number(value);
    return Number.isInteger(numValue) && numValue >= 1 && numValue <= 99;
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (isValidQuantity(newValue)) {
      updateCart(productId, Number(newValue));
    } else {
      event.target.value = productQuantity.toString();
    }
  };

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string | null,
  ) => {
    if (newValue && isValidQuantity(newValue)) {
      updateCart(productId, Number(newValue));
    }
  };

  return (
    <div>
      <FormControl style={{ width: '4rem' }}>
        <Autocomplete
          id={productId}
          value={productQuantity.toString()}
          onChange={handleChange}
          options={numbers}
          renderInput={(params) => (
            <TextField
              {...params}
              onBlur={handleBlur}
              InputProps={{ ...params.InputProps, endAdornment: null }}
            />
          )}
        />
      </FormControl>
    </div>
  );
}
