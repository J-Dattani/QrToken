import {
  Receipt,
  CreditCard,
  CircleCheck,
  CircleDollarSign,
} from "lucide-react";

function OrderSummaryCard({ order }) {
  return (
    <div className="rounded-3xl border border-[#E7D8C7] bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4E8]">
          <Receipt size={22} className="text-[#6F4E37]" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#4B2E1F]">
            Order Summary
          </h2>

          <p className="text-sm text-gray-500">
            Review your order details
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">

        {order.items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center border-b border-[#F2E7DA] pb-3 last:border-none"
          >
            <div>
              <p className="font-semibold text-[#4B2E1F]">
                {item.name}
              </p>

              <p className="text-sm text-gray-500">
                ₹{item.price} × {item.quantity}
              </p>
            </div>

            <span className="font-bold text-[#6F4E37]">
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

      </div>

      {/* Divider */}
      <hr className="my-6 border-[#E7D8C7]" />

      {/* Bill */}
      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-[#6B5A4A]">
            Subtotal
          </span>

          <span className="font-semibold">
            ₹{order.subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center rounded-xl bg-[#FFF4E8] p-4">

          <span className="text-lg font-semibold text-[#4B2E1F]">
            Grand Total
          </span>

          <span className="text-2xl font-bold text-[#6F4E37]">
            ₹{order.total.toFixed(2)}
          </span>

        </div>

      </div>

      {/* Payment */}
      <div className="mt-6 space-y-3">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">
            <CreditCard
              size={18}
              className="text-[#6F4E37]"
            />

            <span className="text-[#6B5A4A]">
              Payment Method
            </span>
          </div>

          <span className="capitalize font-semibold">
            {order.payMode}
          </span>

        </div>

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">
            <CircleDollarSign
              size={18}
              className="text-[#6F4E37]"
            />

            <span className="text-[#6B5A4A]">
              Payment Status
            </span>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.paymentStatus === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.paymentStatus === "paid"
              ? "Paid"
              : "Pending"}
          </span>

        </div>

      </div>

      {/* Footer */}
      <div className="mt-6 rounded-xl bg-[#F8F3ED] p-4 flex items-center gap-3">

        <CircleCheck
          size={22}
          className="text-green-600"
        />

        <p className="text-sm text-gray-600">
          Thank you for ordering with us.
        </p>

      </div>

    </div>
  );
}

export default OrderSummaryCard;