import { Link, Outlet } from 'react-router-dom';

import NavbarAccount from './components/NavbarAccount';
import NavbarCart from './components/NavbarCart';

export default function Navbar() {
  return (
    <>
      <header>
        <nav className="flex h-20 items-center justify-between overflow-x-clip px-5 shadow-lg">
          <Link to="/" className="font-bold">
            Logo
          </Link>
          <div className="z-50 flex flex-row items-center justify-center gap-3">
            <NavbarCart />
            <NavbarAccount />
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
