import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess({ orderId }) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate(`/track/${orderId}`);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate, orderId]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">

        <div className="text-6xl mb-4">✅</div>

        <h2 className="text-3xl font-bold mb-3">
          Order Placed Successfully
        </h2>

        <p className="text-gray-600 mb-6">
          Redirecting to your order...
        </p>

        <div className="text-5xl font-bold text-green-600">
          {countdown}
        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;