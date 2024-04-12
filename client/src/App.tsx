import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import { UserProvider } from './context/UserContext';
import './css/App.css';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import OrderPage from './pages/OrderPage';
import OrderSummaryPage from './pages/OrderSummaryPage';
import PaymentPage from './pages/PaymentPage';
import ProductPage from './pages/ProductPage';
import Register from './pages/Register';
import PaymentCompletionPage from './pages/PaymentCompletionPage';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/1" replace />} />
            <Route path="/" element={<Navbar />}>
              <Route path="cart" element={<CartPage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path=":page" element={<HomePage />} />
              <Route path=":id/:name" element={<ProductPage />} />
              <Route path="order" element={<OrderPage />} />
              <Route path="summary" element={<OrderSummaryPage />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route
                path="payment-completion"
                element={<PaymentCompletionPage />}
              />
            </Route>
          </Routes>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
