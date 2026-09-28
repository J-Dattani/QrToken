import { useEffect, useMemo, useRef, useState } from "react";

import { useSelector } from "react-redux";

import { apiRequest } from "../api/client";

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
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* =========================================================
   CATEGORY CONFIG
========================================================= */

const categories = [
  {
    label: "All",
    icon: ScanLine,
  },
  {
    label: "Tea & Coffee",
    icon: Coffee,
  },
  {
    label: "Snacks",
    icon: Cookie,
  },
  {
    label: "Cold Drinks",
    icon: CupSoda,
  },
  {
    label: "Sweets",
    icon: IceCreamBowl,
  },
  {
    label: "Drink",
    icon: CupSoda,
  },
];

/* =========================================================
   MANUAL ENTRY PAGE
========================================================= */

function ManualEntryPage() {
  /* =======================================================
     MERCHANT
  ======================================================= */

  const merchant = useSelector((state) => state.merchant?.merchant);

  const merchantId = merchant?._id || merchant?.id || "";

  /* =======================================================
     MENU STATE
  ======================================================= */

  const [menuItems, setMenuItems] = useState([]);

  const [menuLoading, setMenuLoading] = useState(true);

  const [menuError, setMenuError] = useState("");

  /* =======================================================
     ORDER STATE
  ======================================================= */

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [cart, setCart] = useState([]);

  const [orderType, setOrderType] = useState("takeaway");

const [selectedTable, setSelectedTable] = useState("");

const [tables, setTables] = useState([]);

const [tablesLoading, setTablesLoading] = useState(false);

  const [tableDropdownOpen, setTableDropdownOpen] = useState(false);

  const tableDropdownRef = useRef(null);

  const toastTimerRef = useRef(null);

  const [toast, setToast] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [cashReceived, setCashReceived] = useState("");

  const [submitting, setSubmitting] = useState(false);


  /* =======================================================
     LOAD OWNER MENU
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadMenu = async () => {
      if (!merchantId) {
        setMenuLoading(false);
        setMenuError("Merchant information not available.");
        return;
      }

      setMenuLoading(true);
      setMenuError("");

      try {
        const response = await apiRequest(`/menu/owner/${merchantId}`, {
          method: "GET",
        });

        console.log("OWNER MENU API RESPONSE:", response);

        if (cancelled) {
          return;
        }

        let rawItems = [];

        if (Array.isArray(response)) {
          rawItems = response;
        } else if (Array.isArray(response?.menu)) {
          rawItems = response.menu;
        } else if (Array.isArray(response?.items)) {
          rawItems = response.items;
        } else if (Array.isArray(response?.data)) {
          rawItems = response.data;
        } else if (Array.isArray(response?.data?.menu)) {
          rawItems = response.data.menu;
        } else if (Array.isArray(response?.data?.items)) {
          rawItems = response.data.items;
        }

        console.log("OWNER MENU ITEMS:", rawItems);

        const normalizedItems = rawItems
          .map((item) => {
            const id = item?._id || item?.id || "";

            const name =
              typeof item?.name === "string"
                ? item.name.trim()
                : "";

            const price = Number(item?.price);

            const category =
              typeof item?.category === "string"
                ? item.category.trim()
                : "Other";

            const isAvailable = item?.isAvailable !== false;

            const active = item?.active !== false;
return {
  id,
  name,
  category,
  price,
  image: item?.image || "",
  description: item?.description || "",
  stock: item?.stock ?? null,

  // Backend uses -1 to mean unlimited stock.
  unlimited:
    item?.unlimited === true ||
    Number(item?.stock) === -1 ||
    item?.stock == null,

  isAvailable,
  active,
};
          })
          .filter((item) => {
            return (
              item.id &&
              item.name &&
              Number.isFinite(item.price) &&
              item.price >= 0 &&
              item.isAvailable &&
              item.active
            );
          });

        setMenuItems(normalizedItems);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load owner menu:", error);

        setMenuError(
          error?.message || "Failed to load menu.",
        );
      } finally {
        if (!cancelled) {
          setMenuLoading(false);
        }
      }
    };

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, [merchantId]);



    /* =======================================================
     LOAD TABLES
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadTables = async () => {
      if (!merchantId) {
        setTables([]);
        return;
      }

      setTablesLoading(true);

      try {
        const response = await apiRequest(
          `/orders/tables/${merchantId}`,
          {
            method: "GET",
          },
        );

        if (cancelled) {
          return;
        }

        console.log("TABLES API RESPONSE:", response);

        let rawTables = [];

        if (Array.isArray(response)) {
          rawTables = response;
        } else if (Array.isArray(response?.tables)) {
          rawTables = response.tables;
        } else if (Array.isArray(response?.data)) {
          rawTables = response.data;
        } else if (Array.isArray(response?.data?.tables)) {
          rawTables = response.data.tables;
        }

        const normalizedTables = rawTables
          .map((table, index) => {
            const id =
              table?._id ||
              table?.id ||
              table?.tableId ||
              "";

            const tableNumber =
              table?.tableNumber ??
              table?.number ??
              table?.tableNo ??
              table?.no ??
              "";

            const tableName =
              table?.name ||
              table?.tableName ||
              (tableNumber
                ? `Table ${tableNumber}`
                : `Table ${index + 1}`);

            return {
              ...table,
              id: String(id),
              name: String(tableName),
              tableNumber: String(tableNumber),
              isOccupied: Boolean(table?.isOccupied),
              hasCashPending: Boolean(table?.hasCashPending),
              ordersCount: Number(table?.ordersCount || 0),
              totalBill: Number(table?.totalBill || 0),
            };
          })
          .filter((table) => table.id);

        normalizedTables.sort((a, b) => {
          const numberA = Number(a.tableNumber);
          const numberB = Number(b.tableNumber);

          if (
            Number.isFinite(numberA) &&
            Number.isFinite(numberB)
          ) {
            return numberA - numberB;
          }

          return a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        });

        console.log("DYNAMIC TABLES:", normalizedTables);

        setTables(normalizedTables);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load merchant tables:",
          error,
        );

        setTables([]);
      } finally {
        if (!cancelled) {
          setTablesLoading(false);
        }
      }
    };

    loadTables();

    return () => {
      cancelled = true;
    };
  }, [merchantId]);
  /* =======================================================
     FILTERED MENU
  ======================================================= */

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, search, selectedCategory]);

  /* =======================================================
     TOTALS
  ======================================================= */

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price);

      const quantity = Number(item.quantity);

      if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
        return sum;
      }

      return sum + price * quantity;
    }, 0);
  }, [cart]);

  const gst = Math.round(subtotal * 0.05);

  const total = subtotal + gst;

  const cashValue = Number(cashReceived || 0);

  const changeAmount = Math.max(cashValue - total, 0);

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  /* =======================================================
     CART — ADD
  ======================================================= */

