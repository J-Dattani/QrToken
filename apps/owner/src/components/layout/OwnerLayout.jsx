import { Outlet } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";
import OwnerHeader from "./OwnerHeader";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchMerchantProfile } from "../../redux/thunks/merchantThunks";

function OwnerLayout() {
  const dispatch = useDispatch();
  useEffect(() => {
  dispatch(fetchMerchantProfile());
}, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F3ED]">
      <OwnerSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <OwnerHeader />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default OwnerLayout;
