import {useSelector} from "react-redux";



function BottomCart({onProceed}) {
    
  const cartItems = useSelector((state) => state.cart.items);
  

  if (cartItems.length === 0) {
    return null;
  }
const totalItems = cartItems.reduce((total, item) => {
  return total + item.quantity;
}, 0);

const totalPrice = cartItems.reduce((total, item) => {
  return total + item.price * item.quantity;
}, 0);

  return (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
    <div className="max-w-3xl mx-auto flex justify-between items-center">
      <div>
        <p className="font-semibold">
          🛒 {totalItems} {totalItems === 1 ? "Item" : "Items"}
        </p>

        <p className="text-green-600 font-bold">
          ₹{totalPrice}
        </p>
      </div>

      <button
        onClick={onProceed}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Proceed →
      </button>
    </div>
  </div>
);
}

export default BottomCart;