import { useSelector } from "react-redux";

function BillSummary({
  taxConfig,
  discountAmount = 0,
  couponCode = "",
}) {
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Coupon discount is calculated by backend from subtotal
  const discount = Math.min(discountAmount || 0, subtotal);

  const taxableAmount = subtotal - discount;

  const cgst =
    taxableAmount * ((taxConfig?.cgstPercent || 0) / 100);

  const sgst =
    taxableAmount * ((taxConfig?.sgstPercent || 0) / 100);

  const total = taxableAmount + cgst + sgst;

  return (
    <div>
      {/* Header */}
      <h3 className="mb-5 text-xl font-bold text-[#4B2E1F]">
        Bill Summary
      </h3>

      {/* Breakdown */}
      <div className="space-y-3">

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#6B5A4A]">
            Subtotal
          </span>

          <span className="font-semibold text-[#4B2E1F]">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        {/* Coupon */}
        {discount > 0 && (
          <div className="flex items-center justify-between">

            <div className="flex min-w-0 items-center gap-2">
              <span className="font-medium text-[#6B5A4A]">
                Coupon
              </span>

              {couponCode && (
                <span
                  className="
                    max-w-[160px]
                    truncate
                    rounded-full
                    bg-green-50
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    text-green-700
                  "
                >
                  {couponCode}
                </span>
              )}
            </div>

            <span className="font-semibold text-green-600">
              -₹{discount.toFixed(2)}
            </span>

          </div>
        )}

        {/* CGST */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#6B5A4A]">
            CGST ({taxConfig?.cgstPercent || 0}%)
          </span>

          <span className="font-semibold text-[#4B2E1F]">
            ₹{cgst.toFixed(2)}
          </span>
        </div>

        {/* SGST */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-[#6B5A4A]">
            SGST ({taxConfig?.sgstPercent || 0}%)
          </span>

          <span className="font-semibold text-[#4B2E1F]">
            ₹{sgst.toFixed(2)}
          </span>
        </div>

      </div>

      {/* Divider */}
      <hr className="my-5 border-[#E7D8C7]" />

      {/* Grand Total */}
      <div
        className="
          rounded-2xl
          border
          border-[#E7D8C7]
          bg-[#FFF4E8]
          p-4
          transition-shadow
          duration-200
          hover:shadow-sm
        "
      >
        <div className="flex items-center justify-between gap-4">

          <div className="min-w-0">

            <p className="font-medium text-[#6B5A4A]">
              Grand Total
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Includes applicable GST
            </p>

          </div>

          <span
            className="
              shrink-0
              text-2xl
              font-bold
              tracking-tight
              text-[#6F4E37]
            "
          >
            ₹{total.toFixed(2)}
          </span>

        </div>
      </div>

      {/* Tax note */}
      <p className="mt-4 text-xs leading-5 text-gray-500">
        GST is calculated according to the merchant's
        configured tax rates.
      </p>
    </div>
  );
}

export default BillSummary;