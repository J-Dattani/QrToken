function OrderSummaryCard({ order }) {
  return (
    <div className="bg-white rounded-2xl border shadow-md p-6">

      <h2 className="text-xl font-semibold mb-5">
        Order Summary
      </h2>

      <div className="space-y-3">

        {order.items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between"
          >
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

      </div>

      <hr className="my-5" />

      <div className="space-y-2">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{order.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">
            ₹{order.total}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Payment</span>
          <span className="capitalize">
            {order.payMode}
          </span>
        </div>

<div className="flex justify-between items-center">
  <span>Payment Status</span>

  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${
      order.paymentStatus === "paid"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {order.paymentStatus}
  </span>
</div>

      </div>

    </div>
  );
}

export default OrderSummaryCard;