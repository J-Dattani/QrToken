import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import OwnerLayout from "../components/layout/OwnerLayout";

import ManualEntryPage from "../pages/ManualEntryPage";
import LiveOrdersPage from "../pages/LiveOrdersPage";
import KitchenQueuePage from "../pages/KitchenQueuePage";
import TableSessionsPage from "../pages/TableSessionsPage";
import CashManagementPage from "../pages/CashManagementPage";
import CashReconciliationPage from "../pages/CashReconciliationPage";
import RefundsPage from "../pages/RefundsPage";
import MenuManagerPage from "../pages/MenuManagerPage";
import CouponsPage from "../pages/CouponsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import SettingsPage from "../pages/SettingsPage";

import OwnerLogin from "../pages/OwnerLogin";
import OwnerRegister from "../pages/OwnerRegister";

function OwnerRoutes() {
  return (
    <Routes>

      {/* =====================================================
          AUTH
          ===================================================== */}

      {/* DEFAULT PAGE — LOGIN */}
      <Route
        path="/"
        element={<OwnerLogin />}
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={<OwnerRegister />}
      />


      {/* =====================================================
          OWNER PANEL
          ===================================================== */}

      <Route
        path="/owner"
        element={<OwnerLayout />}
      >

        {/* DEFAULT OWNER PAGE */}
        <Route
          index
          element={<LiveOrdersPage />}
        />

        {/* LIVE ORDERS */}
        <Route
          path="orders"
          element={<LiveOrdersPage />}
        />

        {/* KITCHEN */}
        <Route
          path="kitchen"
          element={<KitchenQueuePage />}
        />

        {/* MANUAL ENTRY */}
        <Route
          path="manual"
          element={<ManualEntryPage />}
        />

        {/* TABLE SESSIONS */}
        <Route
          path="tables"
          element={<TableSessionsPage />}
        />

        {/* CASH MANAGEMENT */}
        <Route
          path="cash"
          element={<CashManagementPage />}
        />

        {/* CASH RECONCILIATION */}
        <Route
          path="reconciliation"
          element={<CashReconciliationPage />}
        />

        {/* REFUNDS */}
        <Route
          path="refunds"
          element={<RefundsPage />}
        />

        {/* MENU */}
        <Route
          path="menu"
          element={<MenuManagerPage />}
        />

        {/* COUPONS */}
        <Route
          path="coupons"
          element={<CouponsPage />}
        />

        {/* ANALYTICS */}
        <Route
          path="analytics"
          element={<AnalyticsPage />}
        />

        {/* SETTINGS */}
        <Route
          path="settings"
          element={<SettingsPage />}
        />

      </Route>


      {/* =====================================================
          OLD /OWNER/DASHBOARD URL
          ===================================================== */}

      <Route
        path="/owner/dashboard"
        element={
          <Navigate
            to="/owner/orders"
            replace
          />
        }
      />


      {/* =====================================================
          UNKNOWN URL
          ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default OwnerRoutes;