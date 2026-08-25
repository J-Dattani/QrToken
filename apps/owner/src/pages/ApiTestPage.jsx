import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMerchantProfile } from "../redux/thunks/merchantThunks";

function ApiTestPage() {
  const dispatch = useDispatch();

  const {
    merchant,
    loading,
    error,
  } = useSelector(
    (state) => state.merchant
  );

  useEffect(() => {
    dispatch(fetchMerchantProfile());
  }, [dispatch]);

  return (
    <div>
      <h1>API Test Page</h1>

      {loading && (
        <p>
          Loading merchant...
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {merchant && (
        <pre>
          {JSON.stringify(
            merchant,
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
}

export default ApiTestPage;