const addToCart = (item) => {
  const price = Number(item?.price);

  if (
    !item?.id ||
    !item?.name ||
    !Number.isFinite(price)
  ) {
    console.error("Invalid menu item:", item);
    return;
  }

  const unlimited =
    item?.unlimited === true ||
    Number(item?.stock) === -1 ||
    item?.stock == null;

  const stock = Number(item?.stock);

  setCart((current) => {
    const existing = current.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existing) {
      const currentQuantity = Number(
        existing.quantity || 0
      );

      /*
       * -1 = unlimited stock
       */
      if (
        !unlimited &&
        Number.isFinite(stock) &&
        currentQuantity >= stock
      ) {
        return current;
      }

      return current.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: currentQuantity + 1,
            }
          : cartItem
      );
    }

    /*
     * Do not add an item that is genuinely
     * out of stock.
     *
     * stock === -1 means unlimited.
     */
    if (
      !unlimited &&
      Number.isFinite(stock) &&
      stock <= 0
    ) {
      return current;
    }

    return [
      ...current,
      {
        ...item,
        price,
        quantity: 1,
        note: "",
        unlimited,
      },
    ];
  });
};

  /* =======================================================
     CART — QUANTITY
  ======================================================= */

const updateQuantity = (id, change) => {
  setCart((current) =>
    current
      .map((item) => {
        if (item.id !== id) {
          return item;
        }

        const currentQuantity = Number(
          item.quantity || 0
        );

        const nextQuantity =
          currentQuantity + Number(change);

        const unlimited =
          item?.unlimited === true ||
          Number(item?.stock) === -1 ||
          item?.stock == null;

        const stock = Number(item?.stock);

        /*
         * Never exceed finite stock.
         * -1 means unlimited.
         */
        if (
          Number(change) > 0 &&
          !unlimited &&
          Number.isFinite(stock) &&
          nextQuantity > stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity: nextQuantity,
        };
      })
      .filter(
        (item) => Number(item.quantity) > 0
      )
  );
};

  /* =======================================================
     CART — NOTE
  ======================================================= */

  const updateNote = (id, note) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              note,
            }
          : item,
      ),
    );
  };

  /* =======================================================
     CART — REMOVE
  ======================================================= */

  const removeItem = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  /* =======================================================
     TABLE DROPDOWN + TOAST HELPERS
  ======================================================= */

  const selectedTableData = useMemo(
    () => tables.find((table) => table.id === selectedTable),
    [tables, selectedTable],
  );

  const showToast = (message, type = "success") => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({
      open: true,
      type,
      message,
    });

    toastTimerRef.current = window.setTimeout(() => {
      setToast({
        open: false,
        type: "success",
        message: "",
      });
    }, 3000);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        tableDropdownRef.current &&
        !tableDropdownRef.current.contains(event.target)
      ) {
        setTableDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearCart = () => {
    setCart([]);

    setSelectedTable("");

    setCashReceived("");
  };

  /* =======================================================
     QUICK CASH
  ======================================================= */

  const selectCashAmount = (amount) => {
    setCashReceived(String(amount));
  };

  /* =======================================================
     CREATE REAL ORDER
  ======================================================= */

  const logOrder = async () => {
    if (cart.length === 0) {
      showToast("Please select at least one item.", "error");

      return;
    }

    if (!merchantId) {
      showToast("Merchant information is not available.", "error");

      return;
    }

    if (orderType === "dinein" && !selectedTable) {
      showToast("Please select a table.", "error");

      return;
    }

    /*
     * UPI will be connected once
     * the digital-payment flow/API
     * from your mentor is available.
     */

    if (paymentMethod !== "cash") {
      showToast("UPI payment integration will be connected separately.", "error");

      return;
    }

    const received = Number(cashReceived);

    if (!Number.isFinite(received) || received <= 0) {
      showToast("Please enter cash received.", "error");

      return;
    }

    if (received < total) {
      showToast(`Cash received must be at least ₹${total}.`, "error");

      return;
    }

    /*
     * Build the exact item structure
     * expected by the order backend.
     */

    const orderItems = cart.map((item) => {
      const price = Number(item.price);

      const quantity = Number(item.quantity);

      if (
        !item.id ||
        !item.name ||
        !Number.isFinite(price) ||
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        throw new Error(`Invalid cart item: ${item.name || "Unknown item"}`);
      }

      return {
        /*
         * MongoDB menu item ID
         */

        menuItem: item.id,

        /*
         * Backend requires name
         */

        name: item.name,

        /*
         * Backend requires price
         */

        price,

        /*
         * Quantity
         */

        quantity,

        /*
         * Backend requires
         * item subtotal
         */

        subtotal: price * quantity,
      };
    });

    /*
     * Calculate again from the
     * validated order items.
     */

    const calculatedSubtotal = orderItems.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    const calculatedGst = Math.round(calculatedSubtotal * 0.05);

    const calculatedTotal = calculatedSubtotal + calculatedGst;

    /*
     * Safety check against NaN.
     */

    if (
      !Number.isFinite(calculatedSubtotal) ||
      !Number.isFinite(calculatedTotal)
    ) {
      showToast(
        "Unable to calculate order total. Please check the selected menu items.",
        "error",
      );

      return;
    }

    /*
     * Build backend payload.
     *
     * IMPORTANT:
     * payMode is the actual backend field.
     */

    const orderPayload = {
      merchantId,

      payMode: "cash",

      customerName: "Counter Customer",

      customerPhone: "",

      notes: cart
        .filter((item) => item.note?.trim())
        .map((item) => `${item.name}: ${item.note.trim()}`)
        .join(" | "),

      couponCode: "",

      subtotal: calculatedSubtotal,

      gst: calculatedGst,

      discountAmount: 0,

      total: calculatedTotal,

      tableId: orderType === "dinein" ? selectedTable : "",

      items: orderItems,
    };

    console.log("================================");

    console.log("MANUAL ORDER PAYLOAD:", orderPayload);

    console.log("================================");

    setSubmitting(true);

    try {
      const response = await apiRequest("/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(orderPayload),
      });

      console.log("MANUAL ORDER CREATED:", response);

      showToast(`Order created successfully! ₹${calculatedTotal}`);

      /*
       * Start fresh ticket.
       */

      setCart([]);

      setSelectedTable("");

      setCashReceived("");

      setPaymentMethod("cash");

      setOrderType("takeaway");
    } catch (error) {
      console.error("Manual order creation failed:", error);

      showToast(error?.message || "Failed to create order.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="min-h-full bg-[#F7F3ED] px-5 py-5 lg:px-7">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#282521] text-[#E6A23C] shadow-sm">
            <Zap size={17} fill="currentColor" />
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
              <span className="mx-1 text-[#C9BDAE]">·</span>₹{total}
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
            <Search size={15} className="mr-2.5 shrink-0 text-[#8D8071]" />

            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items or press / ..."
              className="w-full bg-transparent text-[12px] font-medium text-[#2C2721] outline-none placeholder:text-[#AAA095]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
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
            {categories.map((category) => {
              const Icon = category.icon;

              const active = selectedCategory === category.label;

              return (
                <button
                  key={category.label}
                  type="button"
                  onClick={() => setSelectedCategory(category.label)}
                  className={`flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-lg px-3 text-[10px] font-bold transition-all ${
                    active
                      ? "bg-[#282521] text-white shadow-sm"
                      : "text-[#6F6458] hover:bg-white/70"
                  }`}
                >
                  <Icon size={13} />

                  {category.label === "Drink" ? "Drinks" : category.label}
                </button>
              );
            })}
          </div>

          {/* Menu heading */}

          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#50483F]">
                Quick Menu
              </h2>

              <span className="h-1 w-1 rounded-full bg-[#D99A42]" />

              <span className="text-[9px] text-[#9C9082]">Tap to add</span>
            </div>

            <span className="text-[9px] font-semibold text-[#9C9082]">
              {filteredItems.length} available
            </span>
          </div>

          {/* =================================================
              MENU CONTENT
          ================================================= */}

          {menuLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-[#DED3C5] bg-white">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#E6A23C] border-t-transparent" />

                <p className="text-[12px] font-bold text-[#51483E]">
                  Loading menu...
                </p>

                <p className="mt-1 text-[9px] text-[#9C9082]">
                  Fetching your available items.
                </p>
              </div>
            </div>
          ) : menuError ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-[#D9CCBC] bg-white">
              <div className="px-5 text-center">
                <p className="text-[13px] font-bold text-[#51483E]">
                  Unable to load menu
                </p>

                <p className="mt-1 text-[10px] text-[#9C9082]">{menuError}</p>
              </div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {filteredItems.map((item) => {
                const cartItem = cart.find(
                  (cartItem) => cartItem.id === item.id,
                );

                const quantity = cartItem?.quantity || 0;

                const stockLimited =
                  !item.unlimited && Number.isFinite(Number(item.stock));

                const maxStock = stockLimited
                  ? Math.max(0, Number(item.stock))
                  : Infinity;

                const canAdd = quantity < maxStock;

                return (
                  <div
                    key={item.id}
                    className={`group relative min-h-[118px] overflow-hidden rounded-xl border text-left transition-all ${
                      quantity > 0
                        ? "border-[#D99434] bg-[#FFF4DC] shadow-[0_5px_18px_rgba(201,129,30,0.12)]"
                        : "border-[#DED3C5] bg-white shadow-sm hover:-translate-y-0.5 hover:border-[#D6A15B] hover:shadow-md"
                    }`}
                  >
                    {/* Accent */}

                    <span
                      className={`absolute bottom-0 left-0 top-0 w-[3px] transition ${
                        quantity
                          ? "bg-[#D88A20]"
                          : "bg-transparent group-hover:bg-[#E6A23C]"
                      }`}
                    />

                    {/* =================================================
                          CARD BODY
                      ================================================= */}

                    <button
                      type="button"
                      disabled={!canAdd}
                      onClick={() => canAdd && addToCart(item)}
                      className="flex w-full flex-col px-3 py-3 text-left disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="pr-2">
                        <p className="text-[12px] font-bold leading-tight text-[#29241F]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#A09486]">
                          {item.category}
                        </p>
                      </div>

                      <span className="mt-3 text-[14px] font-bold tracking-[-0.02em] text-[#B86D0B]">
                        ₹{item.price}
                      </span>
                    </button>

                    {/* =================================================
                          QUANTITY CONTROLS
                      ================================================= */}

                    <div className="absolute bottom-2.5 right-2.5">
                      {quantity > 0 ? (
                        <div className="flex h-8 items-center overflow-hidden rounded-lg border border-[#D7C4AC] bg-white shadow-sm">
                          {/* MINUS */}

                          <button
                            type="button"
                            aria-label={`Decrease ${item.name}`}
                            onClick={(e) => {
                              e.stopPropagation();

                              updateQuantity(item.id, -1);
                            }}
                            className="flex h-full w-8 items-center justify-center text-[#786B5E] transition hover:bg-[#FFF0D2] hover:text-[#B76A08] active:bg-[#F8E4BD]"
                          >
                            <Minus size={12} strokeWidth={2.5} />
                          </button>

                          {/* QUANTITY */}

                          <span className="flex h-full min-w-7 items-center justify-center border-x border-[#E4D9CB] px-1 text-[10px] font-black text-[#302921]">
                            {quantity}
                          </span>

                          {/* PLUS */}

                          <button
                            type="button"
                            aria-label={`Increase ${item.name}`}
                            disabled={!canAdd}
                            onClick={(e) => {
                              e.stopPropagation();

                              if (canAdd) {
                                updateQuantity(item.id, 1);
                              }
                            }}
                            className="flex h-full w-8 items-center justify-center text-[#B76A08] transition hover:bg-[#FFF0D2] active:bg-[#F8E4BD] disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Plus size={12} strokeWidth={2.8} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          aria-label={`Add ${item.name}`}
                          disabled={!canAdd}
                          onClick={(e) => {
                            e.stopPropagation();

                            if (canAdd) {
                              addToCart(item);
                            }
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1EBE2] text-[#857768] shadow-sm transition hover:bg-[#FFF0D2] hover:text-[#BE710B] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>

                    {/* Stock indicator */}

                 {/* Stock indicator */}

{item.unlimited ? (
  <span className="absolute bottom-2 left-3 text-[7px] font-bold uppercase tracking-[0.08em] text-[#A09486]">
    Unlimited
  </span>
) : Number(item.stock) === 0 ? (
  <span className="absolute bottom-2 left-3 text-[7px] font-bold uppercase tracking-[0.08em] text-[#A09486]">
    Out of stock
  </span>
) : (
  <span className="absolute bottom-2 left-3 text-[7px] font-bold uppercase tracking-[0.08em] text-[#A09486]">
    {Math.max(
      0,
      Number(item.stock) - Number(quantity || 0)
    )}{" "}
    left
  </span>
)}
                  </div>
                );
              })}
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
                    onClick={clearCart}
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
                  onClick={() => setOrderType("takeaway")}
                  className={`flex h-8 items-center justify-center gap-1.5 rounded-lg text-[10px] font-bold transition ${
                    orderType === "takeaway"
                      ? "bg-white text-[#29231E] shadow-sm"
                      : "text-[#83776B]"
                  }`}
                >
                  <ShoppingBag size={12} />
                  Takeaway
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType("dinein")}
                  className={`flex h-8 items-center justify-center gap-1.5 rounded-lg text-[10px] font-bold transition ${
                    orderType === "dinein"
                      ? "bg-white text-[#29231E] shadow-sm"
                      : "text-[#83776B]"
                  }`}
                >
                  <Utensils size={12} />
                  Dine-in
                </button>
              </div>
            </div>

            {/* Table */}

            {orderType === "dinein" && (
              <div className="px-4 pt-2.5">
                <div ref={tableDropdownRef} className="relative">
                  <button
                    type="button"
                    disabled={tablesLoading}
                    onClick={() => setTableDropdownOpen((open) => !open)}
                    className="flex h-8 w-full items-center justify-between rounded-lg border border-[#DCCFC0] bg-[#FAF7F1] px-2.5 text-left text-[10px] font-bold text-[#40372F] outline-none transition hover:border-[#D48B27] focus:border-[#D48B27] focus:ring-2 focus:ring-[#D48B27]/10 disabled:cursor-wait disabled:opacity-70"
                  >
                    <span className="truncate">
                      {tablesLoading
                        ? "Loading tables..."
                        : selectedTableData?.name || "Select table..."}
                    </span>

                    <ChevronDown
                      size={13}
                      className={`shrink-0 text-[#8B7D6E] transition-transform ${
                        tableDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {tableDropdownOpen && !tablesLoading && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-xl border border-[#DCCFC0] bg-white p-1.5 shadow-[0_12px_28px_rgba(53,40,23,0.16)]">
                      {tables.length === 0 ? (
                        <div className="px-3 py-3 text-center text-[9px] font-semibold text-[#9A8E82]">
                          No tables available.
                        </div>
                      ) : (
                        tables.map((table) => {
                          const occupied = Boolean(table.isOccupied);
                          const cashPending = Boolean(table.hasCashPending);
                          const disabled = false;

                          return (
                            <button
                              key={table.id}
                              type="button"
                              disabled={disabled}
                              onClick={() => {
                                setSelectedTable(table.id);
                                setTableDropdownOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition ${
                                selectedTable === table.id
                                  ? "bg-[#FFF0D2]"
                                  : "hover:bg-[#FFF6E6]"
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-[10px] font-bold text-[#40372F]">
                                  {table.name}
                                </p>

                                {cashPending && (
                                  <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] text-[#B66B08]">
                                    Cash pending
                                  </p>
                                )}

                                {table.ordersCount > 0 && (
                                  <p className="mt-0.5 text-[7px] text-[#9A8E82]">
                                    {table.ordersCount} active{" "}
                                    {table.ordersCount === 1 ? "order" : "orders"}
                                    {" · "}₹{table.totalBill}
                                  </p>
                                )}
                              </div>

                              <span
                                className={`ml-2 shrink-0 rounded-full px-2 py-1 text-[7px] font-bold uppercase tracking-[0.07em] ${
                                  selectedTable === table.id && occupied
                                    ? "bg-[#FFF0D2] text-[#B66B08]"
                                    : occupied
                                      ? "bg-[#FFF0EC] text-[#A44E41]"
                                      : "bg-[#EAF5F1] text-[#287A66]"
                                }`}
                              >
                                {selectedTable === table.id && occupied
                                  ? "Adding Order"
                                  : occupied
                                    ? "Occupied"
                                    : "Free"}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
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
                    Tap any menu item on the left. Your ticket will build here
                    instantly.
                  </p>
                </div>
              ) : (
                <>
                  {/* Item list */}

                  <div className="max-h-[245px] space-y-1.5 overflow-y-auto pr-1">
                    {cart.map((item) => (
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
                              onClick={() => updateQuantity(item.id, -1)}
                              className="flex h-full w-7 items-center justify-center text-[#74685B] transition hover:bg-[#FFF3DE] hover:text-[#BE710B]"
                            >
                              <Minus size={11} />
                            </button>

                            <span className="w-5 text-center text-[10px] font-bold text-[#302921]">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="flex h-full w-7 items-center justify-center text-[#74685B] transition hover:bg-[#FFF3DE] hover:text-[#BE710B]"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <span className="w-10 text-right text-[11px] font-bold text-[#302921]">
                            ₹{Number(item.price) * Number(item.quantity)}
                          </span>
                        </div>

                        {/* Note */}

                        <div className="mt-1.5 flex items-center gap-1.5 border-t border-dashed border-[#E4DACD] pt-1.5">
                          <StickyNote
                            size={10}
                            className="shrink-0 text-[#B49D82]"
                          />

                          <input
                            value={item.note}
                            onChange={(e) =>
                              updateNote(item.id, e.target.value)
                            }
                            placeholder="Special note..."
                            className="w-full bg-transparent text-[9px] text-[#64594E] outline-none placeholder:text-[#B0A59A]"
                          />

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="hidden rounded-md p-1 text-[#B8A99A] transition hover:bg-[#FFF0EC] hover:text-[#A44E41] group-hover:block"
                          >
                            <Delete size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}

                  <div className="mt-3 border-t border-dashed border-[#D8CCBD] pt-2.5">
                    <div className="space-y-1 text-[10px]">
                      <div className="flex justify-between text-[#83776A]">
                        <span>Subtotal</span>

                        <span>₹{subtotal}</span>
                      </div>

                      <div className="flex justify-between text-[#83776A]">
                        <span>GST · 5%</span>

                        <span>₹{gst}</span>
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
                        <CircleDollarSign size={11} />
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

                      {paymentMethod === "cash" &&
                        cashValue >= total &&
                        cashValue > 0 && (
                          <span className="flex items-center gap-1 text-[8px] font-bold text-[#16866D]">
                            <Check size={10} />
                            Change ₹{changeAmount}
                          </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border text-[10px] font-bold transition ${
                          paymentMethod === "cash"
                            ? "border-[#D99A42] bg-[#FFF1D4] text-[#B76A08] shadow-sm"
                            : "border-[#E0D5C8] bg-white text-[#706458] hover:bg-[#FCF9F4]"
                        }`}
                      >
                        <Banknote size={13} />
                        Cash
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border text-[10px] font-bold transition ${
                          paymentMethod === "upi"
                            ? "border-[#D99A42] bg-[#FFF1D4] text-[#B76A08] shadow-sm"
                            : "border-[#E0D5C8] bg-white text-[#706458] hover:bg-[#FCF9F4]"
                        }`}
                      >
                        <QrCode size={13} />
                        UPI
                      </button>
                    </div>
                  </div>

                  {/* Cash */}

                  {paymentMethod === "cash" && (
                    <div className="mt-2.5 rounded-xl border border-[#E2D7C9] bg-[#F6F0E7] p-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-bold uppercase tracking-[0.11em] text-[#75695D]">
                          Cash received
                        </p>

                        {changeAmount > 0 && (
                          <span className="text-[9px] font-bold text-[#16866D]">
                            Change ₹{changeAmount}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                        {[total, 50, 100, 200, 500]
                          .filter(
                            (value, index, array) =>
                              Number.isFinite(Number(value)) &&
                              array.indexOf(value) === index,
                          )
                          .map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => selectCashAmount(amount)}
                              className={`h-7 shrink-0 rounded-lg border px-2.5 text-[9px] font-bold transition ${
                                cashValue === amount
                                  ? "border-[#D48A20] bg-[#FFF0D2] text-[#B76A08]"
                                  : "border-[#DDD2C4] bg-white text-[#5B5146] hover:border-[#D9A45E]"
                              }`}
                            >
                              ₹{amount}
                            </button>
                          ))}
                      </div>

                      <input
                        type="number"
                        min="0"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder="Enter amount received"
                        className="mt-2 h-9 w-full rounded-lg border border-[#DCD1C3] bg-white px-2.5 text-[11px] font-bold text-[#302921] outline-none transition placeholder:text-[#B1A59A] focus:border-[#D18A24] focus:ring-2 focus:ring-[#E6A23C]/10"
                      />
                    </div>
                  )}

                  {/* Charge */}

                  <button
                    type="button"
                    onClick={logOrder}
                    disabled={submitting}
                    className="group relative mt-3 flex h-[48px] w-full items-center justify-between overflow-hidden rounded-xl bg-[#282521] px-3.5 text-white shadow-[0_7px_18px_rgba(33,29,24,0.16)] transition-all hover:bg-[#1D1B18] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="absolute bottom-0 left-0 top-0 w-1 bg-[#E6A23C]" />

                    <span className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6A23C] text-[#292219]">
                        <Check size={14} strokeWidth={3} />
                      </span>

                      <span className="text-[11px] font-bold">
                        {submitting ? "Creating Order..." : "Charge & Log"}
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
                <span>QRToken POS</span>

                <span className="flex items-center gap-1">
                  <Sparkles size={8} />
                  Ready
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast.open && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-[qrtokenToastIn_220ms_ease-out]">
          <div
            className={`flex min-w-[250px] max-w-[360px] items-center gap-2.5 rounded-xl border bg-white px-3.5 py-3 shadow-[0_12px_30px_rgba(40,34,27,0.16)] ${
              toast.type === "error"
                ? "border-[#E8C7C0]"
                : "border-[#CDE2D9]"
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                toast.type === "error"
                  ? "bg-[#FFF0EC] text-[#A44E41]"
                  : "bg-[#EAF5F1] text-[#287A66]"
              }`}
            >
              {toast.type === "error" ? (
                <AlertCircle size={15} />
              ) : (
                <CheckCircle2 size={15} />
              )}
            </div>

            <p className="min-w-0 flex-1 text-[10px] font-bold leading-relaxed text-[#40372F]">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() =>
                setToast({
                  open: false,
                  type: "success",
                  message: "",
                })
              }
              className="rounded-md p-1 text-[#9B8E80] transition hover:bg-[#F5EFE6] hover:text-[#51483E]"
              aria-label="Dismiss notification"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes qrtokenToastIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </section>
  );
}

export default ManualEntryPage;
