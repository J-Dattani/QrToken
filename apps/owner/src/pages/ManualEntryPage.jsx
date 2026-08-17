import { useMemo, useState } from "react";
import {
  Search,
  Minus,
  Plus,
  Banknote,
  QrCode,
} from "lucide-react";

const categories = [
  "All",
  "Cold Drinks",
  "Snacks",
  "Sweets",
  "Tea & Coffee",
  "drink",
];

const menuItems = [
  { id: 1, name: "Sweet Lassi", category: "Cold Drinks", price: 30 },
  { id: 2, name: "Iced Coffee", category: "Cold Drinks", price: 25 },
  { id: 3, name: "Samosa", category: "Snacks", price: 15 },
  { id: 4, name: "Bun Maska", category: "Snacks", price: 8 },
  { id: 5, name: "Vada Pav", category: "Snacks", price: 20 },
  { id: 6, name: "Jalebi", category: "Sweets", price: 35 },
  { id: 7, name: "Cutting Chai", category: "Tea & Coffee", price: 8 },
  { id: 8, name: "Masala Tea", category: "Tea & Coffee", price: 10 },
  { id: 9, name: "Filter Coffee", category: "Tea & Coffee", price: 15 },
  { id: 10, name: "Diet Coke", category: "drink", price: 55 },
];

function ManualEntryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("takeaway");
  const [selectedTable, setSelectedTable] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + gst;

  const changeAmount = Math.max(
    Number(cashReceived || 0) - total,
    0
  );

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...current,
        {
          ...item,
          quantity: 1,
          note: "",
        },
      ];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + change,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateNote = (id, note) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              note,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedTable("");
    setCashReceived("");
  };

  const selectCashAmount = (amount) => {
    setCashReceived(String(amount));
  };

  const logOrder = () => {
    if (cart.length === 0) {
      alert("Please select at least one item.");
      return;
    }

    if (orderType === "dinein" && !selectedTable) {
      alert("Please select a table.");
      return;
    }

    if (paymentMethod === "cash") {
      const received = Number(cashReceived);

      if (!received) {
        alert(`Please enter cash received.`);
        return;
      }

      if (received < total) {
        alert(`Cash received must be at least ₹${total}.`);
        return;
      }
    }

    const orderData = {
      orderType,
      selectedTable:
        orderType === "dinein" ? selectedTable : null,
      items: cart,
      subtotal,
      gst,
      total,
      paymentMethod,
      cashReceived:
        paymentMethod === "cash"
          ? Number(cashReceived)
          : null,
      change:
        paymentMethod === "cash"
          ? changeAmount
          : 0,
    };

    console.log("Order logged:", orderData);

    alert(`Order logged successfully! Total: ₹${total}`);

    setCart([]);
    setSelectedTable("");
    setCashReceived("");
    setPaymentMethod("cash");
    setOrderType("takeaway");
  };

  return (
    <section className="min-h-screen bg-[#F7F3ED] px-6 py-6 lg:px-8">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[25px] font-semibold text-[#241F1A]">
          POS Quick Terminal (Manual Entry)
        </h1>

        <p className="mt-1 text-sm text-[#766A5D]">
          Express walk-up & dine-in counter billing · &lt;10s checkout
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">

        {/* LEFT */}
        <div>

          {/* Search */}
          <div className="mb-3 flex items-center rounded-xl border border-[#E5D8C8] bg-white px-4">

            <Search
              size={18}
              className="mr-2 text-[#7C6F63]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-[#8B8177]"
            />

          </div>

          {/* Categories */}
          <div className="mb-4 flex flex-wrap gap-2">

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "border-[#2B2823] bg-[#2B2823] text-white"
                    : "border-[#E5D8C8] bg-white text-[#5F554B] hover:bg-[#FFF7ED]"
                }`}
              >
                {category}
              </button>
            ))}

          </div>

          {/* Menu */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">

            {filteredItems.map((item) => {

              const cartItem = cart.find(
                (cartItem) =>
                  cartItem.id === item.id
              );

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addToCart(item)}
                  className={`relative min-h-[98px] rounded-xl border bg-white px-3 py-4 text-center transition ${
                    cartItem
                      ? "border-[#E6A23C] bg-[#FFF8EA]"
                      : "border-[#E5D8C8] hover:border-[#E6A23C] hover:bg-[#FFFDF9]"
                  }`}
                >

                  {cartItem && (
                    <span className="absolute -right-1.5 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#D98B18] px-1.5 text-xs font-bold text-[#241B14]">
                      {cartItem.quantity}
                    </span>
                  )}

                  <p className="text-sm font-semibold text-[#211D18]">
                    {item.name}
                  </p>

                  <p className="mt-0.5 text-xs text-[#8A7D70]">
                    {item.category}
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#D47D00]">
                    ₹{item.price}
                  </p>

                </button>
              );
            })}

          </div>

        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-[#E5D8C8] bg-white p-5 shadow-sm">

          {/* Ticket Header */}
          <div className="mb-4 flex items-center justify-between border-b border-[#E5D8C8] pb-3">

            <h2 className="text-base font-bold text-[#2B241E]">
              Current Order Ticket
            </h2>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-[#C83220] hover:underline"
              >
                Clear Cart
              </button>
            )}

          </div>

          {/* Order Type */}
          <div className="mb-4 grid grid-cols-2 rounded-xl bg-[#EEE9DF] p-1">

            <button
              type="button"
              onClick={() =>
                setOrderType("takeaway")
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                orderType === "takeaway"
                  ? "bg-white text-[#2B241E] shadow-sm"
                  : "text-[#766A5D]"
              }`}
            >
              🛍️ Counter Takeaway
            </button>

            <button
              type="button"
              onClick={() =>
                setOrderType("dinein")
              }
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                orderType === "dinein"
                  ? "bg-white text-[#2B241E] shadow-sm"
                  : "text-[#766A5D]"
              }`}
            >
              🍽️ Table Dine-In
            </button>

          </div>

          {/* Table */}
          {orderType === "dinein" && (
            <div className="mb-4">

              <label className="mb-1 block text-sm font-semibold text-[#51483F]">
                Select Table
              </label>

              <select
                value={selectedTable}
                onChange={(e) =>
                  setSelectedTable(e.target.value)
                }
                className="h-10 w-full rounded-lg border border-[#D98B18] bg-white px-3 text-sm font-semibold outline-none"
              >
                <option value="">
                  Select a table
                </option>

                <option value="Table 1">
                  Table 1 (Indoor Main)
                </option>

                <option value="Table 2">
                  Table 2 (Indoor Main)
                </option>

                <option value="Table 3">
                  Table 3 (Indoor Main)
                </option>

                <option value="Table 4">
                  Table 4 (Outdoor)
                </option>

              </select>

            </div>
          )}

          {/* Empty Cart */}
          {cart.length === 0 ? (

            <div className="flex min-h-[330px] flex-col items-center justify-center text-center">

              <p className="text-sm text-[#8A7D70]">
                Tap menu items on the left to add to order
              </p>

              <button
                type="button"
                disabled
                className="mt-10 w-full rounded-xl bg-[#DED7C9] px-4 py-3 text-sm font-bold text-white"
              >
                Select Items to Order
              </button>

            </div>

          ) : (

            <>

              {/* Items */}
              <div className="space-y-3">

                {cart.map((item) => (

                  <div
                    key={item.id}
                    className="border-b border-dashed border-[#E5D8C8] pb-3"
                  >

                    <div className="flex items-center justify-between gap-3">

                      <span className="text-sm font-semibold text-[#302A24]">
                        {item.name}
                      </span>

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              -1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E5D8C8] hover:bg-[#FFF8EA]"
                        >
                          <Minus size={13} />
                        </button>

                        <span className="w-4 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#E5D8C8] hover:bg-[#FFF8EA]"
                        >
                          <Plus size={13} />
                        </button>

                        <span className="ml-3 min-w-[45px] text-right text-sm font-semibold">
                          ₹
                          {item.price *
                            item.quantity}
                        </span>

                      </div>

                    </div>

                    <input
                      value={item.note}
                      onChange={(e) =>
                        updateNote(
                          item.id,
                          e.target.value
                        )
                      }
                      placeholder="Custom note (e.g. less sugar)..."
                      className="mt-1 w-full bg-transparent text-xs text-[#766A5D] outline-none placeholder:text-[#8A8177]"
                    />

                  </div>

                ))}

              </div>

              {/* Totals */}
              <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between text-[#6B6055]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-[#6B6055]">
                  <span>GST (5%)</span>
                  <span>₹{gst}</span>
                </div>

                <div className="flex justify-between border-t border-[#E5D8C8] pt-3 text-base font-bold text-[#241F1A]">

                  <span>Total Amount</span>

                  <span className="text-[#D47D00]">
                    ₹{total}
                  </span>

                </div>

              </div>

              {/* Payment */}
              <div className="mt-4 grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("cash")
                  }
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-bold transition ${
                    paymentMethod === "cash"
                      ? "border-[#D98B18] bg-[#FFF3D9] text-[#B96F00]"
                      : "border-[#E5D8C8] bg-white text-[#51483F] hover:bg-[#FFF8EA]"
                  }`}
                >
                  <Banknote size={14} />
                  Cash at Counter
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-bold transition ${
                    paymentMethod === "upi"
                      ? "border-[#D98B18] bg-[#FFF3D9] text-[#B96F00]"
                      : "border-[#E5D8C8] bg-white text-[#51483F] hover:bg-[#FFF8EA]"
                  }`}
                >
                  <QrCode size={14} />
                  Counter UPI QR
                </button>

              </div>

              {/* Cash */}
              {paymentMethod === "cash" && (
                <div className="mt-3 rounded-xl bg-[#EEE9DF] p-3">

                  <p className="mb-2 text-xs font-bold text-[#645A50]">
                    QUICK CASH TENDERED
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {[total, 50, 100, 200, 500].map(
                      (amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() =>
                            selectCashAmount(
                              amount
                            )
                          }
                          className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                            Number(cashReceived) ===
                            amount
                              ? "border-[#D98B18] bg-[#FFF3D9] text-[#B96F00]"
                              : "border-[#D9D0C2] bg-white text-[#302A24] hover:border-[#D98B18] hover:bg-[#FFF8EA]"
                          }`}
                        >
                          ₹{amount}
                        </button>
                      )
                    )}

                  </div>

                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) =>
                      setCashReceived(
                        e.target.value
                      )
                    }
                    placeholder="Cash received ₹"
                    className="mt-2 h-9 w-full rounded-lg border border-[#DDD4C7] bg-white px-3 text-sm outline-none focus:border-[#D98B18]"
                  />

                  {Number(cashReceived) >= total &&
                    Number(cashReceived) > 0 && (
                      <div className="mt-2 flex justify-between text-xs font-semibold text-[#16866D]">
                        <span>Change</span>
                        <span>
                          ₹{changeAmount}
                        </span>
                      </div>
                    )}

                </div>
              )}

              {/* Log Order */}
              <button
                type="button"
                onClick={logOrder}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#282521] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1D1B18]"
              >
                Log Order — ₹{total}
              </button>

            </>
          )}

        </div>

      </div>

    </section>
  );
}

export default ManualEntryPage;