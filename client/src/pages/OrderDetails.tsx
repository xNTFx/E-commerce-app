import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { getOrderDetails } from '../API/GetFetches';
import CartItems from '../components/CartItems';
import LoadingPageComponent from '../components/LoadingComponents/LoadingPageComponent';
import { ProductType } from '../types/APITypes';

export default function OrderDetails() {
  const { order } = useParams();

  const { data, isLoading, error } = useQuery(
    ['orders', order],
    () => getOrderDetails(order),
    {
      refetchOnWindowFocus: false,
      enabled: !!order,
    },
  );

  if (isLoading || data === undefined) {
    return (
      <div>
        <LoadingPageComponent />
      </div>
    );
  }

  if (error) {
    console.error(error);
  }

  const products = data.products.map((product: ProductType) => ({
    productDetails: [product],
  }));

  return (
    <main className="flex w-full flex-col items-center justify-center pt-4">
      <div className="w-screen p-1 md:w-[80%]">
        <h1 className="mb-4 text-3xl font-bold">Order Details</h1>

        <div className="mb-4 rounded-lg border bg-gray-100 p-4">
          <p>
            <strong>Name:</strong> {data.name} {data.surname}
          </p>
          <p>
            <strong>Address:</strong> {data.address}, {data.zipCode},{' '}
            {data.cityTown}
          </p>
          <p>
            <strong>Phone:</strong> {data.phone}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Order Date:</strong>{' '}
            {new Date(data.createDate).toLocaleDateString()}
          </p>
        </div>

        <div>
          <CartItems
            data={products}
            isDeleteButtonOrCountSelectVisible={false}
          />
        </div>

        <div className="my-4 flex items-center justify-center rounded-lg bg-gray-300 p-2">
          <p className="text-lg font-semibold">
            Total Price: ${data.total.toFixed(2)}
          </p>
        </div>
      </div>
    </main>
  );
}
