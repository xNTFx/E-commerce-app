import { Link, Outlet } from 'react-router-dom';

import useAuthLogged from '../hooks/useAuthLogged';
import NavbarAccount from './NavbarAccount';
import NavbarCart from './NavbarCart';

export default function Navbar() {
  const { isUserLoading } = useAuthLogged();

  if (isUserLoading) {
    return <div className="fixed inset-0 bg-white"></div>;
  }

  return (
    <>
      <header>
        <nav className="flex h-20 items-center justify-between px-5 shadow-lg overflow-x-clip">
          <Link to="/" className="font-bold">
            Logo
          </Link>
          <div className="z-50 flex flex-row items-center justify-center gap-3">
            <NavbarAccount />
            <NavbarCart />
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
