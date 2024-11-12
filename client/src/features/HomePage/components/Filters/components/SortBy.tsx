import { FormControl, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAddSearchParam from '../hooks/useAddSearchParam';

export default function SortBy() {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy');
  const [filter, setFilter] = useState(sortBy ? sortBy : 'default');

  const { addSearchParam } = useAddSearchParam();
  const navigate = useNavigate();

  return (
    <section>
      <h3 className="text-2xl font-bold">Sort By</h3>
      <FormControl fullWidth>
        <Select
          id="sort-by-select"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            const params = addSearchParam('sortBy', e.target.value);
            navigate(`/page/1?${params.toString()}`, { replace: true });
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
  );
}
