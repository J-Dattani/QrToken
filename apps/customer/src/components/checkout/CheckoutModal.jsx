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
import {
  saveActiveOrder,
  saveOrderHistory,
} from "../../services/sessionStorage";
import OrderSuccess from "../tracking/OrderSuccess";


function CheckoutModal({ isOpen, onClose, merchantId, merchantSlug, taxConfig }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  
  const [notes, setNotes] = useState("");
  const [payMode, setPayMode] = useState("cash");
  const cartItems = useSelector((state) => state.cart.items);   
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
const [placedOrderId, setPlacedOrderId] = useState(null);
  const handlePlaceOrder = async () => {
    console.log({
  customerName,
  customerPhone,
  notes,
});
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!customerPhone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (customerPhone.length !== 10 || !/^\d+$/.test(customerPhone)) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (payMode === "online") {
      alert("Digital Payment Coming Soon");
      return;
    }

    const payload = {
      merchantId,
      payMode,
      customerName,
      customerPhone,
      notes,
      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        price: item.price,
        name: item.name,
      })),
    };

    try {
      setLoading(true);

const response = await api.post("/orders", payload);

const order = response.data.order;

// Save active order
saveActiveOrder({
  orderId: order._id,
  tokenNumber: order.tokenNumber,
  merchantSlug,
  status: order.status,
  paymentStatus: order.paymentStatus,
  createdAt: order.createdAt,
});

// Save order history
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
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  if (showSuccess) {
    return (
      <OrderSuccess
        orderId={placedOrderId}
        />
    );}


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3"></div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Checkout
            </h2>

           <button
  onClick={onClose}
  disabled={loading}
  className="text-2xl text-gray-500 hover:text-black disabled:opacity-50"
>
  ×
</button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-32">

<div className="bg-white rounded-xl border p-4 shadow-sm">
          <OrderSummary />
</div>

<div className="bg-white rounded-xl border p-4 shadow-sm">
          <CustomerDetails
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            notes={notes}
            setNotes={setNotes}
          />
</div>

<div className="bg-white rounded-xl border p-4 shadow-sm">
          <CouponSection />
          </div>

          <div className="bg-white rounded-xl border p-4 shadow-sm">
          <PaymentMethod
            payMode={payMode}
            setPayMode={setPayMode}
          />
          </div>

          <div className="bg-white rounded-xl border p-4 shadow-sm">
          <BillSummary taxConfig={taxConfig} />
          </div>

        </div>

        {/* Footer */}
        <div className="border-t bg-white p-4">
       <button
  onClick={handlePlaceOrder}
  disabled={loading || payMode === "online"}
  className={`w-full py-3 rounded-xl font-semibold transition ${
    payMode === "online"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700 text-white"
  }`}
>
  {loading
    ? "Placing Order..."
    : payMode === "online"
    ? "Digital Payment Coming Soon"
    : "Place Order"}
</button>
        </div>

      </div>
    </div>
  );
}

export default CheckoutModal;