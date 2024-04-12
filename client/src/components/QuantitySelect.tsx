import { Autocomplete, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';

interface QuantitySelectType {
  productQuantity: number;
  setProductQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export default function QuantitySelect({
  productQuantity,
  setProductQuantity,
}: QuantitySelectType) {
  const numbers = Array.from({ length: 99 }, (_, i) => (i + 1).toString());

  return (
    <div>
      <FormControl style={{ width: '4rem' }}>
        <Autocomplete
          id="quantity-select"
          value={productQuantity.toString()}
          onInputChange={(_event, newValue) => {
            if (Number(newValue) && Number(newValue) <= 99) {
              setProductQuantity(Number(newValue));
            }
          }}
          noOptionsText=""
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
