import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function useAddSearchParam() {
  const [searchParams, setSearchParams] = useSearchParams('');

  const addSearchParam = useCallback(
    (key: string, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set(key, value);

      setSearchParams(newSearchParams);
      return newSearchParams;
    },
    [searchParams, setSearchParams],
  );

  const removeSearchParam = (paramKey: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.delete(paramKey);

    setSearchParams(newSearchParams);

    return newSearchParams;
  };
  return { addSearchParam, removeSearchParam };
}
