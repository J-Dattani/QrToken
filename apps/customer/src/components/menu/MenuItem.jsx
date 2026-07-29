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
      <div className="flex justify-between items-start py-4 border-b border-gray-200">
          <div className="flex-1 pr-4">
  <span className={`veg-indicator ${product.isVeg ? "veg" : "non-veg"}`}></span>

  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>

  <p className="text-sm text-gray-500 mt-1">{product.description}</p>
</div>

<div className="flex flex-col items-end gap-2">
  <p className="text-lg font-bold text-green-600">₹{product.price}</p>

  {cartItem ? (
    <QuantityStepper
      quantity={cartItem.quantity}
      onDecrease={() => dispatch(decreaseItemQuantity(cartItem._id))}
      onIncrease={() => dispatch(increaseItemQuantity(cartItem._id))}
    />
  ) : (
    <button
      onClick={() => dispatch(addItem(product))}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
    >
      Add to Cart
    </button>
  )}
</div>
          </div>
        )           

    }
    export default MenuItem;