import { useDispatch, useSelector } from "react-redux";

import {
  addItem,
  increaseItemQuantity,
  decreaseItemQuantity,
} from "../../redux/slices/cartSlice";

import QuantityStepper from "./QuantityStepper";

    function MenuItem({ product }) {
        const dispatch = useDispatch();

          const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item._id === product._id)
  );

    return (
  <div className="group mb-5 rounded-3xl border border-orange-100 bg-[#FFF9F4] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

    <div className="flex justify-between gap-5">

      {/* Left */}
      <div className="flex-1">

        <div className="flex items-center gap-2 mb-3">

          <div
            className={`h-4 w-4 rounded-full border-2 ${
              product.isVeg
                ? "border-green-600 bg-green-600"
                : "border-red-600 bg-red-600"
            }`}
          />

          <span
            className={`text-sm font-semibold ${
              product.isVeg
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {product.isVeg ? "Veg" : "Non-Veg"}
          </span>

        </div>

        <h3 className="text-xl font-bold text-[#2D1F18]">
          {product.name}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {product.description}
        </p>

      </div>

      {/* Right */}
      <div className="flex min-w-[110px] flex-col items-end justify-between">

        <p className="text-2xl font-extrabold text-[#C68E17]">
          ₹{product.price}
        </p>

        {cartItem ? (
          <QuantityStepper
            quantity={cartItem.quantity}
            onDecrease={() =>
              dispatch(decreaseItemQuantity(cartItem._id))
            }
            onIncrease={() =>
              dispatch(increaseItemQuantity(cartItem._id))
            }
          />
        ) : (
          <button
            onClick={() => dispatch(addItem(product))}
            className="rounded-full bg-[#6F4E37] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#5A3E2B] hover:scale-105 cursor-pointer"
          >
            + Add
          </button>
        )}

      </div>

    </div>

  </div>
);          

    }
    export default MenuItem;