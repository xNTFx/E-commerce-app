import { PaymentElement } from '@stripe/react-stripe-js';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { createOrder } from '../../../API/PostFetches';
import { UserContext } from '../../../context/UserContext';
import useShowNotification from '../../../hooks/useShowNotification';
import { CreateOrderType, Person, ProductType } from '../../../types/APITypes';
import getIdTokenFunction from '../../../utils/getIdTokenFunction';
import useDeleteEntireCart from '../../OrderSummaryPage/hooks/useDeleteEntireCart';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const locate = useLocation();
  const { user } = useContext(UserContext);
  const { showNotification } = useShowNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { removeCartLocalstorage } = useDeleteEntireCart();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  function createOrderFunction(state: Person, idToken: string | undefined) {
    const products = idToken 
      ? [] 
      : JSON.parse(localStorage.getItem('cartItems') || '[]') as ProductType[];
  
    const orderPayload: CreateOrderType = {
      state: {
        ...state,
        products: products
      }
    };
  
    return createOrder(orderPayload, idToken);
  }

  const mutation = useMutation({
    mutationFn: (idToken: string | undefined) =>
      createOrderFunction(locate.state, idToken),
    onSuccess: () => {
      queryClient.invalidateQueries('orders');
      showNotification('An order has been successfully created', {
        backgroundColor: 'green',
        textColor: '#ffffff',
        duration: 3000,
      });
      removeCartLocalstorage();
      navigate('/');
    },
    onError: () => {
      setMessage('An error occurred while creating your order.');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/`,
        },
        redirect: 'if_required',
      });

      let idToken = undefined;
      if (user) {
        idToken = await getIdTokenFunction();
      }

      mutation.mutate(idToken);

      if (
        error &&
        (error.type === 'card_error' || error.type === 'validation_error')
      ) {
        setMessage(error.message ? error.message : null);
      } else if (error) {
        setMessage('An unexpected error occured.');
      }
    } catch (e) {
      setMessage(
        'An error occurred while processing your payment. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={(e) => handleSubmit(e)}>
      <PaymentElement id="payment-element" />
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className="mt-4 w-full rounded-lg bg-green-500 p-1 text-white transition hover:bg-green-400"
      >
        <span id="button-text">
          {isProcessing ? 'Processing ... ' : 'Pay now'}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
