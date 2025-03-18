import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { getOrders } from '../API/GetFetches';
import LoadingPageComponent from '../components/LoadingComponents/LoadingPageComponent';
import { UserContext } from '../context/UserContext';
import { OrderProps } from '../types/APITypes';
import formatDateTime from '../utils/formatDateTime';
import getIdTokenFunction from '../utils/getIdTokenFunction';

export default function OrdersHistoryPage() {
  const [idToken, setIdToken] = useState<string | null>(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    async function getToken() {
      if (user) {
        const id = await getIdTokenFunction();
        setIdToken(id ? id : null);
      } else {
        setIdToken(null);
      }
    }
    getToken();
  }, [user]);

  const { data, isLoading, isFetching, error } = useQuery(
    ['orders', idToken],
    () => getOrders(idToken),
    {
      enabled: !!idToken,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  );

  if (error) {
    console.error(error);
  }

  if (isFetching || isLoading || data === undefined)
    return <LoadingPageComponent />;

  const orderItems = data.map((order: OrderProps) => {
    const { date, time } = formatDateTime(order.createDate);
    return (
      <tr key={order._id} className="border-b">
        <td className="px-4 py-2">{order._id}</td>
        <td className="px-4 py-2">
          {date} {time}
        </td>
        <td className="px-4 py-2">${order.total}</td>
        <td className="px-4 py-2">{order.quantity}</td>
        <td className="px-4 py-2">{order.status}</td>
        <td className="px-4 py-2">
          <Link
            to={`/order/${order._id}`}
            className="text-blue-500 hover:underline"
          >
            View Order Details
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <main className="flex flex-col items-center justify-center pt-4">
      <section className="w-full max-w-5xl p-4">
        <h1 className="mb-4 text-3xl font-bold">Orders</h1>
        {orderItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2 font-medium">ID</th>
                  <th className="px-4 py-2 font-medium">DATE</th>
                  <th className="px-4 py-2 font-medium">TOTAL</th>
                  <th className="px-4 py-2 font-medium">QUANTITY</th>
                  <th className="px-4 py-2 font-medium">STATUS</th>
                  <th className="px-4 py-2 font-medium">INFO</th>
                </tr>
              </thead>
              <tbody>{orderItems}</tbody>
            </table>
          </div>
        ) : (
          <p className="text-xl font-medium">No order history</p>
        )}
      </section>
    </main>
  );
}
