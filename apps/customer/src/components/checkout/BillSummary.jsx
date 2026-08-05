import { useSelector } from "react-redux";

function BillSummary({ taxConfig }) {
  const cartItems = useSelector((state) => state.cart.items);

const subtotal = cartItems.reduce((total, item) => {
  return total + item.price * item.quantity;
}, 0);

const cgst = subtotal * ((taxConfig?.cgstPercent || 0) / 100);
const sgst = subtotal * ((taxConfig?.sgstPercent || 0) / 100);
const total = subtotal + sgst + cgst;


  return ( 
     <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Bill Summary</h3>

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
  <span>CGST ({taxConfig?.cgstPercent || 0}%)</span>
  <span>₹{cgst.toFixed(2)}</span>
</div>

<div className="flex justify-between">
  <span>SGST ({taxConfig?.sgstPercent || 0}%)</span>
  <span>₹{sgst.toFixed(2)}</span>
</div>

     

      <hr className="my-3" />

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default BillSummary;