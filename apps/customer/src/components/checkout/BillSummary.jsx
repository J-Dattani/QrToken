import { useSelector } from "react-redux";

function BillSummary({ taxConfig }) {
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const cgst = subtotal * ((taxConfig?.cgstPercent || 0) / 100);
  const sgst = subtotal * ((taxConfig?.sgstPercent || 0) / 100);
  const total = subtotal + cgst + sgst;

  return (
    <div>
      <h3 className="text-xl font-bold text-[#4B2E1F] mb-5">
        Bill Summary
      </h3>

      <div className="space-y-3">

        <div className="flex justify-between items-center">
          <span className="text-[#6B5A4A] font-medium">
            Subtotal
          </span>

          <span className="font-semibold text-[#4B2E1F]">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#6B5A4A] font-medium">
            CGST ({taxConfig?.cgstPercent || 0}%)
          </span>

          <span className="font-semibold text-[#4B2E1F]">
            ₹{cgst.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[#6B5A4A] font-medium">
            SGST ({taxConfig?.sgstPercent || 0}%)
          </span>

          <span className="font-semibold text-[#4B2E1F]">
            ₹{sgst.toFixed(2)}
          </span>
        </div>

      </div>

      <hr className="my-5 border-[#E7D8C7]" />

      <div className="rounded-2xl bg-[#FFF4E8] border border-[#E7D8C7] p-4">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-[#6B5A4A] font-medium">
              Grand Total
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Includes applicable GST
            </p>
          </div>

          <span className="text-2xl font-bold text-[#6F4E37]">
            ₹{total.toFixed(2)}
          </span>

        </div>

      </div>

      <p className="text-xs text-gray-500 mt-4">
        GST is calculated according to the merchant's configured tax rates.
      </p>
    </div>
  );
}

export default BillSummary;