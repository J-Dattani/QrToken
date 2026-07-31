import { useSelector } from "react-redux";

function OrderSummary() {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <div>
      <h3>Order Summary</h3>
      {cartItems.map((item) => (
        <div key={item._id}>
            <h4>{item.name}</h4>
          <p>₹{item.price} × {item.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderSummary;