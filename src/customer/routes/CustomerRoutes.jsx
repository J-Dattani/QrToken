import { Routes, Route, Navigate  } from "react-router-dom";
import MenuPage from "../pages/MenuPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import NotFoundPage from "../pages/NotFoundPage";
import TrackOrderPage from "../pages/TrackOrderPage";

function CustomerRoutes() {
  return (
    <Routes>
      <Route
  path="/"
  element={
    <Navigate
      to="/shop/shree-krishna-tea-stall"
      replace
    />
  }
/>

      <Route path="/shop/:merchantId" element={<MenuPage />} />

      <Route path="/shop/:merchantId/cart" element={<CartPage />} />

      <Route path="/cart" element={<CartPage />} />

      <Route path="/shop/:merchantId/checkout" element={<CheckoutPage />} />

      <Route path="/track/:orderId" element={<TrackOrderPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default CustomerRoutes;