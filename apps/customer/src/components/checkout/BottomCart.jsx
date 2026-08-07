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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">

      <div className="mx-auto max-w-5xl">

        <div className="rounded-3xl bg-gradient-to-r from-[#6F4E37] via-[#8B5E3C] to-[#C68E17] p-4 shadow-[0_-8px_30px_rgba(111,78,55,0.25)]">

          <div className="flex items-center justify-between">

            {/* Left */}
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <ShoppingCart size={22} className="text-white" />
              </div>

              <div>
                <p className="text-sm text-white/80">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </p>

                <p className="text-2xl font-bold text-white">
                  ₹{totalPrice}
                </p>
              </div>

            </div>

            {/* Right */}
            <button
              onClick={onProceed}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#6F4E37] shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Proceed

              <ArrowRight size={18} />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BottomCart;