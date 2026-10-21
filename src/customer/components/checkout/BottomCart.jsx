import { useSelector } from "react-redux";
import { ShoppingCart, ArrowRight } from "lucide-react";

function BottomCart({ onProceed }) {
  const cartItems = useSelector((state) => state.cart.items);

  if (cartItems.length === 0) return null;

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
  bottom-4
  left-1/2
  -translate-x-1/2
  w-[calc(100%-2rem)]
  max-w-3xl
  z-50
  pointer-events-none
"
    >
      <div
        className="
          pointer-events-auto
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-gradient-to-r
          from-[#6F4E37]
          via-[#8B5E3C]
          to-[#C68E17]
      px-3 py-2 sm:px-4 sm:py-2.5
          shadow-[0_-8px_30px_rgba(111,78,55,0.25)]
          backdrop-blur-xl
        "
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            <div
             className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/15"
            >
              <ShoppingCart
                size={21}
                strokeWidth={2.2}
                className="text-white"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-white/75 sm:text-sm">
                {totalItems} {totalItems === 1 ? "Item" : "Items"} in cart
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
  flex shrink-0 items-center gap-1.5
  rounded-xl bg-white
  px-3 py-2
  text-xs font-bold text-[#6F4E37]
  shadow-md transition
  hover:bg-[#FFF9F4]
  active:scale-95
"
          >
            <span>Proceed</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BottomCart;
