import { useSelector, useDispatch } from "react-redux";
import QuantityStepper from "../components/menu/QuantityStepper";
import {
  increaseItemQuantity,
  decreaseItemQuantity,
} from "../redux/slices/cartSlice";

function CartPage() {
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const dispatch = useDispatch();

  return (
    <>
      {cartItems.length === 0 ? (
        <div>
          <h2>Your cart is empty</h2>
          <p>Add some items from the menu.</p>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>

              <QuantityStepper
                quantity={item.quantity}
                onIncrease={() =>
                  dispatch(increaseItemQuantity(item.id))
                }
                onDecrease={() =>
                  dispatch(decreaseItemQuantity(item.id))
                }
              />

              <p>Item Total: ₹{item.price * item.quantity}</p>
            </div>
          ))}

          <h2>Subtotal: ₹{subtotal}</h2>
        </>
      )}
    </>
  );
}

export default CartPage;