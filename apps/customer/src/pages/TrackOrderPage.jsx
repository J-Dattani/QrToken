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
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-5">

      <h1 className="text-3xl font-bold mb-6">
        Track Order
      </h1>
<div className="space-y-6">

  <TokenCard tokenNumber={order.tokenNumber} />

<StatusTimeline currentStatus={order.status} />

<OrderSummaryCard order={order} />

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
  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
>
  ← Back to Menu
</button>
</div>

    </div>
  );
}

export default TrackOrderPage;