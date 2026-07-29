import { useState } from 'react';
import { useSelector } from 'react-redux';

function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);

const [customerName, setCustomerName] = useState("");

const [phoneNumber, setPhoneNumber] = useState("");

const [specialInstructions, setSpecialInstructions] = useState("");

const [paymentMethod, setPaymentMethod] = useState("");



  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;

  
const handlePlaceOrder = () => {
  if (customerName.trim() === "") {
    alert("Customer Name is required");
    return;
  }

  if (phoneNumber.trim() === "") {
    alert("Phone Number is required");
    return;
  }

  if (phoneNumber.trim().length !== 10 || !/^\d+$/.test(phoneNumber.trim())) {
    alert("Phone Number must be exactly10 digits");
    return;
  }

  if (paymentMethod.trim() === "") {
    alert("Payment Method is required");
    return;
  }

  const order = {
    cartItems,
    subtotal,
    gst,
    grandTotal,
    customerName,
    phoneNumber,
    specialInstructions,
    paymentMethod,
  };

  console.log(order);

};


  return (
    <>
    
      <h1>Checkout Page</h1>

      {/* Order Summary */}
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
              <p>Quantity: {item.quantity}</p>
              <p>Total: ₹{item.price * item.quantity}</p>
            </div>
          ))}


          {/* Billing */}
          <h2>Subtotal: ₹{subtotal.toFixed(2)}</h2>
          <h2>GST (5%): ₹{gst.toFixed(2)}</h2>
          <h2>Grand Total: ₹{grandTotal.toFixed(2)}</h2>

       
      {/* Customer Details */}
      <label>Customer Name</label>
      <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter your Name" />
      <label>Phone Number</label>
      <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter your Phone Number" />
      <label>Special Instructions</label>
      <textarea  value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} placeholder="Enter any special instructions" />
      <label>Payment Method</label>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="">Select Payment Method</option>
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="upi">UPI</option>
      </select>

      <button onClick={handlePlaceOrder}>
        Place Order
      </button>
        </>
      )}

    
    </>


    
  );
}

export default CheckoutPage;