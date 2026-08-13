import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TokenCard from "../components/tracking/TokenCard";
import api from "../config/api";
import StatusTimeline from "../components/tracking/StatusTimeline";
import OrderSummaryCard from "../components/tracking/OrderSummaryCard";
import { removeActiveOrder,  getActiveOrder } from "../services/sessionStorage";

function TrackOrderPage() {
  const { orderId } = useParams();
const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
 useEffect(() => {
  let cancelled = false;

  const loadOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);

      const latestOrder = response.data.order || response.data;

if (!cancelled) {
  setOrder(latestOrder);

 
}
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  // First API call
  loadOrder();

  // Refresh every 5 seconds
  const interval = setInterval(() => {
    loadOrder();
  }, 5000);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}, [orderId]);

  if (loading) {
    return (
    <div className="min-h-screen bg-[#F8F3ED] flex flex-col items-center justify-center">
  <div className="h-12 w-12 rounded-full border-4 border-[#D7C2AD] border-t-[#6F4E37] animate-spin"></div>

  <p className="mt-5 text-[#6F4E37] font-medium">
    Loading your order...
  </p>
</div>
    );
  }

if (!order) {
  return (
    <div className="min-h-screen bg-[#F8F3ED] flex items-center justify-center px-5">
      <div className="bg-white border border-[#E7D8C7] rounded-3xl shadow-lg p-8 max-w-md w-full text-center">

        <div className="text-6xl mb-5">
          ❌
        </div>

        <h2 className="text-2xl font-bold text-[#4B2E1F]">
          Order Not Found
        </h2>

        <p className="text-gray-500 mt-3">
          This order doesn't exist or has expired.
        </p>

        <button
          onClick={() => navigate("/shop/shree-krishna-tea-stall")}
          className="mt-8 w-full bg-[#6F4E37] hover:bg-[#5A3E2B] text-white py-3 rounded-2xl transition cursor-pointer"
        >
          ← Back to Menu
        </button>

      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#F8F3ED] py-8 px-5">
  <div className="max-w-xl mx-auto">

 <div className="mb-8 flex items-center justify-between">

  <div>
    <h1 className="text-3xl font-bold text-[#4B2E1F]">
      Track Your Order
    </h1>

    <p className="mt-2 text-gray-600">
      Stay updated with your order status in real time.
    </p>
  </div>

  <button
    onClick={() => {
      const activeOrder = getActiveOrder();

      if (activeOrder) {
        if (order.status === "collected") {
          removeActiveOrder();
        }

        navigate(`/shop/${activeOrder.merchantSlug}`);
      }
    }}
    className="
      ml-6
      shrink-0
      rounded-xl
      bg-[#6F4E37]
      px-4
      py-2
      text-sm
      font-semibold
      text-white
      transition
      hover:bg-[#5A3E2B]
      cursor-pointer
    "
  >
    ← Back to Menu
  </button>

</div>

<div className="space-y-5">

  <TokenCard tokenNumber={order.tokenNumber} />

<StatusTimeline currentStatus={order.status} />

<OrderSummaryCard order={order} />

</div>

    </div>
    </div>
  );
}

export default TrackOrderPage;