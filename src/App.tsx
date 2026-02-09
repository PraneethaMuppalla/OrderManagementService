import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from '@/pages/SignUp';
import SignIn from '@/pages/SignIn';
import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import Checkout from '@/pages/Checkout';
import OrderStatus from '@/pages/OrderStatus';
import Layout from '@/layouts/Layout';
import { useAppSelector } from '@/hooks/redux';
import { JSX } from 'react';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/signin" />;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <Menu />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-status/:orderId"
          element={
            <PrivateRoute>
              <OrderStatus />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
