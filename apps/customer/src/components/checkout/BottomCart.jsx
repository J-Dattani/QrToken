import { useSelector } from "react-redux";
import { ShoppingCart, ArrowRight } from "lucide-react";

function BottomCart({ onProceed }) {
  const cartItems = useSelector((state) => state.cart.items);

  if (cartItems.length === 0) {
    return null;
  }

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        px-3
        pb-3
        sm:px-4
        sm:pb-4
        pointer-events-none
      "
    >
      <div className="mx-auto max-w-5xl">

        <div
          className="
            pointer-events-auto
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-gradient-to-r
            from-[#6F4E37]
            via-[#8B5E3C]
            to-[#C68E17]
            p-3
            shadow-[0_-8px_30px_rgba(111,78,55,0.25)]
            backdrop-blur-xl
            sm:p-4
          "
        >
          <div className="flex items-center justify-between gap-3">

            {/* Left */}
            <div className="flex min-w-0 items-center gap-3">

              {/* Cart Icon */}
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/15
                  shadow-sm
                  backdrop-blur-md
                  sm:h-12
                  sm:w-12
                "
              >
                <ShoppingCart
                  size={21}
                  strokeWidth={2.2}
                  className="text-white"
                />
              </div>

              {/* Details */}
              <div className="min-w-0">

                <p className="text-xs font-medium text-white/75 sm:text-sm">
                  {totalItems}{" "}
                  {totalItems === 1 ? "Item" : "Items"} in cart
                </p>

                <p className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                  ₹{totalPrice.toFixed(2)}
                </p>

              </div>
            </div>

            {/* Right */}
            <button
              type="button"
              onClick={onProceed}
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-2xl
                bg-white
                px-4
                py-3
                text-sm
                font-bold
                text-[#6F4E37]
                shadow-md
                transition-all
                duration-200
                hover:scale-[1.03]
                hover:bg-[#FFF9F4]
                hover:shadow-lg
                active:scale-95
                cursor-pointer
                sm:px-5
              "
            >
              <span>Proceed</span>

              <ArrowRight
                size={18}
                strokeWidth={2.5}
              />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default BottomCart;