import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

function OrderSuccess({ orderId }) {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = setTimeout(() => {
      navigate(`/track/${orderId}`);
    }, 2200);

    return () => clearTimeout(redirect);
  }, [navigate, orderId]);

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-[#F8F3ED]
        px-6
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-[#E7D8C7]
          bg-white
          p-8
          text-center
          shadow-xl
          sm:p-10
        "
      >
        {/* Success Icon */}
        <div
          className="
            mx-auto
            mb-6
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-green-50
            ring-8
            ring-green-50/60
          "
          style={{
            animation: "successPop .45s ease-out",
          }}
        >
          <CheckCircle2
            size={56}
            strokeWidth={2}
            className="text-green-600"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold tracking-tight text-[#4B2E1F]">
          Order Placed!
        </h2>

        {/* Subtitle */}
        <p className="mt-3 leading-6 text-gray-600">
          Your order has been received successfully.
        </p>

        {/* Loading / Redirect */}
        <div className="mt-8 flex flex-col items-center gap-4">

          {/* Animated Dots */}
          <div className="flex items-center gap-2">
            <span
              className="
                h-2.5
                w-2.5
                rounded-full
                bg-[#6F4E37]
                animate-bounce
              "
            />

            <span
              className="
                h-2.5
                w-2.5
                rounded-full
                bg-[#8B5E3C]
                animate-bounce
              "
              style={{ animationDelay: "150ms" }}
            />

            <span
              className="
                h-2.5
                w-2.5
                rounded-full
                bg-[#C88A13]
                animate-bounce
              "
              style={{ animationDelay: "300ms" }}
            />
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