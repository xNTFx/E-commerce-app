import { useLocation, useNavigate } from 'react-router-dom';

import CartItems from '../components/CartItems';
import LoadingPageComponent from '../components/LoadingComponents/LoadingPageComponent';
import useGetCartItems from '../hooks/useGetCartItems';

export default function OrderSummaryPage() {
  const locate = useLocation();
  const { name, surname, addres, zipCode, cityTown, phone, email } =
    locate.state;

  const { data, isLoading } = useGetCartItems();

  const navigate = useNavigate();

  if (isLoading || data === undefined) {
    return <LoadingPageComponent />;
  }

  if (!isLoading && !data) {
    navigate('/');
  }

  return (
    <main className="mt-5 flex flex-col items-center justify-center overflow-hidden">
      <div className="flex w-[95vw] flex-col gap-4 sm:w-[80vw]">
        <h1 className="text-2xl font-bold">Order Summary</h1>
        <section>
          <article>
            <div className="flex gap-1">
              <h2 className="font-bold">Full Name:</h2>
              <p className="break-all">{name + surname}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">Addres:</h2>
              <p className="break-all">{addres}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">Zip Code:</h2>
              <p className="break-all">{zipCode}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">City/Town:</h2>
              <p className="break-all">{cityTown}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">Phone Number:</h2>
              <p className="break-all">{phone}</p>
            </div>
            <div className="flex gap-1">
              <h2 className="font-bold">Email:</h2>
              <p className="break-all">{email}</p>
            </div>
          </article>
        </section>
        <button
          onClick={() => {
            navigate('/payment', { state: locate.state });
          }}
          className="flex w-full items-center justify-center rounded-lg bg-green-500 p-1 text-white transition hover:bg-green-400"
        >
          Proceed to payment
        </button>
        <section>
          <CartItems data={data} isDeleteButtonOrCountSelectVisible={false} />
        </section>
      </div>
    </main>
  );
}
