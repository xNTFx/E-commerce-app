import { signOut } from 'firebase/auth';
import { useContext, useState } from 'react';
import { RxAvatar } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';

import { auth } from '../API/Firebase';
import { UserContext } from '../context/UserContext';
import { InfoBox } from './InfoBox';

export default function NavbarAccount() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  async function signOutFunction(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    try {
      await signOut(auth);
      setUser && setUser(null);
    } catch (err) {
      console.error('Error in Firebase signOut:', err);
    }
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      className="static md:relative"
    >
      <div
        className={`rounded-t-lg border p-2 ${isOpen ? 'border-gray-300' : 'border-transparent'}`}
      >
        <div className="flex">
          <button>
            <span className="flex flex-col items-center justify-center">
              <RxAvatar className="text-4xl" />
              <p className="hidden text-xs font-bold sm:inline">
                {user?.email}
              </p>
            </span>
          </button>
        </div>
        {isOpen ? (
          <div className="absolute right-0 top-auto mt-2 flex h-auto flex-col items-center rounded rounded-tr-none border border-gray-300 bg-white p-2 font-bold">
            <div className="w-[100vw] rounded-lg bg-white p-2 sm:w-[20rem]">
              <InfoBox
                onClickOutside={() => setIsOpen(false)}
                className={'flex w-full flex-col items-center gap-2'}
              >
                {user ? (
                  <>
                    <button
                      onClick={(e) => {
                        signOutFunction(e);
                        setIsOpen(false);
                        navigate('/');
                      }}
                      className="w-[80%] rounded-lg bg-red-500 p-1 text-white hover:underline"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="login"
                      className="item-center flex w-[80%] justify-center rounded-lg bg-blue-500 p-1 text-white hover:underline"
                    >
                      Sign In
                    </Link>
                    <hr className="w-full" />
                    <Link
                      to="register"
                      className="item-center flex w-[80%] justify-center rounded-lg bg-green-500 p-1 text-white hover:underline"
                    >
                      Register
                    </Link>
                  </>
                )}
              </InfoBox>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
