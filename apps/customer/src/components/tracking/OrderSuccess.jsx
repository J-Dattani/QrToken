import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess({ orderId }) {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = setTimeout(() => {
      navigate(`/track/${orderId}`);
    }, 2200);

    return () => clearTimeout(redirect);
  }, [navigate, orderId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F3ED] px-6">
      <div className="w-full max-w-md rounded-3xl border border-[#E7D8C7] bg-white p-10 text-center shadow-xl animate-[fadeIn_.3s_ease-out]">

        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
style={{ animation: "successPop .45s ease-out" }}>
          <span className="text-5xl">✅</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#4B2E1F]">
          Order Placed!
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-gray-600">
          Your order has been received successfully.
        </p>

        {/* Loading */}
        <div className="mt-8 flex flex-col items-center gap-4">

          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#6F4E37] animate-bounce"></span>
            <span
              className="h-3 w-3 rounded-full bg-[#8B5E3C] animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="h-3 w-3 rounded-full bg-[#C88A13] animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></span>
          </div>

          <p className="text-sm font-medium text-[#6F4E37]">
            Preparing your tracking page...
          </p>

        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;