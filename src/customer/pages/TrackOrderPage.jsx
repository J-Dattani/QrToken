import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TokenCard from "../components/tracking/TokenCard";
import StatusTimeline from "../components/tracking/StatusTimeline";
import OrderSummaryCard from "../components/tracking/OrderSummaryCard";
import TaxReceiptModal from "../components/receipt/TaxReceiptModal";

import api from "../config/api";

import {
  removeActiveOrder,
  getActiveOrder,
} from "../services/sessionStorage";

function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      try {
        // -----------------------------------------
        // Fetch Order
        // -----------------------------------------

        const response = await api.get(`/orders/${orderId}`);

        const latestOrder =
          response.data.order || response.data;

        if (cancelled) return;

        setOrder(latestOrder);

        // -----------------------------------------
        // Fetch Merchant
        // -----------------------------------------

        /*
          /menu/public/:merchantId actually expects
          the merchant slug in this application.

          Example:
          shree-krishna-tea-stall
        */

        const activeOrder = getActiveOrder();

        const merchantSlug =
          activeOrder?.merchantSlug ||
          latestOrder?.merchantSlug;

        if (merchantSlug) {
          try {
            const merchantResponse = await api.get(
              `/menu/public/${merchantSlug}`
            );

            console.log(
              "Merchant response:",
              merchantResponse.data
            );

            if (!cancelled) {
              setMerchant(
                merchantResponse.data.merchant
              );
            }
          } catch (merchantError) {
            console.error(
              "Error fetching merchant:",
              merchantError
            );
          }
        } else {
          console.warn(
            "Merchant slug not found for this order."
          );
        }
      } catch (error) {
        console.error(
          "Error fetching order:",
          error
        );

        if (!cancelled) {
          setOrder(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // Initial API call
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

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3ED] flex flex-col items-center justify-center">
        <div
          className="
            h-12
            w-12
            rounded-full
            border-4
            border-[#D7C2AD]
            border-t-[#6F4E37]
            animate-spin
          "
        />

        <p className="mt-5 text-[#6F4E37] font-medium">
          Loading your order...
        </p>
      </div>
    );
  }

  // -----------------------------------------
  // Order Not Found
  // -----------------------------------------

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F3ED] flex items-center justify-center px-5">
        <div
          className="
            bg-white
            border
            border-[#E7D8C7]
            rounded-3xl
            shadow-lg
            p-8
            max-w-md
            w-full
            text-center
          "
        >
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
            onClick={() =>
              navigate(
                "/shop/shree-krishna-tea-stall"
              )
            }
            className="
              mt-8
              w-full
              bg-[#6F4E37]
              hover:bg-[#5A3E2B]
              text-white
              py-3
              rounded-2xl
              transition
              cursor-pointer
            "
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // Main Page
  // -----------------------------------------

  return (
    <div className="min-h-screen bg-[#F8F3ED] py-8 px-5">
      <div className="max-w-xl mx-auto">

        {/* Header */}
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

                navigate(
                  `/shop/${activeOrder.merchantSlug}`
                );
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

        {/* Tracking Content */}
        <div className="space-y-5">

          {/* Token */}
          <TokenCard
            tokenNumber={order.tokenNumber}
          />

          {/* Status */}
          <StatusTimeline
            currentStatus={order.status}
          />

          {/* Order Summary */}
          <OrderSummaryCard
            order={order}
          />

          {/* GST Receipt Button */}
          <button
            onClick={() => {
              setIsReceiptOpen(true);
            }}
            className="
              w-full
              rounded-2xl
              bg-[#1C1A17]
              px-5
              py-4
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#2A2723]
              active:scale-[0.99]
              cursor-pointer
            "
          >
            📄 View & Print GST Tax Receipt
          </button>
        </div>

        {/* GST Receipt Modal */}
        <TaxReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          order={order}
          merchant={merchant}
        />

      </div>
    </div>
  );
}

export default TrackOrderPage;