import { Input, Slider } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useAddSearchParam from '../hooks/useAddSearchParam';

export default function SliderWithInputs() {
  const { addSearchParam } = useAddSearchParam();

  const maxValue = 2000;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const price = searchParams
    .get('price')
    ?.split(',')
    ?.map((element) => Number(element));

  const [priceValue, setPriceValue] = useState<number[]>(
    price ? price : [0, maxValue],
  );
  const [tempPriceValue, setTempPriceValue] = useState<number[]>(
    price ? price : [0, maxValue],
  );

  function handleChange(index: number, newValue: string) {
    setTempPriceValue((prev) => {
      const value =
        parseInt(newValue) > maxValue ? maxValue : parseInt(newValue);
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });
  }

  function handleBlur() {
    if (!tempPriceValue[0] || !tempPriceValue[1]) {
      setTempPriceValue(priceValue);
      return;
    }

    const minPrice = Math.min(
      tempPriceValue[0] > 0 ? tempPriceValue[0] : priceValue[0],
      tempPriceValue[1] > 0 ? tempPriceValue[1] : priceValue[1],
    );
    const maxPrice = Math.max(
      tempPriceValue[0] > 0 ? tempPriceValue[0] : priceValue[0],
      tempPriceValue[1] > 0 ? tempPriceValue[1] : priceValue[1],
    );

    setPriceValue([minPrice, maxPrice]);
    setTempPriceValue([minPrice, maxPrice]);
    const params = addSearchParam('price', [minPrice, maxPrice].toString());
    navigate(`/1?${params.toString()}`, { replace: true });
  }
  return (
    <>
      <Slider
        valueLabelDisplay="auto"
        max={maxValue}
        value={priceValue}
        onChange={(_e, newValue) => setPriceValue(newValue as number[])}
        onChangeCommitted={(_e, newValue) => {
          setTempPriceValue([priceValue[0], priceValue[1]]);
          const params = addSearchParam('price', newValue.toString());
          navigate(`/page/1?${params.toString()}`, { replace: true });
        }}
      />
      <div className="flex flex-row justify-between">
        <Input
          id="lower-price-input"
          type="number"
          value={tempPriceValue[0] >= 0 ? tempPriceValue[0] : ''}
          className="w-[45%]"
          onChange={(e) => handleChange(0, e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
          inputProps={{
            min: 1,
            max: maxValue,
            style: {
              textAlign: 'center',
            },
          }}
        />
        <p className="text-xl font-bold">-</p>
        <Input
          id="upper-price-input"
          type="number"
          value={tempPriceValue[1] >= 0 ? tempPriceValue[1] : ''}
          className="w-[45%]"
          onChange={(e) => handleChange(1, e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              (e.target as HTMLInputElement).blur();
            }
          }}
          inputProps={{
            min: 1,
            max: maxValue,
            style: {
              textAlign: 'center',
            },
          }}
        />
      </div>
    </>
  );
}
