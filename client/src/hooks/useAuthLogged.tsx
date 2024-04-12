import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '../API/Firebase';
import useAddLocalStorageDoAccCart from './useAddLocalStorageDoAccCart';

export default function useAuthLogged() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const addLocalStorageToAccCart = useAddLocalStorageDoAccCart();

  useEffect(() => {
    let isMounted = true;
    setIsUserLoading(true);
  
    const unsubscribe = auth.onAuthStateChanged(
      async (user) => {
        if (isMounted) {
          setUser(user);
          if (user) {
            await addLocalStorageToAccCart();
          }
          setIsUserLoading(false);
        }
      },
      (error) => {
        if (isMounted) {
          console.error(error);
          setError(error);
          setIsUserLoading(false);
        }
      },
    );
  
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [addLocalStorageToAccCart]);
  

  if (error) {
    console.error(error);
  }

  return { user, isUserLoading, setUser };
}
