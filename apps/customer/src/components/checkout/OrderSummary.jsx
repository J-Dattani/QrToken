import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Trash2 } from "lucide-react";

import {
  increaseItemQuantity,
  decreaseItemQuantity,
} from "../../redux/slices/cartSlice";

function OrderSummary() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#4B2E1F]">
          Order Summary
        </h3>

        <span
          className="
            rounded-full
            border
            border-[#E7D8C7]
            bg-[#FFF4E8]
            px-3
            py-1
            text-sm
            font-medium
            text-[#6F4E37]
          "
        >
          {cartItems.length}{" "}
          {cartItems.length === 1 ? "Item" : "Items"}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-4">

        {cartItems.map((item) => (
          <div
            key={item._id}
            className="
              flex
              items-center
              justify-between
              gap-4
              border-b
              border-[#F2E7DA]
              pb-4
              last:border-none
              last:pb-0
            "
          >

            {/* Product */}
            <div className="flex min-w-0 items-center gap-3">

              {/* Image */}
              <div
                className="
                  h-16
                  w-16
                  shrink-0
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E7D8C7]
                  bg-[#F8F3ED]
                  shadow-sm
                "
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-300
                      hover:scale-105
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      text-xs
                      font-medium
                      text-[#B49A87]
                    "
                  >
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="min-w-0">

                <p className="truncate font-semibold text-[#4B2E1F]">
                  {item.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  ₹{item.price} × {item.quantity}
                </p>

              </div>
            </div>

            {/* Quantity + Price */}
            <div className="flex shrink-0 items-center gap-3 sm:gap-4">

              {/* Quantity Controls */}
              <div
                className="
                  flex
                  items-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#E7D8C7]
                  bg-[#F8F3ED]
                  shadow-sm
                "
              >

                {/* Decrease / Remove */}
                <button
                  type="button"
                  onClick={() =>
                    dispatch(decreaseItemQuantity(item._id))
                  }
                  aria-label={
                    item.quantity === 1
                      ? `Remove ${item.name}`
                      : `Decrease ${item.name} quantity`
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    text-[#6F4E37]
                    transition-all
                    duration-150
                    hover:bg-[#FFF4E8]
                    hover:text-[#5A3E2B]
                    active:scale-90
                    cursor-pointer
                  "
                >
                  {item.quantity === 1 ? (
                    <Trash2 size={15} strokeWidth={2.2} />
                  ) : (
                    <Minus size={16} strokeWidth={2.2} />
                  )}
                </button>

                {/* Quantity */}
                <span
                  className="
                    flex
                    min-w-8
                    items-center
                    justify-center
                    text-sm
                    font-bold
                    text-[#4B2E1F]
                  "
                >
                  {item.quantity}
                </span>

                {/* Increase */}
                <button
                  type="button"
                  onClick={() =>
                    dispatch(increaseItemQuantity(item._id))
                  }
                  aria-label={`Increase ${item.name} quantity`}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    text-[#6F4E37]
                    transition-all
                    duration-150
                    hover:bg-[#FFF4E8]
                    hover:text-[#5A3E2B]
                    active:scale-90
                    cursor-pointer
                  "
                >
                  <Plus size={16} strokeWidth={2.2} />
                </button>

              </div>

              {/* Total */}
              <span
                className="
                  min-w-[55px]
                  text-right
                  font-bold
                  text-[#6F4E37]
                "
              >
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default OrderSummary;