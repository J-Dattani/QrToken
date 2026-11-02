
import { Routes, Route, Navigate } from "react-router-dom";

// Main Landing Page
import LandingPage from "../LandingPage";

// Customer Pages
import MenuPage from "../customer/pages/MenuPage";
import CartPage from "../customer/pages/CartPage";
import CheckoutPage from "../customer/pages/CheckoutPage";
import TrackOrderPage from "../customer/pages/TrackOrderPage";
import OrderSuccessfulPage from "../customer/pages/OrderSuccessfulPage";
import NotFoundPage from "../customer/pages/NotFoundPage";

// Owner Pages
import OwnerLogin from "../owner/pages/OwnerLogin";
import OwnerRegister from "../owner/pages/OwnerRegister";
import ApiTestPage from "../owner/pages/ApiTestPage";
import OwnerLayout from "../owner/components/layout/OwnerLayout";
import LiveOrdersPage from "../owner/pages/LiveOrdersPage";
import KitchenQueuePage from "../owner/pages/KitchenQueuePage";
import ManualEntryPage from "../owner/pages/ManualEntryPage";
import TableSessionsPage from "../owner/pages/TableSessionsPage";
import OrderHistoryPage from "../owner/pages/OrderHistoryPage";
import CashManagementPage from "../owner/pages/CashManagementPage";
import CashReconciliationPage from "../owner/pages/CashReconciliationPage";
import RefundsPage from "../owner/pages/RefundsPage";
import MenuManagerPage from "../owner/pages/MenuManagerPage";
import CouponsPage from "../owner/pages/CouponsPage";
import AnalyticsPage from "../owner/pages/AnalyticsPage";
import SettingsPage from "../owner/pages/SettingsPage";
import ProtectedOwnerRoute from "../owner/routes/ProtectedOwnerRoute";

// Super Admin Pages
import AdminPage from "../admin/AdminPage";
import AdminLoginPage from "../admin/pages/AdminLoginPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Main Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Customer Routes */}
      <Route path="/shop/:merchantId" element={<MenuPage />} />
      <Route path="/shop/:merchantId/cart" element={<CartPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/shop/:merchantId/checkout" element={<CheckoutPage />} />
      <Route path="/track/:orderId" element={<TrackOrderPage />} />
      <Route path="/order-success" element={<OrderSuccessfulPage />} />

      {/* Owner Authentication Routes */}
      <Route path="/login" element={<OwnerLogin />} />
      <Route path="/register" element={<OwnerRegister />} />

      <Route
        path="/owner/login"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/owner/register"
        element={<Navigate to="/register" replace />}
      />

      <Route path="/api-test" element={<ApiTestPage />} />

      {/* Protected Owner Console Routes */}
      <Route element={<ProtectedOwnerRoute />}>
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<LiveOrdersPage />} />
          <Route path="orders" element={<LiveOrdersPage />} />
          <Route path="kitchen" element={<KitchenQueuePage />} />
          <Route path="manual" element={<ManualEntryPage />} />
          <Route path="tables" element={<TableSessionsPage />} />
          <Route path="history" element={<OrderHistoryPage />} />
          <Route path="cash" element={<CashManagementPage />} />

          <Route
            path="reconciliation"
            element={<CashReconciliationPage />}
          />

          <Route path="refunds" element={<RefundsPage />} />
          <Route path="menu" element={<MenuManagerPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route
          path="/owner/dashboard"
          element={<Navigate to="/owner/orders" replace />}
        />
      </Route>

      {/* Super Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
