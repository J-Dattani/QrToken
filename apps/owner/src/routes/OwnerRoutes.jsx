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

function OwnerRoutes() {
  return (
    <Routes>

      {/* OWNER PANEL */}
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

        {/* Temporary routes - pages will be added one by one */}
        <Route
  path="manual"
  element={<ManualEntryPage />}
/>

        <Route
          path="tables"
          element={<TableSessionsPage />}
        />

        <Route
          path="cash"
          element={<CashManagementPage />}
        />

        <Route
          path="reconciliation"
          element={<CashReconciliationPage />}
        />

        <Route
          path="refunds"
          element={<RefundsPage />}
        />

        <Route
          path="menu"
          element={<MenuManagerPage/>}
        />

        <Route
          path="coupons"
          element={<CouponsPage />}
        />

        <Route
          path="analytics"
          element={<AnalyticsPage/>}
        />

        <Route
          path="settings"
          element={<SettingsPage />}
        />

      </Route>

      {/* OLD DASHBOARD URL → DEFAULT OWNER PAGE */}
      <Route
        path="/owner/dashboard"
        element={
          <Navigate
            to="/owner"
            replace
          />
        }
      />

      {/* UNKNOWN URL */}
      <Route
        path="*"
        element={
          <Navigate
            to="/owner"
            replace
          />
        }
      />

    </Routes>
  );
}

export default OwnerRoutes;