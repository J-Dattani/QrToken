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
    state.cart.items.find((item) => item.id === product.id)
  );

        return (
            <div className="menu-item">
                <span className={`veg-indicator ${product.isVeg ? 'veg' : 'non-veg'}`}></span>
                    <h3 className="menu-item-name">{product.name}</h3>
                    <p className="menu-item-desc">{product.description}</p>
                    <p className="menu-item-price">₹{product.price}</p>
              
              {cartItem ? (
                <QuantityStepper
                  quantity={cartItem.quantity}
                  onDecrease={() => dispatch(decreaseItemQuantity(cartItem.id))}
                  onIncrease={() => dispatch(increaseItemQuantity(cartItem.id))}
                />
              ) : (
                <button onClick={() => dispatch(addItem(product))} className="add-to-cart-btn">
                  Add to Cart
                </button>
              )}
            </div>
        )           

    }
    export default MenuItem;