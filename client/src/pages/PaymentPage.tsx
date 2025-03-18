import { Elements } from '@stripe/react-stripe-js';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

import apiURL from '../API/apiURL';
import LoadingPageComponent from '../components/LoadingComponents/LoadingPageComponent';
import CheckoutForm from '../features/PaymentPage/components/CheckoutForm';

function PaymentPage() {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch(`${apiURL}/stripe/config`).then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch(`${apiURL}/stripe/create-payment-intent`, {
      method: 'POST',
      body: JSON.stringify({}),
    }).then(async (result) => {
      const { clientSecret } = await result.json();
      setClientSecret(clientSecret);
    });
  }, []);

  if (!clientSecret || !stripePromise) {
    return <LoadingPageComponent />;
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="flex w-[95vw] flex-col justify-center gap-4 sm:w-[80vw]">
        <h1 className="font-bold">React Stripe and the Payment Element</h1>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
        <p>
          This is a test version, for a valid transaction use your card number:
          4242424242424242, date: any future date, CVC: any 3 numbers
        </p>
      </div>
    </main>
  );
}

export default PaymentPage;
