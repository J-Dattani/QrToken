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

  const isOutOfStock = product.stock === 0;

  return (
    <div
      className={`
        group
        mb-5
        overflow-hidden
        rounded-3xl
        border
        p-5
        transition-all
        duration-300
        ${
          isOutOfStock
            ? `
              border-gray-300
              bg-gray-100
              opacity-70
            `
            : `
              border-[#E7D8C7]
              bg-[#FFF9F4]
              shadow-sm
              hover:-translate-y-0.5
              hover:border-[#D8B89A]
              hover:shadow-lg
            `
        }
      `}
    >
      <div className="flex justify-between gap-5">

        {/* Left */}
        <div className="min-w-0 flex-1">

          {/* Veg / Non-Veg */}
          <div className="mb-3 flex items-center gap-2">

            <div
              className={`
                h-4
                w-4
                rounded-full
                border-2
                ${
                  isOutOfStock
                    ? "border-gray-400 bg-gray-400"
                    : product.isVeg
                    ? "border-green-600 bg-green-600"
                    : "border-red-600 bg-red-600"
                }
              `}
            />

            <span
              className={`
                text-sm
                font-semibold
                ${
                  isOutOfStock
                    ? "text-gray-500"
                    : product.isVeg
                    ? "text-green-700"
                    : "text-red-700"
                }
              `}
            >
              {product.isVeg ? "Veg" : "Non-Veg"}
            </span>

          </div>

          {/* Name */}
          <h3
            className={`
              text-xl
              font-bold
              tracking-tight
              ${
                isOutOfStock
                  ? "text-gray-500"
                  : "text-[#2D1F18]"
              }
            `}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p
            className={`
              mt-2
              max-w-xl
              text-sm
              leading-6
              ${
                isOutOfStock
                  ? "text-gray-400"
                  : "text-gray-600"
              }
            `}
          >
            {product.description}
          </p>

        </div>

        {/* Right */}
        <div
          className="
            flex
            min-w-[110px]
            shrink-0
            flex-col
            items-end
            justify-between
            gap-3
          "
        >

          {/* Image */}
          {product.image && (
            <div className="relative">

              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className={`
                  h-24
                  w-24
                  rounded-2xl
                  object-cover
                  shadow-sm
                  transition-transform
                  duration-300
                  ${
                    isOutOfStock
                      ? "grayscale opacity-50"
                      : "group-hover:scale-[1.03]"
                  }
                `}
              />

              {isOutOfStock && (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    bg-black/10
                  "
                >
                  <span
                    className="
                      rounded-full
                      bg-gray-600/90
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wide
                      text-white
                    "
                  >
                    Sold Out
                  </span>
                </div>
              )}

            </div>
          )}

          {/* Price */}
          <p
            className={`
              text-2xl
              font-extrabold
              tracking-tight
              ${
                isOutOfStock
                  ? "text-gray-400"
                  : "text-[#C68E17]"
              }
            `}
          >
            ₹{product.price}
          </p>

          {/* Add / Quantity */}
          {isOutOfStock ? (

            <span
              className="
                rounded-full
                bg-gray-400
                px-4
                py-2
                text-sm
                font-semibold
                text-white
              "
            >
              Out of Stock
            </span>

          ) : cartItem ? (

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
              className="
                rounded-full
                bg-[#6F4E37]
                px-5
                py-2
                text-sm
                font-semibold
                text-white
                shadow-md
                transition-all
                duration-200
                hover:scale-[1.03]
                hover:bg-[#5A3E2B]
                hover:shadow-lg
                active:scale-95
                cursor-pointer
              "
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