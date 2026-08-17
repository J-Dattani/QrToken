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
          element={<Navigate to="/owner/orders" replace />}
        />

        <Route
          path="reconciliation"
          element={<Navigate to="/owner/orders" replace />}
        />

        <Route
          path="refunds"
          element={<Navigate to="/owner/orders" replace />}
        />

        <Route
          path="menu"
          element={<Navigate to="/owner/orders" replace />}
        />

        <Route
          path="coupons"
          element={<Navigate to="/owner/orders" replace />}
        />

        <Route
          path="analytics"
          element={<Navigate to="/owner/orders" replace />}
        />

        <Route
          path="settings"
          element={<Navigate to="/owner/orders" replace />}
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