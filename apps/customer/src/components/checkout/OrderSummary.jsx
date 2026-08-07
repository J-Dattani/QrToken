import { useSelector } from "react-redux";

function OrderSummary() {
  const cartItems = useSelector((state) => state.cart.items);

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // const subtotal = cartItems.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // );

  return (
    <div>
      {/* Heading */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold text-[#4B2E1F]">
          Order Summary
        </h3>

        <span className="text-sm font-medium bg-[#FFF4E6] text-[#8B4513] px-3 py-1 rounded-full">
          {totalItems} {totalItems === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center pb-3 border-b border-[#EFE2D4] last:border-none"
          >
            <div>
              <h4 className="font-semibold text-[#4B2E1F]">
                {item.name}
              </h4>

              <p className="text-sm text-gray-500">
                ₹{item.price} × {item.quantity}
              </p>
            </div>

            <p className="font-bold text-[#C88A13]">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      {/* <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#E7D8C7]">
        <span className="text-lg font-semibold text-[#4B2E1F]">
          Subtotal
        </span>

        <span className="text-xl font-bold text-[#6F4E37]">
          ₹{subtotal}
        </span>
      </div> */}
    </div>
  );
}

export default OrderSummary;