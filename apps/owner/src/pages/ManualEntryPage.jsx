import { useMemo, useState } from "react";

import {
  Search,
  Minus,
  Plus,
  Banknote,
  QrCode,
  ShoppingBag,
  Utensils,
  Coffee,
  Cookie,
  IceCreamBowl,
  CupSoda,
  ReceiptText,
  Trash2,
  ArrowRight,
  Check,
  ChevronDown,
  StickyNote,
  ScanLine,
  Sparkles,
  X,
  CircleDollarSign,
  Zap,
  Delete,
} from "lucide-react";

const categories = [
  { label: "All", icon: ScanLine },
  { label: "Tea & Coffee", icon: Coffee },
  { label: "Snacks", icon: Cookie },
  { label: "Cold Drinks", icon: CupSoda },
  { label: "Sweets", icon: IceCreamBowl },
  { label: "drink", icon: CupSoda },
];

const menuItems = [
  {
    id: 1,
    name: "Sweet Lassi",
    category: "Cold Drinks",
    price: 30,
  },
  {
    id: 2,
    name: "Iced Coffee",
    category: "Cold Drinks",
    price: 25,
  },
  {
    id: 3,
    name: "Samosa",
    category: "Snacks",
    price: 15,
  },
  {
    id: 4,
    name: "Bun Maska",
    category: "Snacks",
    price: 8,
  },
  {
    id: 5,
    name: "Vada Pav",
    category: "Snacks",
    price: 20,
  },
  {
    id: 6,
    name: "Jalebi",
    category: "Sweets",
    price: 35,
  },
  {
    id: 7,
    name: "Cutting Chai",
    category: "Tea & Coffee",
    price: 8,
  },
  {
    id: 8,
    name: "Masala Tea",
    category: "Tea & Coffee",
    price: 10,
  },
  {
    id: 9,
    name: "Filter Coffee",
    category: "Tea & Coffee",
    price: 15,
  },
  {
    id: 10,
    name: "Diet Coke",
    category: "drink",
    price: 55,
  },
];

function ManualEntryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [cart, setCart] = useState([]);

  const [orderType, setOrderType] =
    useState("takeaway");
  const [selectedTable, setSelectedTable] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("cash");
  const [cashReceived, setCashReceived] =
    useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [search, selectedCategory]);

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  const gst = Math.round(
    subtotal * 0.05
  );

  const total =
    subtotal + gst;

  const changeAmount = Math.max(
    Number(cashReceived || 0) -
      total,
    0
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const addToCart = (item) => {
    setCart((current) => {
      const existing =
        current.find(
          (cartItem) =>
            cartItem.id === item.id
        );

      if (existing) {
        return current.map(
          (cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    1,
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

  const updateQuantity = (
    id,
    change
  ) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity +
                  change,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  const updateNote = (
    id,
    note
  ) => {
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

  const removeItem = (id) => {
    setCart((current) =>
      current.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedTable("");
    setCashReceived("");
  };

  const selectCashAmount = (
    amount
  ) => {
    setCashReceived(
      String(amount)
    );
  };

  const logOrder = () => {
    if (cart.length === 0) {
      alert(
        "Please select at least one item."
      );
      return;
    }

    if (
      orderType === "dinein" &&
      !selectedTable
    ) {
      alert(
        "Please select a table."
      );
      return;
    }

    if (
      paymentMethod === "cash"
    ) {
      const received =
        Number(cashReceived);

      if (!received) {
        alert(
          "Please enter cash received."
        );
        return;
      }

      if (received < total) {
        alert(
          `Cash received must be at least ₹${total}.`
        );
        return;
      }
    }

    const orderData = {
      orderType,
      selectedTable:
        orderType === "dinein"
          ? selectedTable
          : null,
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

    console.log(
      "Order logged:",
      orderData
    );

    alert(
      `Order logged successfully! Total: ₹${total}`
    );

    setCart([]);
    setSelectedTable("");
    setCashReceived("");
    setPaymentMethod("cash");
    setOrderType("takeaway");
  };

  return (
    <section className="min-h-full bg-[#F7F3ED] px-5 py-5 lg:px-7">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-5 flex items-center justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#282521] text-[#E6A23C] shadow-sm">
            <Zap
              size={17}
              fill="currentColor"
            />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-[20px] font-semibold tracking-[-0.03em] text-[#241F1A]">
                Counter Order
              </h1>

              <span className="hidden rounded-full bg-[#EAF5F1] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#287A66] sm:inline-flex">
                Fast POS
              </span>

            </div>

            <p className="mt-0.5 truncate text-[11px] text-[#8A7E71]">
              Tap products to build the next ticket
            </p>

          </div>

        </div>


        {/* Ticket summary */}

        <div className="hidden items-center gap-2 rounded-xl border border-[#DED3C5] bg-white px-3 py-2 shadow-sm sm:flex">

          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF0D2] text-[#C77C1F]">
            <ShoppingBag size={13} />
          </div>

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.11em] text-[#9B8E80]">
              Current ticket
            </p>

            <p className="text-[11px] font-bold text-[#332D26]">
              {totalItems} items
              <span className="mx-1 text-[#C9BDAE]">
                ·
              </span>
              ₹{total}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <div className="grid min-h-[calc(100vh-120px)] grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_365px]">


        {/* ===================================================
            LEFT — MENU
        =================================================== */}

        <main className="min-w-0">


          {/* Search */}

          <div className="mb-2.5 flex h-10 items-center rounded-xl border border-[#DED3C5] bg-white px-3 shadow-sm transition focus-within:border-[#D49A48] focus-within:ring-2 focus-within:ring-[#D49A48]/10">

            <Search
              size={15}
              className="mr-2.5 shrink-0 text-[#8D8071]"
            />

            <input
              autoFocus
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search items or press / ..."
              className="w-full bg-transparent text-[12px] font-medium text-[#2C2721] outline-none placeholder:text-[#AAA095]"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="mr-1 rounded-md p-1 text-[#918477] transition hover:bg-[#F5EFE6]"
              >
                <X size={13} />
              </button>
            )}

            <span className="hidden rounded-md border border-[#E3D9CD] bg-[#FAF7F2] px-2 py-1 font-mono text-[9px] text-[#9D9183] sm:block">
              /
            </span>

          </div>


          {/* Categories */}

          <div className="mb-3 flex overflow-x-auto rounded-xl border border-[#DED3C5] bg-[#ECE6DD] p-1 scrollbar-none">

            {categories.map(
              (category) => {

                const Icon =
                  category.icon;

                const active =
                  selectedCategory ===
                  category.label;

                return (
                  <button
                    key={
                      category.label
                    }
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category.label
                      )
                    }
                    className={`flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-lg px-3 text-[10px] font-bold transition-all ${
                      active
                        ? "bg-[#282521] text-white shadow-sm"
                        : "text-[#6F6458] hover:bg-white/70"
                    }`}
                  >
                    <Icon size={13} />

                    {category.label ===
                    "drink"
                      ? "Drinks"
                      : category.label}
                  </button>
                );
              }
            )}

          </div>


          {/* Menu heading */}

          <div className="mb-2.5 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <h2 className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#50483F]">
                Quick Menu
              </h2>

              <span className="h-1 w-1 rounded-full bg-[#D99A42]" />

              <span className="text-[9px] text-[#9C9082]">
                Tap to add
              </span>

            </div>

            <span className="text-[9px] font-semibold text-[#9C9082]">
              {filteredItems.length} available
            </span>

          </div>


          {/* Menu grid */}

          {filteredItems.length > 0 ? (

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">

              {filteredItems.map(
                (item) => {

                  const cartItem =
                    cart.find(
                      (cartItem) =>
                        cartItem.id ===
                        item.id
                    );

                  const quantity =
                    cartItem?.quantity ||
                    0;

                  return (

                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        addToCart(item)
                      }
                      className={`group relative min-h-[96px] overflow-hidden rounded-xl border text-left transition-all active:scale-[0.98] ${
                        quantity > 0
                          ? "border-[#D99434] bg-[#FFF4DC] shadow-[0_5px_18px_rgba(201,129,30,0.12)]"
                          : "border-[#DED3C5] bg-white shadow-sm hover:-translate-y-0.5 hover:border-[#D6A15B] hover:shadow-md"
                      }`}
                    >

                      <span
                        className={`absolute bottom-0 left-0 top-0 w-[3px] transition ${
                          quantity
                            ? "bg-[#D88A20]"
                            : "bg-transparent group-hover:bg-[#E6A23C]"
                        }`}
                      />


                      {quantity > 0 && (

                        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D78920] px-1.5 text-[9px] font-black text-white shadow-sm">
                          {quantity}
                        </span>

                      )}


                      <div className="flex h-full flex-col justify-between px-3 py-2.5">

                        <div className="pr-5">

                          <p className="text-[12px] font-bold leading-tight text-[#29241F]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#A09486]">
                            {item.category ===
                            "drink"
                              ? "Drinks"
                              : item.category}
                          </p>

                        </div>


                        <div className="mt-3 flex items-center justify-between">

                          <span className="text-[14px] font-bold tracking-[-0.02em] text-[#B86D0B]">
                            ₹{item.price}
                          </span>

                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                              quantity
                                ? "bg-[#D88A20] text-white"
                                : "bg-[#F1EBE2] text-[#857768] group-hover:bg-[#FFF0D2] group-hover:text-[#BE710B]"
                            }`}
                          >

                            {quantity ? (
                              <Check
                                size={12}
                                strokeWidth={
                                  2.8
                                }
                              />
                            ) : (
                              <Plus size={13} />
                            )}

                          </span>

                        </div>

                      </div>

                    </button>

                  );
                }
              )}

            </div>

          ) : (

            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-[#D9CCBC] bg-white">

              <div className="text-center">

                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0E8DC] text-[#9C8D7C]">
                  <Search size={19} />
                </div>

                <p className="text-[13px] font-bold text-[#51483E]">
                  Nothing found
                </p>

                <p className="mt-1 text-[10px] text-[#9C9083]">
                  Try another item or category.
                </p>

              </div>

            </div>

          )}

        </main>


        {/* ===================================================
            RIGHT — TICKET
        =================================================== */}

        <aside className="relative xl:sticky xl:top-3 xl:self-start">

          <div className="relative overflow-hidden rounded-[18px] border border-[#D8CCBD] bg-[#FFFDF8] shadow-[0_12px_32px_rgba(53,40,23,0.12)]">


            {/* Receipt header */}

            <div className="relative border-b border-dashed border-[#D8CCBD] px-4 py-3.5">

              <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#C77C1F] via-[#E6A23C] to-[#C77C1F]" />


              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#282521] text-[#E6A23C] shadow-sm">
                    <ReceiptText size={14} />
                  </div>

                  <div>

                    <p className="text-[12px] font-bold text-[#28231E]">
                      New Ticket
                    </p>

                    <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#A09385]">
                      Counter billing
                    </p>

                  </div>

                </div>


                {cart.length > 0 && (

                  <button
                    type="button"
                    onClick={
                      clearCart
                    }
                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-bold text-[#A34C3E] transition hover:bg-[#FFF0EC]"
                  >
                    <Trash2 size={11} />
                    Clear
                  </button>

                )}

              </div>

            </div>


            {/* Order mode */}

            <div className="px-4 pt-3">

              <div className="grid grid-cols-2 rounded-xl bg-[#ECE5DB] p-1">

                <button
                  type="button"
                  onClick={() =>
                    setOrderType(
                      "takeaway"
                    )
                  }
                  className={`flex h-8 items-center justify-center gap-1.5 rounded-lg text-[10px] font-bold transition ${
                    orderType ===
                    "takeaway"
                      ? "bg-white text-[#29231E] shadow-sm"
                      : "text-[#83776B]"
                  }`}
                >
                  <ShoppingBag
                    size={12}
                  />
                  Takeaway
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setOrderType(
                      "dinein"
                    )
                  }
                  className={`flex h-8 items-center justify-center gap-1.5 rounded-lg text-[10px] font-bold transition ${
                    orderType ===
                    "dinein"
                      ? "bg-white text-[#29231E] shadow-sm"
                      : "text-[#83776B]"
                  }`}
                >
                  <Utensils
                    size={12}
                  />
                  Dine-in
                </button>

              </div>

            </div>


            {/* Table */}

            {orderType ===
              "dinein" && (

              <div className="px-4 pt-2.5">

                <div className="relative">

                  <select
                    value={
                      selectedTable
                    }
                    onChange={(e) =>
                      setSelectedTable(
                        e.target.value
                      )
                    }
                    className="h-8 w-full appearance-none rounded-lg border border-[#DCCFC0] bg-[#FAF7F1] px-2.5 pr-8 text-[10px] font-bold text-[#40372F] outline-none transition focus:border-[#D48B27] focus:ring-2 focus:ring-[#D48B27]/10"
                  >

                    <option value="">
                      Select table...
                    </option>

                    <option value="Table 1">
                      Table 1 · Indoor
                    </option>

                    <option value="Table 2">
                      Table 2 · Indoor
                    </option>

                    <option value="Table 3">
                      Table 3 · Indoor
                    </option>

                    <option value="Table 4">
                      Table 4 · Outdoor
                    </option>

                  </select>


                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B7D6E]"
                  />

                </div>

              </div>

            )}


            {/* Ticket body */}

            <div className="px-4 py-3">

              {cart.length === 0 ? (

                <div className="flex min-h-[240px] flex-col items-center justify-center text-center">

                  <div className="relative mb-3">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1E8DA] text-[#C27A1D] shadow-inner">
                      <ShoppingBag size={23} />
                    </div>

                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#FFFDF8] bg-[#E6A23C]">
                      <Plus size={10} />
                    </span>

                  </div>


                  <p className="text-[12px] font-bold text-[#51483B]">
                    Ready for the next order
                  </p>

                  <p className="mt-1 max-w-[210px] text-[9px] leading-relaxed text-[#9A8E82]">
                    Tap any menu item on the left.
                    Your ticket will build here instantly.
                  </p>

                </div>

              ) : (

                <>

                  {/* Item list */}

                  <div className="max-h-[245px] space-y-1.5 overflow-y-auto pr-1">

                    {cart.map(
                      (item) => (

                        <div
                          key={item.id}
                          className="group relative rounded-xl border border-[#E4D9CA] bg-[#FCFAF5] px-2.5 py-2.5 transition hover:border-[#D9C7AF]"
                        >

                          <div className="flex items-center gap-2">

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-[11px] font-bold text-[#302A24]">
                                {item.name}
                              </p>

                              <p className="mt-0.5 text-[8px] text-[#998C7D]">
                                ₹{item.price} each
                              </p>

                            </div>


                            {/* Quantity */}

                            <div className="flex h-7 items-center rounded-lg border border-[#DED3C5] bg-white shadow-sm">

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    -1
                                  )
                                }
                                className="flex h-full w-7 items-center justify-center text-[#74685B] transition hover:bg-[#FFF3DE] hover:text-[#BE710B]"
                              >
                                <Minus size={11} />
                              </button>

                              <span className="w-5 text-center text-[10px] font-bold text-[#302921]">
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
                                className="flex h-full w-7 items-center justify-center text-[#74685B] transition hover:bg-[#FFF3DE] hover:text-[#BE710B]"
                              >
                                <Plus size={11} />
                              </button>

                            </div>


                            <span className="w-10 text-right text-[11px] font-bold text-[#302921]">
                              ₹
                              {item.price *
                                item.quantity}
                            </span>

                          </div>


                          {/* Note */}

                          <div className="mt-1.5 flex items-center gap-1.5 border-t border-dashed border-[#E4DACD] pt-1.5">

                            <StickyNote
                              size={10}
                              className="shrink-0 text-[#B49D82]"
                            />

                            <input
                              value={
                                item.note
                              }
                              onChange={(e) =>
                                updateNote(
                                  item.id,
                                  e.target
                                    .value
                                )
                              }
                              placeholder="Special note..."
                              className="w-full bg-transparent text-[9px] text-[#64594E] outline-none placeholder:text-[#B0A59A]"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  item.id
                                )
                              }
                              className="hidden rounded-md p-1 text-[#B8A99A] transition hover:bg-[#FFF0EC] hover:text-[#A44E41] group-hover:block"
                            >
                              <Delete size={11} />
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>


                  {/* Totals */}

                  <div className="mt-3 border-t border-dashed border-[#D8CCBD] pt-2.5">

                    <div className="space-y-1 text-[10px]">

                      <div className="flex justify-between text-[#83776A]">
                        <span>
                          Subtotal
                        </span>
                        <span>
                          ₹{subtotal}
                        </span>
                      </div>

                      <div className="flex justify-between text-[#83776A]">
                        <span>
                          GST · 5%
                        </span>
                        <span>
                          ₹{gst}
                        </span>
                      </div>

                    </div>


                    <div className="mt-2 flex items-end justify-between rounded-xl bg-[#F3ECE2] px-3 py-2.5">

                      <div>

                        <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#918476]">
                          Amount due
                        </p>

                        <p className="mt-0.5 text-[24px] font-bold tracking-[-0.04em] text-[#26221E]">
                          ₹{total}
                        </p>

                      </div>


                      <div className="flex items-center gap-1 rounded-lg bg-[#FFF6E6] px-2 py-1 text-[8px] font-bold text-[#B66B08]">
                        <CircleDollarSign
                          size={11}
                        />
                        {totalItems} items
                      </div>

                    </div>

                  </div>


                  {/* Payment */}

                  <div className="mt-3">

                    <div className="mb-1.5 flex items-center justify-between">

                      <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-[#83776A]">
                        Payment
                      </p>


                      {paymentMethod ===
                        "cash" &&
                        Number(
                          cashReceived
                        ) >= total &&
                        Number(
                          cashReceived
                        ) > 0 && (

                          <span className="flex items-center gap-1 text-[8px] font-bold text-[#16866D]">
                            <Check size={10} />
                            Change ₹
                            {
                              changeAmount
                            }
                          </span>

                        )}

                    </div>


                    <div className="grid grid-cols-2 gap-1.5">

                      <button
                        type="button"
                        onClick={() =>
                          setPaymentMethod(
                            "cash"
                          )
                        }
                        className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border text-[10px] font-bold transition ${
                          paymentMethod ===
                          "cash"
                            ? "border-[#D99A42] bg-[#FFF1D4] text-[#B76A08] shadow-sm"
                            : "border-[#E0D5C8] bg-white text-[#706458] hover:bg-[#FCF9F4]"
                        }`}
                      >
                        <Banknote
                          size={13}
                        />
                        Cash
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          setPaymentMethod(
                            "upi"
                          )
                        }
                        className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border text-[10px] font-bold transition ${
                          paymentMethod ===
                          "upi"
                            ? "border-[#D99A42] bg-[#FFF1D4] text-[#B76A08] shadow-sm"
                            : "border-[#E0D5C8] bg-white text-[#706458] hover:bg-[#FCF9F4]"
                        }`}
                      >
                        <QrCode
                          size={13}
                        />
                        UPI
                      </button>

                    </div>

                  </div>


                  {/* Cash */}

                  {paymentMethod ===
                    "cash" && (

                    <div className="mt-2.5 rounded-xl border border-[#E2D7C9] bg-[#F6F0E7] p-2.5">

                      <div className="flex items-center justify-between">

                        <p className="text-[8px] font-bold uppercase tracking-[0.11em] text-[#75695D]">
                          Cash received
                        </p>

                        {changeAmount >
                          0 && (
                          <span className="text-[9px] font-bold text-[#16866D]">
                            Change ₹
                            {
                              changeAmount
                            }
                          </span>
                        )}

                      </div>


                      <div className="mt-2 flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">

                        {[
                          total,
                          50,
                          100,
                          200,
                          500,
                        ]
                          .filter(
                            (
                              value,
                              index,
                              array
                            ) =>
                              array.indexOf(
                                value
                              ) ===
                              index
                          )
                          .map(
                            (
                              amount
                            ) => (

                              <button
                                key={
                                  amount
                                }
                                type="button"
                                onClick={() =>
                                  selectCashAmount(
                                    amount
                                  )
                                }
                                className={`h-7 shrink-0 rounded-lg border px-2.5 text-[9px] font-bold transition ${
                                  Number(
                                    cashReceived
                                  ) ===
                                  amount
                                    ? "border-[#D48A20] bg-[#FFF0D2] text-[#B76A08]"
                                    : "border-[#DDD2C4] bg-white text-[#5B5146] hover:border-[#D9A45E]"
                                }`}
                              >
                                ₹
                                {
                                  amount
                                }
                              </button>

                            )
                          )}

                      </div>


                      <input
                        type="number"
                        value={
                          cashReceived
                        }
                        onChange={(e) =>
                          setCashReceived(
                            e.target
                              .value
                          )
                        }
                        placeholder="Enter amount received"
                        className="mt-2 h-9 w-full rounded-lg border border-[#DCD1C3] bg-white px-2.5 text-[11px] font-bold text-[#302921] outline-none transition placeholder:text-[#B1A59A] focus:border-[#D18A24] focus:ring-2 focus:ring-[#E6A23C]/10"
                      />

                    </div>

                  )}


                  {/* Charge */}

                  <button
                    type="button"
                    onClick={logOrder}
                    className="group relative mt-3 flex h-[48px] w-full items-center justify-between overflow-hidden rounded-xl bg-[#282521] px-3.5 text-white shadow-[0_7px_18px_rgba(33,29,24,0.16)] transition-all hover:bg-[#1D1B18] active:scale-[0.99]"
                  >

                    <span className="absolute bottom-0 left-0 top-0 w-1 bg-[#E6A23C]" />

                    <span className="flex items-center gap-2">

                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6A23C] text-[#292219]">
                        <Check
                          size={14}
                          strokeWidth={3}
                        />
                      </span>

                      <span className="text-[11px] font-bold">
                        Charge & Log
                      </span>

                    </span>


                    <span className="flex items-center gap-1.5 text-[14px] font-bold text-[#F4BD58]">
                      ₹{total}

                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>

                  </button>

                </>

              )}

            </div>


            {/* Footer */}

            <div className="border-t border-dashed border-[#D8CCBD] px-4 py-2">

              <div className="flex items-center justify-between text-[7px] font-bold uppercase tracking-[0.14em] text-[#A29688]">

                <span>
                  QRToken POS
                </span>

                <span className="flex items-center gap-1">
                  <Sparkles size={8} />
                  Ready
                </span>

              </div>

            </div>

          </div>

        </aside>

      </div>

    </section>
  );
}

export default ManualEntryPage;