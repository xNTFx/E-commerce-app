import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoadingDivComponent from '../components/LoadingComponents/LoadingDivComponent';
import Navbar from '../features/Navbar/Navbar';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

const CartPage = lazy(() => import('../pages/CartPage'));
const HomePage = lazy(() => import('../pages/HomePage'));
const Login = lazy(() => import('../pages/Login'));
const OrderDetails = lazy(() => import('../pages/OrderDetails'));
const OrderSummaryPage = lazy(() => import('../pages/OrderSummaryPage'));
const OrdersHistoryPage = lazy(() => import('../pages/OrdersHistoryPage'));
const PaymentPage = lazy(() => import('../pages/PaymentPage'));
const ProductPage = lazy(() => import('../pages/ProductPage'));
const Register = lazy(() => import('../pages/Register'));
const OrderUserDataForm = lazy(() => import('../pages/OrderUserDataForm'));

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div>
          <LoadingDivComponent />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="page/1" replace />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path="/page" element={<Navigate to="page/1" replace />} />
        <Route path="/" element={<Navbar />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="page/:page" element={<HomePage />} />
          <Route path=":id/:name" element={<ProductPage />} />
          <Route path="order-user-data-form" element={<OrderUserDataForm />} />
          <Route path="summary" element={<OrderSummaryPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="orders-history" element={<OrdersHistoryPage />} />
          <Route path="order/:order" element={<OrderDetails />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
