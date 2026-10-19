import { useState } from "react";
import OrderSummary from "./OrderSummary";
import CustomerDetails from "./CustomerDetails";
import PaymentMethod from "./PaymentMethod";
import BillSummary from "./BillSummary";
import CouponSection from "./CouponSection";
import api from "../../config/api";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { loadRazorpay } from "../../services/razorpay";
import {
  saveActiveOrder,
  saveOrderHistory,
} from "../../services/sessionStorage";
import OrderSuccess from "../tracking/OrderSuccess";

function CheckoutModal({
  isOpen,
  onClose,
  merchantId,
  merchantSlug,
  taxConfig,
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [payMode, setPayMode] = useState("cash");
  const [notes, setNotes] = useState("");

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // -----------------------------
  // DIGITAL PAYMENT
  // -----------------------------
  const handleDigitalPayment = async (payload) => {
    const isLoaded = await loadRazorpay();

    if (!isLoaded) {
      alert("Failed to load Razorpay.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/orders", payload);

      const order = response.data.order;

      if (!order.razorpayOrderId) {
        alert("Razorpay Order ID not received.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.total * 100,

        currency: "INR",

        name: "QRToken",

        description: "Restaurant Order",

        order_id: order.razorpayOrderId,

        prefill: {
          name: customerName,
          contact: customerPhone,
        },

        notes: {
          merchantId,
          orderId: order._id,
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            console.log("Payment popup closed");
          },
        },

        handler: async function (response) {
          try {
            const verifyResponse = await api.post(
              "/orders/verify-payment",
              {
                orderId: order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }
            );

            const verifiedOrder = verifyResponse.data.order;

            saveActiveOrder({
              orderId: verifiedOrder._id,
              tokenNumber: verifiedOrder.tokenNumber,
              merchantSlug,
              status: verifiedOrder.status,
              paymentStatus: verifiedOrder.paymentStatus,
              createdAt: verifiedOrder.createdAt,
            });

            saveOrderHistory({
              orderId: verifiedOrder._id,
              tokenNumber: verifiedOrder.tokenNumber,
              merchantSlug,
              status: verifiedOrder.status,
              paymentStatus: verifiedOrder.paymentStatus,
              createdAt: verifiedOrder.createdAt,
            });

            dispatch(clearCart());

            setPlacedOrderId(verifiedOrder._id);
            setShowSuccess(true);
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error
            );

            alert("Payment verification failed.");
          }
        },

        theme: {
          color: "#6F4E37",
        },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        setLoading(false);

        console.error(
          "Payment Failed:",
          response.error
        );

        alert(
          response.error.description ||
            "Payment Failed"
        );
      });

      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Failed to create payment order.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // CASH ORDER
  // -----------------------------
  const placeCashOrder = async (payload) => {
    try {
      setLoading(true);

      const response = await api.post(
        "/orders",
        payload
      );

      const order = response.data.order;

      saveActiveOrder({
        orderId: order._id,
        tokenNumber: order.tokenNumber,
        merchantSlug,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      });

      saveOrderHistory({
        orderId: order._id,
        tokenNumber: order.tokenNumber,
        merchantSlug,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      });

      dispatch(clearCart());

      setPlacedOrderId(order._id);
      setShowSuccess(true);
    } catch (error) {
      console.error(
        "Error placing order:",
        error
      );

      alert(
        "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // PLACE ORDER
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!customerPhone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (
      customerPhone.length !== 10 ||
      !/^\d+$/.test(customerPhone)
    ) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const payload = {
      merchantId,
      payMode,
      customerName,
      customerPhone,
      notes,

      // Coupon
      couponCode: appliedCoupon?.code || "",

      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
        subtotal:
          item.price * item.quantity,
        price: item.price,
        name: item.name,
      })),
    };

    console.log(
      "Order Payload:",
      payload
    );

    if (payMode === "digital") {
      await handleDigitalPayment(payload);
      return;
    }

    await placeCashOrder(payload);
  };

  // -----------------------------
  // SUCCESS SCREEN
  // -----------------------------
  if (showSuccess) {
    return (
      <OrderSuccess
        orderId={placedOrderId}
      />
    );
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="
          absolute
          bottom-0
          left-1/2
          -translate-x-1/2
          w-full
          max-w-5xl
          h-[90vh]
          bg-[#F8F3ED]
          rounded-t-3xl
          flex
          flex-col
          shadow-2xl
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* Header */}
        <div
          className="
            sticky
            top-0
            z-10
            bg-[#F8F3ED]
            border-b
            border-[#E7D8C7]
            px-6
            py-4
            rounded-t-3xl
          "
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#4B2E1F]">
              Complete Your Order
            </h2>

            <button
              onClick={onClose}
              disabled={loading}
              className="
                w-10
                h-10
                rounded-full
                border
                border-[#E7D8C7]
                bg-white
                flex
                items-center
                justify-center
                text-xl
                text-[#6F4E37]
                hover:bg-[#FFF7EF]
                transition
                disabled:opacity-50
                cursor-pointer
              "
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className="
            flex-1
            overflow-y-auto
            px-6
            py-5
            space-y-5
            pb-32
          "
        >
          {/* Order Summary */}
          <div
            className="
              bg-white
              rounded-2xl
              border
              border-[#E7D8C7]
              p-5
              shadow-sm
            "
          >
            <OrderSummary />
          </div>

          {/* Customer Details */}
          <div
            className="
              bg-white
              rounded-2xl
              border
              border-[#E7D8C7]
              p-5
              shadow-sm
            "
          >
            <CustomerDetails
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerPhone={customerPhone}
              setCustomerPhone={
                setCustomerPhone
              }
              notes={notes}
              setNotes={setNotes}
            />
          </div>

          {/* Coupon */}
          <div
            className="
              bg-white
              rounded-2xl
              border
              border-[#E7D8C7]
              p-5
              shadow-sm
            "
          >
            <CouponSection
              merchantId={merchantId}
              subtotal={subtotal}
              onCouponApplied={(coupon) => {
                setAppliedCoupon(coupon);
                setDiscountAmount(
                  coupon.discountAmount
                );
              }}
              onCouponRemoved={() => {
                setAppliedCoupon(null);
                setDiscountAmount(0);
              }}
            />
          </div>

          {/* Payment Method */}
          <div
            className="
              bg-white
              rounded-2xl
              border
              border-[#E7D8C7]
              p-5
              shadow-sm
            "
          >
            <PaymentMethod
              payMode={payMode}
              setPayMode={setPayMode}
            />
          </div>

          {/* Bill Summary */}
          <div
            className="
              bg-white
              rounded-2xl
              border
              border-[#E7D8C7]
              p-5
              shadow-sm
            "
          >
            <BillSummary
              taxConfig={taxConfig}
              discountAmount={discountAmount}
              couponCode={
                appliedCoupon?.code || ""
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            border-t
            border-[#E7D8C7]
            bg-[#F8F3ED]
            p-5
          "
        >
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            style={{
              WebkitTapHighlightColor:
                "transparent",
            }}
            className="
              w-full
              py-4
              rounded-2xl
              font-semibold
              text-white
              bg-[#6F4E37]
              hover:bg-[#5A3E2B]
              transition-colors
              duration-200
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
              select-none
              appearance-none
              outline-none
              focus:outline-none
              focus:ring-0
              focus-visible:outline-none
              focus-visible:ring-0
            "
          >
            {loading
              ? "Processing..."
              : payMode === "digital"
              ? "Pay & Place Order"
              : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;