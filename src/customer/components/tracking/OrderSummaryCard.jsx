import {
  Receipt,
  CreditCard,
  CircleCheck,
  CircleDollarSign,
  Tag,
} from "lucide-react";

function OrderSummaryCard({ order }) {
  // -----------------------------------------
  // Safe values
  // -----------------------------------------

  const subtotal = Number(order?.subtotal || 0);
  const total = Number(order?.total || 0);
  const discountAmount = Number(order?.discountAmount || 0);

  const couponCode = order?.couponCode || "";

  // -----------------------------------------
  // Tax calculation
  //
  // Total is treated as GST-inclusive.
  // GST = 5% total:
  // CGST = 2.5%
  // SGST = 2.5%
  // -----------------------------------------

  const taxableAmount = total / 1.05;

  const cgst = taxableAmount * 0.025;
  const sgst = taxableAmount * 0.025;

  // -----------------------------------------
  // Payment method
  // -----------------------------------------

  const normalizedPayMode = String(
    order?.payMode || ""
  ).toLowerCase();

  let paymentLabel = "Cash";

  if (
    normalizedPayMode === "digital" ||
    normalizedPayMode === "online" ||
    normalizedPayMode === "upi" ||
    normalizedPayMode === "razorpay" ||
    normalizedPayMode === "phonepe" ||
    normalizedPayMode === "paytm"
  ) {
    paymentLabel = "Digital";
  }

  // -----------------------------------------
  // Payment status
  // -----------------------------------------

  const paymentStatus =
    order?.paymentStatus || "pending";

  const isPaid =
    String(paymentStatus).toLowerCase() === "paid";

  return (
    <div className="rounded-3xl border border-[#E7D8C7] bg-white p-6 shadow-sm">

      {/* ------------------------------------- */}
      {/* Header */}
      {/* ------------------------------------- */}

      <div className="mb-6 flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4E8]">
          <Receipt
            size={22}
            className="text-[#6F4E37]"
          />
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

      {/* ------------------------------------- */}
      {/* Items */}
      {/* ------------------------------------- */}

      <div className="space-y-4">

        {order?.items?.map((item, index) => (

          <div
            key={item?._id || index}
            className="
              flex
              items-center
              justify-between
              border-b
              border-[#F2E7DA]
              pb-3
              last:border-none
            "
          >

            <div>

              <p className="font-semibold text-[#4B2E1F]">
                {item.name}
              </p>

              <p className="text-sm text-gray-500">
                ₹{Number(item.price || 0).toFixed(2)}
                {" × "}
                {item.quantity}
              </p>

            </div>

            <span className="font-bold text-[#6F4E37]">
              ₹
              {(
                Number(item.price || 0) *
                Number(item.quantity || 0)
              ).toFixed(2)}
            </span>

          </div>

        ))}

      </div>

      {/* ------------------------------------- */}
      {/* Divider */}
      {/* ------------------------------------- */}

      <hr className="my-6 border-[#E7D8C7]" />

      {/* ------------------------------------- */}
      {/* Billing */}
      {/* ------------------------------------- */}

      <div className="space-y-4">

        {/* Subtotal */}

        <div className="flex justify-between">

          <span className="text-[#6B5A4A]">
            Subtotal
          </span>

          <span className="font-semibold">
            ₹{subtotal.toFixed(2)}
          </span>

        </div>

        {/* Coupon */}

        {discountAmount > 0 && (

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Tag
                size={17}
                className="text-green-600"
              />

              <div>

                <span className="text-[#6B5A4A]">
                  Coupon Discount
                </span>

                {couponCode && (
                  <span className="ml-2 rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                    {couponCode}
                  </span>
                )}

              </div>

            </div>

            <span className="font-semibold text-green-600">
              -₹{discountAmount.toFixed(2)}
            </span>

          </div>

        )}

        {/* Taxable Amount */}

        <div className="flex justify-between">

          <span className="text-[#6B5A4A]">
            Taxable Amount
          </span>

          <span className="font-semibold">
            ₹{taxableAmount.toFixed(2)}
          </span>

        </div>

        {/* CGST */}

        <div className="flex justify-between">

          <span className="text-[#6B5A4A]">
            CGST @ 2.5%
          </span>

          <span className="font-semibold text-gray-600">
            ₹{cgst.toFixed(2)}
          </span>

        </div>

        {/* SGST */}

        <div className="flex justify-between">

          <span className="text-[#6B5A4A]">
            SGST @ 2.5%
          </span>

          <span className="font-semibold text-gray-600">
            ₹{sgst.toFixed(2)}
          </span>

        </div>

        {/* --------------------------------- */}
        {/* Grand Total */}
        {/* --------------------------------- */}

        <div className="flex items-center justify-between rounded-xl bg-[#FFF4E8] p-4">

          <span className="text-lg font-semibold text-[#4B2E1F]">
            Grand Total
          </span>

          <span className="text-2xl font-bold text-[#6F4E37]">
            ₹{total.toFixed(2)}
          </span>

        </div>

      </div>

      {/* ------------------------------------- */}
      {/* Payment */}
      {/* ------------------------------------- */}

      <div className="mt-6 space-y-3">

        {/* Payment Method */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <CreditCard
              size={18}
              className="text-[#6F4E37]"
            />

            <span className="text-[#6B5A4A]">
              Payment Method
            </span>

          </div>

          <span className="font-semibold">
            {paymentLabel}
          </span>

        </div>

        {/* Payment Status */}

        <div className="flex items-center justify-between">

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
            className={`
              rounded-full
              px-3
              py-1
              text-sm
              font-semibold
              ${
                isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            `}
          >
            {isPaid ? "Paid" : "Pending"}
          </span>

        </div>

      </div>

      {/* ------------------------------------- */}
      {/* Footer */}
      {/* ------------------------------------- */}

      <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#F8F3ED] p-4">

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