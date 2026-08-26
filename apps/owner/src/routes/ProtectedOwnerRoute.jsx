import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedOwnerRoute() {
  const {
    isAuthenticated,
    isInitialized,
  } = useSelector(
    (state) => state.auth
  );

  // Wait until stored authentication
  // has been restored.
  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedOwnerRoute;