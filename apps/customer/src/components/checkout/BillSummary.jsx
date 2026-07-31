import { useSelector } from "react-redux";

function BillSummary() {
  const cartItems = useSelector((state) => state.cart.items);

const subtotal = cartItems.reduce((total, item) => {
  return total + item.price * item.quantity;
}, 0);

const gst = 0; 

const total = subtotal + gst;

  return ( 
     <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Bill Summary</h3>

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="flex justify-between">
        <span>GST</span>
        <span>₹{gst}</span>
      </div>

     

      <hr className="my-3" />

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
}

export default BillSummary;