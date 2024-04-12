import { FormControl, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import useAddSearchParam from '../hooks/useAddSearchParam';
import Categories from './Categories';
import SliderWithInputs from './SliderWithInputs';

export default function Filters() {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy');

  const [filter, setFilter] = useState(sortBy ? sortBy : 'default');

  const { addSearchParam } = useAddSearchParam();

  return (
    <div className="mr-5 flex w-60 flex-col gap-6 overflow-y-auto overflow-x-hidden bg-white p-4">
      <h2 className="text-2xl font-bold">Filters</h2>
      <hr />
      <section>
        <h3 className="text-2xl font-bold">Sort By</h3>
        <FormControl fullWidth>
          <Select
            id="sort-by-select"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              addSearchParam('sortBy', e.target.value);
            }}
            inputProps={{
              name: 'sortBy',
            }}
            MenuProps={{
              container: () => document.getElementById('mobile-filter'),
            }}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price-asc">Price: Ascending</MenuItem>
            <MenuItem value="price-desc">Price: Descending</MenuItem>
            <MenuItem value="name-az">Name: A to Z</MenuItem>
            <MenuItem value="name-za">Name: Z to A</MenuItem>
          </Select>
        </FormControl>
      </section>
      <hr />
      <section>
        <h3 className="text-2xl font-bold">Price</h3>
        <SliderWithInputs />
      </section>
      <hr />
      <section>
        <h3 className="text-2xl font-bold">Category</h3>
        <Categories />
      </section>
    </div>
  );
}
