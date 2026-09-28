import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSelector } from "react-redux";

import {
  Archive,
  ArrowDown,
  ArrowUp,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Hash,
  IndianRupee,
  RefreshCw,
  Search,
  ShoppingBag,
  Smartphone,
  X,
  XCircle,
} from "lucide-react";

import {
  Chip,
  Tooltip,
} from "@mui/material";

import { apiRequest } from "../api/client";


/* ============================================================
   HELPERS
============================================================ */

const formatINR = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;


const getOrderId = (order) =>
  order?._id ||
  order?.id ||
  "";


const getToken = (order) => {
  const token =
    order?.tokenNumber ||
    order?.token ||
    order?.orderToken ||
    "";

  return String(token);
};


const getOrderTotal = (order) => {
  const total = Number(order?.total);

  if (Number.isFinite(total)) {
    return total;
  }

  const subtotal = Number(order?.subtotal);

  if (Number.isFinite(subtotal)) {
    return subtotal;
  }

  const amount = Number(order?.amount);

  return Number.isFinite(amount)
    ? amount
    : 0;
};


const getPayMode = (order) =>
  String(
    order?.payMode ||
      order?.paymentMode ||
      order?.paymentMethod ||
      ""
  )
    .trim()
    .toLowerCase();


const getPaymentLabel = (order) => {
  const mode = getPayMode(order);

  if (
    mode === "cash" ||
    mode === "cod"
  ) {
    return "Cash";
  }

  if (
    mode === "upi" ||
    mode === "digital" ||
    mode === "razorpay"
  ) {
    return "Digital";
  }

  if (mode === "card") {
    return "Card";
  }

  return mode
    ? mode.charAt(0).toUpperCase() +
        mode.slice(1)
    : "—";
};


const getStatus = (order) =>
  String(
    order?.status ||
      order?.orderStatus ||
      ""
  )
    .trim()
    .toLowerCase();


const getStatusLabel = (order) => {
  const status = getStatus(order);

  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    preparing: "Preparing",
    ready: "Ready",
    collected: "Collected",
    completed: "Completed",
    delivered: "Delivered",
    cancelled: "Cancelled",
    canceled: "Cancelled",
    refunded: "Refunded",
  };

  return (
    labels[status] ||
    (
      status
        ? status.charAt(0).toUpperCase() +
          status.slice(1)
        : "Unknown"
    )
  );
};


const getStatusConfig = (order) => {
  const status = getStatus(order);

  if (
    status === "cancelled" ||
    status === "canceled"
  ) {
    return {
      classes:
        "bg-[#FBE4E2] text-[#B64B45]",
    };
  }

  if (
    status === "completed" ||
    status === "collected" ||
    status === "delivered"
  ) {
    return {
      classes:
        "bg-[#E5F5EF] text-[#19745F]",
    };
  }

  if (
    status === "preparing" ||
    status === "ready" ||
    status === "accepted"
  ) {
    return {
      classes:
        "bg-[#FFF0D5] text-[#B8730E]",
    };
  }

  return {
    classes:
      "bg-[#F0EBE3] text-[#817568]",
  };
};


const formatDate = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};


const formatTime = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};


const getCustomerName = (order) =>
  order?.customerName ||
  order?.customer?.name ||
  "Walk-in customer";


const getCustomerPhone = (order) =>
  order?.customerPhone ||
  order?.customer?.phone ||
  "";


const getTableLabel = (order) => {
  const table =
    order?.tableNumber ??
    order?.tableId ??
    order?.table ??
    "";

  if (
    table === "" ||
    table === null ||
    table === undefined
  ) {
    return "Takeaway";
  }

  const value = String(table);

  if (
    value
      .toLowerCase()
      .startsWith("table")
  ) {
    return value;
  }

  return `Table ${value}`;
};


const getItemCount = (order) => {
  if (!Array.isArray(order?.items)) {
    return 0;
  }

  return order.items.reduce(
    (total, item) =>
      total +
      Number(item?.quantity || 0),
    0
  );
};


const getItemSummary = (order) => {
  if (
    !Array.isArray(order?.items) ||
    order.items.length === 0
  ) {
    return "No item details";
  }

  return order.items
    .map((item) => {
      const name =
        item?.name ||
        item?.menuItemName ||
        item?.menuItem?.name ||
        "Item";

      const quantity =
        Number(item?.quantity || 0);

      return quantity > 0
        ? `${name} × ${quantity}`
        : name;
    })
    .join(", ");
};


/* ============================================================
   PAYMENT ICON
   IMPORTANT:
   Do NOT create a component reference inside render.
============================================================ */

function PaymentIconDisplay({ order }) {
  const mode = getPayMode(order);

  const iconClass =
    mode === "cash" ||
    mode === "cod"
      ? "text-[#BF770E]"
      : "text-[#287D68]";

  if (
    mode === "cash" ||
    mode === "cod"
  ) {
    return (
      <Banknote
        size={12}
        className={iconClass}
      />
    );
  }

  if (mode === "card") {
    return (
      <CreditCard
        size={12}
        className={iconClass}
      />
    );
  }

  return (
    <Smartphone
      size={12}
      className={iconClass}
    />
  );
}


/* ============================================================
   STATUS ICON
   IMPORTANT:
   Do NOT assign StatusIcon = ... inside render.
============================================================ */

function StatusIconDisplay({ order }) {
  const status = getStatus(order);

  if (
    status === "cancelled" ||
    status === "canceled"
  ) {
    return (
      <XCircle size={10} />
    );
  }

  if (
    status === "completed" ||
    status === "collected" ||
    status === "delivered"
  ) {
    return (
      <CheckCircle2 size={10} />
    );
  }

  return (
    <Clock3 size={10} />
  );
}


/* ============================================================
   PAGE
============================================================ */

function OrderHistoryPage() {
  const merchant = useSelector(
    (state) =>
      state.merchant?.merchant
  );

  const merchantId =
    merchant?._id ||
    merchant?.id ||
    "";


  /* ==========================================================
     STATE
  ========================================================== */

  const [orders, setOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [ordersError, setOrdersError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [paymentFilter, setPaymentFilter] =
    useState("all");

  const [sortOrder, setSortOrder] =
    useState("newest");


  /* ==========================================================
     LOAD ORDERS
  ========================================================== */

const loadOrders = useCallback(async () => {
  if (!merchantId) {
    return;
  }

  setOrdersLoading(true);
  setOrdersError("");

  try {
    const response = await apiRequest(
      `/orders/merchant/${merchantId}`,
      {
        method: "GET",
      }
    );

    console.log(
      "ORDER HISTORY ORDERS:",
      response
    );

    let rawOrders = [];

    if (Array.isArray(response)) {
      rawOrders = response;
    } else if (
      Array.isArray(response?.orders)
    ) {
      rawOrders = response.orders;
    } else if (
      Array.isArray(response?.data)
    ) {
      rawOrders = response.data;
    } else if (
      Array.isArray(response?.data?.orders)
    ) {
      rawOrders = response.data.orders;
    }

    setOrders(rawOrders);
  } catch (error) {
    console.error(
      "Failed to load order history:",
      error
    );

    setOrders([]);

    setOrdersError(
      error?.message ||
        "Unable to load order history."
    );
  } finally {
    setOrdersLoading(false);
  }
}, [merchantId]);


/* ==========================================================
   INITIAL LOAD
   Defer the API call outside the synchronous effect body.
========================================================== */

useEffect(() => {
  if (!merchantId) {
    return;
  }

  const timer = window.setTimeout(() => {
    loadOrders();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, [merchantId, loadOrders]);

  /* ==========================================================
     SUMMARY
  ========================================================== */

  const summary = useMemo(() => {
    let totalSales = 0;
    let completed = 0;
    let cancelled = 0;
    let digital = 0;

    orders.forEach((order) => {
      const status =
        getStatus(order);

      const total =
        getOrderTotal(order);

      const payment =
        getPayMode(order);

      if (
        status === "completed" ||
        status === "collected" ||
        status === "delivered"
      ) {
        completed += 1;
        totalSales += total;
      }

      if (
        status === "cancelled" ||
        status === "canceled"
      ) {
        cancelled += 1;
      }

      if (
        payment === "digital" ||
        payment === "upi" ||
        payment === "razorpay" ||
        payment === "card"
      ) {
        digital += 1;
      }
    });

    return {
      totalOrders: orders.length,
      totalSales,
      completed,
      cancelled,
      digital,
    };
  }, [orders]);


  /* ==========================================================
     FILTERED ORDERS
  ========================================================== */

  const filteredOrders = useMemo(() => {
    const query =
      search
        .trim()
        .toLowerCase();

    const now = new Date();

    const startOfToday =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    const startOfWeek =
      new Date(startOfToday);

    startOfWeek.setDate(
      startOfWeek.getDate() - 6
    );

    const startOfMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const filtered =
      orders.filter((order) => {
        const orderDate =
          new Date(
            order?.createdAt ||
              order?.updatedAt
          );


        /* SEARCH */

        if (query) {
          const token =
            getToken(order)
              .toLowerCase();

          const orderId =
            String(
              getOrderId(order)
            ).toLowerCase();

          const customer =
            getCustomerName(order)
              .toLowerCase();

          const phone =
            getCustomerPhone(order)
              .toLowerCase();

          const items =
            getItemSummary(order)
              .toLowerCase();

          const matchesSearch =
            token.includes(query) ||
            orderId.includes(query) ||
            customer.includes(query) ||
            phone.includes(query) ||
            items.includes(query);

          if (!matchesSearch) {
            return false;
          }
        }


        /* DATE */

        if (
          dateFilter !== "all"
        ) {
          if (
            Number.isNaN(
              orderDate.getTime()
            )
          ) {
            return false;
          }

          if (
            dateFilter === "today" &&
            orderDate < startOfToday
          ) {
            return false;
          }

          if (
            dateFilter === "7days" &&
            orderDate < startOfWeek
          ) {
            return false;
          }

          if (
            dateFilter === "month" &&
            orderDate < startOfMonth
          ) {
            return false;
          }
        }


        /* STATUS */

        if (
          statusFilter !== "all" &&
          getStatus(order) !==
            statusFilter
        ) {
          return false;
        }


        /* PAYMENT */

        if (
          paymentFilter !== "all"
        ) {
          const payment =
            getPayMode(order);

          if (
            paymentFilter ===
              "digital" &&
            ![
              "digital",
              "upi",
              "razorpay",
              "card",
            ].includes(payment)
          ) {
            return false;
          }

          if (
            paymentFilter ===
              "cash" &&
            ![
              "cash",
              "cod",
            ].includes(payment)
          ) {
            return false;
          }
        }

        return true;
      });


    return filtered.sort(
      (a, b) => {
        const dateA =
          new Date(
            a?.createdAt ||
              a?.updatedAt ||
              0
          ).getTime();

        const dateB =
          new Date(
            b?.createdAt ||
              b?.updatedAt ||
              0
          ).getTime();

        return sortOrder === "newest"
          ? dateB - dateA
          : dateA - dateB;
      }
    );
  }, [
    orders,
    search,
    dateFilter,
    statusFilter,
    paymentFilter,
    sortOrder,
  ]);


  /* ==========================================================
     CLEAR FILTERS
  ========================================================== */

  const clearFilters = () => {
    setSearch("");
    setDateFilter("all");
    setStatusFilter("all");
    setPaymentFilter("all");
  };


  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section className="min-h-full bg-[#F7F3ED] px-5 py-5 lg:px-7">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#282521] text-[#E6A23C] shadow-sm">
            <Archive
              size={18}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-[20px] font-semibold tracking-[-0.03em] text-[#241F1A]">
                Order History
              </h1>

              <Chip
                icon={
                  <FileText
                    size={11}
                  />
                }
                label="ARCHIVE"
                size="small"
                sx={{
                  height: 19,
                  borderRadius: "6px",
                  background: "#EAF5F1",
                  color: "#287A66",
                  fontSize: "8px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  "& .MuiChip-label": {
                    px: 0.8,
                  },
                  "& .MuiChip-icon": {
                    color: "#287A66",
                    ml: 0.6,
                  },
                }}
              />

            </div>

            <p className="mt-0.5 truncate text-[11px] text-[#8A7E71]">
              Review completed orders, payments, customers and sales history.
            </p>

          </div>

        </div>


        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <div className="flex items-center gap-2">

          <Tooltip title="Refresh order history">

            <button
              type="button"
              onClick={() => {
  setOrdersLoading(true);
  loadOrders();
}}
              disabled={ordersLoading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCD1C5] bg-white text-[#756A5E] shadow-sm transition hover:border-[#CDBEAE] hover:bg-[#FCFAF7] hover:text-[#302A24] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={13}
                className={
                  ordersLoading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

          </Tooltip>


          <div className="flex items-center gap-1 rounded-lg border border-[#DCD1C5] bg-white p-1">

            <button
              type="button"
              onClick={() =>
                setSortOrder("newest")
              }
              className={`flex h-7 items-center gap-1 rounded-md px-2.5 text-[9px] font-bold transition ${
                sortOrder === "newest"
                  ? "bg-[#282521] text-white shadow-sm"
                  : "text-[#817568] hover:text-[#302A24]"
              }`}
            >
              <ArrowDown
                size={11}
              />
              Newest
            </button>


            <button
              type="button"
              onClick={() =>
                setSortOrder("oldest")
              }
              className={`flex h-7 items-center gap-1 rounded-md px-2.5 text-[9px] font-bold transition ${
                sortOrder === "oldest"
                  ? "bg-[#282521] text-white shadow-sm"
                  : "text-[#817568] hover:text-[#302A24]"
              }`}
            >
              <ArrowUp
                size={11}
              />
              Oldest
            </button>

          </div>

        </div>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {ordersError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#E8C0BD] bg-[#FFF1F0] px-3.5 py-2.5 text-[10px] font-semibold text-[#B44842]">

          <XCircle
            size={13}
          />

          <span>
            {ordersError}
          </span>

        </div>
      )}


      {/* ======================================================
          KPI STRIP
      ====================================================== */}

      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">

        <HistoryKpi
          icon={ShoppingBag}
          label="Total orders"
          value={
            ordersLoading
              ? "..."
              : summary.totalOrders
          }
          detail="All records"
        />


        <HistoryKpi
          icon={IndianRupee}
          label="Completed sales"
          value={
            ordersLoading
              ? "..."
              : formatINR(
                  summary.totalSales
                )
          }
          detail={`${summary.completed} completed`}
          tone="green"
        />


        <HistoryKpi
          icon={Smartphone}
          label="Digital orders"
          value={
            ordersLoading
              ? "..."
              : summary.digital
          }
          detail="UPI / cards"
          tone="amber"
        />


        <HistoryKpi
          icon={XCircle}
          label="Cancelled"
          value={
            ordersLoading
              ? "..."
              : summary.cancelled
          }
          detail="Order records"
          tone="red"
        />

      </div>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_245px]">

        {/* ====================================================
            ORDER HISTORY TABLE
        ==================================================== */}

        <main className="min-w-0 overflow-hidden rounded-xl border border-[#DED3C5] bg-white shadow-sm">

          {/* Header */}

          <div className="border-b border-[#E9E0D5] px-4 py-3.5">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-[13px] font-bold text-[#302A24]">
                    Order records
                  </h2>

                  <span className="rounded-full bg-[#F0EBE3] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[#817568]">
                    {filteredOrders.length}{" "}
                    {filteredOrders.length === 1
                      ? "record"
                      : "records"}
                  </span>

                </div>

                <p className="mt-0.5 text-[10px] text-[#978B7E]">
                  Search and review orders stored for this outlet.
                </p>

              </div>


              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-[#5F746C]">

                <span className="relative flex h-2 w-2">

                  <span className="absolute h-full w-full animate-ping rounded-full bg-[#2CA982]/30" />

                  <span className="relative h-2 w-2 rounded-full bg-[#2CA982]" />

                </span>

                Live order data

              </div>

            </div>


            {/* SEARCH */}

            <div className="relative mt-3">

              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A99E92]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search token, order reference, customer or item..."
                className="
                  h-9
                  w-full
                  rounded-lg
                  border
                  border-[#DCD1C5]
                  bg-[#FCFAF7]
                  pl-9
                  pr-3
                  text-[11px]
                  font-medium
                  text-[#29251F]
                  outline-none
                  placeholder:text-[#A79C91]
                  transition
                  hover:border-[#CEC0B1]
                  focus:border-[#D49A42]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#E6A23C]/10
                "
              />

            </div>


            {/* FILTERS */}

            <div className="mt-3 flex flex-wrap items-center gap-2">

              <FilterSelect
                icon={CalendarDays}
                value={dateFilter}
                onChange={setDateFilter}
                options={[
                  ["all", "All dates"],
                  ["today", "Today"],
                  ["7days", "Last 7 days"],
                  ["month", "This month"],
                ]}
              />


              <FilterSelect
                icon={Clock3}
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  ["all", "All statuses"],
                  ["completed", "Completed"],
                  ["collected", "Collected"],
                  ["preparing", "Preparing"],
                  ["ready", "Ready"],
                  ["cancelled", "Cancelled"],
                ]}
              />


              <FilterSelect
                icon={CreditCard}
                value={paymentFilter}
                onChange={setPaymentFilter}
                options={[
                  ["all", "All payments"],
                  ["cash", "Cash"],
                  ["digital", "Digital"],
                ]}
              />


              {(search ||
                dateFilter !== "all" ||
                statusFilter !== "all" ||
                paymentFilter !== "all") && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto flex h-8 items-center gap-1 rounded-lg px-2.5 text-[9px] font-bold text-[#8A7E71] transition hover:bg-[#F5EFE8] hover:text-[#302A24]"
                >

                  <X size={11} />

                  Clear filters

                </button>

              )}

            </div>

          </div>


          {/* ==================================================
              DESKTOP COLUMN HEADER
          ================================================== */}

          <div className="hidden grid-cols-[110px_minmax(150px,1.2fr)_minmax(145px,1.1fr)_105px_95px_105px] items-center gap-3 border-b border-[#EFE6DC] bg-[#FCFAF7] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#938578] lg:grid">

            <span>Token</span>

            <span>Order</span>

            <span>Customer</span>

            <span>Payment</span>

            <span>Amount</span>

            <span className="text-right">
              Status
            </span>

          </div>


          {/* ==================================================
              ROWS
          ================================================== */}

          {ordersLoading ? (
            <HistoryLoading />
          ) : filteredOrders.length > 0 ? (

            <div>
              {filteredOrders.map(
                (order) => (
                  <HistoryRow
                    key={
                      getOrderId(order) ||
                      `${getToken(order)}-${order?.createdAt}`
                    }
                    order={order}
                  />
                )
              )}
            </div>

          ) : (

            <HistoryEmpty
              hasFilters={
                Boolean(
                  search ||
                    dateFilter !== "all" ||
                    statusFilter !== "all" ||
                    paymentFilter !== "all"
                )
              }
              onClear={clearFilters}
            />

          )}

        </main>


        {/* ====================================================
            RIGHT — HISTORY SUMMARY
        ==================================================== */}

        <aside className="h-fit overflow-hidden rounded-xl bg-[#292622] text-white shadow-[0_10px_28px_rgba(37,31,24,0.15)]">

          {/* Header */}

          <div className="border-b border-white/[0.08] px-4 py-3.5">

            <div className="flex items-center gap-2.5">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6A23C] text-[#2B2115]">

                <Archive
                  size={15}
                />

              </div>

              <div>

                <p className="text-[12px] font-bold">
                  History summary
                </p>

                <p className="mt-0.5 text-[9px] text-[#8E877F]">
                  Outlet order position
                </p>

              </div>

            </div>

          </div>


          {/* Total sales */}

          <div className="px-4 pt-4">

            <div className="rounded-[15px] border border-white/[0.09] bg-white/[0.035] p-4">

              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#948A80]">
                Completed sales
              </p>

              <p className="mt-1 text-[29px] font-bold tracking-[-0.055em] text-[#F0B44F]">
                {ordersLoading
                  ? "..."
                  : formatINR(
                      summary.totalSales
                    )}
              </p>

              <div className="mt-3 flex items-center gap-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-[#E6A23C]" />

                <span className="text-[8px] text-[#928980]">
                  Collected / completed orders
                </span>

              </div>

            </div>

          </div>


          {/* Stats */}

          <div className="px-4 py-3.5">

            <HistoryPositionRow
              icon={ShoppingBag}
              label="Total orders"
              value={
                ordersLoading
                  ? "..."
                  : summary.totalOrders
              }
            />

            <HistoryPositionRow
              icon={CheckCircle2}
              label="Completed"
              value={
                ordersLoading
                  ? "..."
                  : summary.completed
              }
              tone="green"
            />

            <HistoryPositionRow
              icon={Smartphone}
              label="Digital"
              value={
                ordersLoading
                  ? "..."
                  : summary.digital
              }
              tone="amber"
            />

            <HistoryPositionRow
              icon={XCircle}
              label="Cancelled"
              value={
                ordersLoading
                  ? "..."
                  : summary.cancelled
              }
              tone="red"
            />

          </div>


          {/* Information */}

          <div className="border-t border-white/[0.08] px-4 py-4">

            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.14em] text-[#837B73]">
              Record scope
            </p>

            <div className="rounded-[12px] border border-white/[0.08] bg-white/[0.025] p-3">

              <div className="flex items-start gap-2.5">

                <FileText
                  size={15}
                  className="mt-0.5 shrink-0 text-[#E6A23C]"
                />

                <div>

                  <p className="text-[10px] font-bold text-white">
                    Merchant order archive
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#8E867D]">
                    History is loaded directly from the merchant order records and can be filtered by date, status and payment method.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* Footer */}

          <div className="border-t border-white/[0.08] bg-white/[0.025] px-4 py-3">

            <div className="flex items-center gap-2">

              <RefreshCw
                size={11}
                className="text-[#9C948B]"
              />

              <p className="text-[9px] leading-4 text-[#817A72]">
                Refresh the archive whenever you need the latest order records.
              </p>

            </div>

          </div>

        </aside>

      </div>

    </section>
  );
}


/* ============================================================
   KPI
============================================================ */

function HistoryKpi({
  icon: Icon,
  label,
  value,
  detail,
  tone = "default",
}) {
  const styles = {
    default: {
      icon:
        "bg-[#EEE9E1] text-[#756A5E]",
      value:
        "text-[#302A24]",
      dot:
        "bg-[#8A7E71]",
    },

    green: {
      icon:
        "bg-[#E3F3EC] text-[#267C67]",
      value:
        "text-[#267C67]",
      dot:
        "bg-[#267C67]",
    },

    amber: {
      icon:
        "bg-[#FFF0D2] text-[#BF770E]",
      value:
        "text-[#BF770E]",
      dot:
        "bg-[#BF770E]",
    },

    red: {
      icon:
        "bg-[#FBE7E5] text-[#C6534C]",
      value:
        "text-[#C6534C]",
      dot:
        "bg-[#C6534C]",
    },
  };

  const current =
    styles[tone] ||
    styles.default;

  return (
    <div className="rounded-xl border border-[#DED3C5] bg-white px-3.5 py-3 shadow-sm">

      <div className="flex items-center gap-2.5">

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${current.icon}`}
        >
          <Icon size={14} />
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-1.5">

            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#95897B]">
              {label}
            </p>

            <span
              className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
            />

          </div>

          <div className="mt-0.5 flex items-baseline gap-1.5">

            <p
              className={`text-[17px] font-bold tracking-[-0.03em] ${current.value}`}
            >
              {value}
            </p>

            <span className="truncate text-[9px] text-[#A09689]">
              {detail}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   FILTER SELECT
============================================================ */

function FilterSelect({
  icon: Icon,
  value,
  onChange,
  options,
}) {
  return (
    <div className="relative">

      <Icon
        size={11}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94887B]"
      />

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          h-8
          appearance-none
          rounded-lg
          border
          border-[#DDD3C7]
          bg-[#FCFAF7]
          pl-7
          pr-7
          text-[9px]
          font-semibold
          text-[#5F554C]
          outline-none
          transition
          hover:border-[#CFC2B4]
          focus:border-[#D49A42]
          focus:ring-2
          focus:ring-[#E6A23C]/10
        "
      >

        {options.map(
          ([optionValue, label]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {label}
            </option>
          )
        )}

      </select>

    </div>
  );
}


/* ============================================================
   HISTORY ROW
============================================================ */

function HistoryRow({
  order,
}) {
  const token =
    getToken(order);

  const orderId =
    getOrderId(order);

  const total =
    getOrderTotal(order);

  const customer =
    getCustomerName(order);

  const phone =
    getCustomerPhone(order);

  const payment =
    getPaymentLabel(order);

  const statusConfig =
    getStatusConfig(order);

  const itemCount =
    getItemCount(order);

  const itemSummary =
    getItemSummary(order);


  return (
    <div className="group border-b border-[#EFE6DC] px-4 py-3.5 last:border-b-0 hover:bg-[#FFFCF8]">

      {/* ==================================================
          DESKTOP
      ================================================== */}

      <div className="hidden grid-cols-[110px_minmax(150px,1.2fr)_minmax(145px,1.1fr)_105px_95px_105px] items-center gap-3 lg:grid">

        {/* Token */}

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EBDD] text-[#C77C1F]">

            <Hash size={14} />

          </div>

          <div className="min-w-0">

            <p className="truncate text-[11px] font-bold text-[#302B26]">
              {token
                ? `#${token.replace(
                    /^#/,
                    ""
                  )}`
                : "—"}
            </p>

            <p className="mt-0.5 text-[8px] text-[#95897D]">
              {formatTime(
                order?.createdAt
              )}
            </p>

          </div>

        </div>


        {/* Order */}

        <div className="min-w-0">

          <p className="text-[10px] font-semibold text-[#403932]">
            {getTableLabel(order)}
          </p>

          <p
            title={orderId}
            className="mt-0.5 truncate font-mono text-[8px] text-[#81766B]"
          >
            {orderId || "No reference"}
          </p>

        </div>


        {/* Customer */}

        <div className="min-w-0">

          <p className="truncate text-[10px] font-semibold text-[#403932]">
            {customer}
          </p>

          <p className="mt-0.5 truncate text-[8px] text-[#95897D]">
            {phone ||
              `${itemCount} ${
                itemCount === 1
                  ? "item"
                  : "items"
              }`}
          </p>

        </div>


        {/* Payment */}

        <div className="flex items-center gap-1.5">

          <PaymentIconDisplay
            order={order}
          />

          <span className="text-[9px] font-semibold text-[#675D53]">
            {payment}
          </span>

        </div>


        {/* Amount */}

        <div>

          <p className="text-[12px] font-bold text-[#302A24]">
            {formatINR(total)}
          </p>

          <p className="mt-0.5 text-[8px] text-[#9B9084]">
            {formatDate(
              order?.createdAt
            )}
          </p>

        </div>


        {/* Status */}

        <div className="flex justify-end">

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-bold ${statusConfig.classes}`}
          >

            <StatusIconDisplay
              order={order}
            />

            {getStatusLabel(order)}

          </span>

        </div>

      </div>


      {/* ==================================================
          MOBILE / TABLET
      ================================================== */}

      <div className="lg:hidden">

        <div className="flex items-start justify-between gap-3">

          <div className="flex min-w-0 items-center gap-2.5">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5EBDD] text-[#C77C1F]">

              <Hash size={14} />

            </div>

            <div className="min-w-0">

              <p className="truncate text-[12px] font-bold text-[#302B26]">
                {token
                  ? `#${token.replace(
                      /^#/,
                      ""
                    )}`
                  : "Order"}
              </p>

              <p className="mt-0.5 truncate text-[9px] text-[#95897D]">
                {customer}
              </p>

            </div>

          </div>


          <div className="shrink-0 text-right">

            <p className="text-[14px] font-bold text-[#302A24]">
              {formatINR(total)}
            </p>

            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-bold ${statusConfig.classes}`}
            >

              <StatusIconDisplay
                order={order}
              />

              {getStatusLabel(order)}

            </span>

          </div>

        </div>


        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">

          <HistoryInfo
            label="Order reference"
            value={orderId || "—"}
            mono
          />

          <HistoryInfo
            label="Date"
            value={formatDate(
              order?.createdAt
            )}
          />

          <HistoryInfo
            label="Payment"
            value={payment}
          />

          <HistoryInfo
            label="Service"
            value={getTableLabel(order)}
          />

        </div>


        <div className="mt-3 rounded-lg bg-[#FCFAF7] px-3 py-2.5">

          <div className="flex items-start gap-2">

            <ShoppingBag
              size={12}
              className="mt-0.5 shrink-0 text-[#A08F7E]"
            />

            <p className="text-[9px] leading-4 text-[#71665B]">
              {itemSummary}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   HISTORY INFO
============================================================ */

function HistoryInfo({
  label,
  value,
  mono = false,
}) {
  return (
    <div className="min-w-0">

      <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#988C80]">
        {label}
      </p>

      <p
        className={`mt-0.5 truncate text-[10px] font-medium text-[#4D453E] ${
          mono
            ? "font-mono text-[8px]"
            : ""
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   RIGHT POSITION ROW
============================================================ */

function HistoryPositionRow({
  icon: Icon,
  label,
  value,
  tone = "default",
}) {
  const color =
    tone === "green"
      ? "text-[#59B99D]"
      : tone === "amber"
      ? "text-[#E1A84F]"
      : tone === "red"
      ? "text-[#DD7770]"
      : "text-[#E5DED5]";

  const iconColor =
    tone === "green"
      ? "text-[#59B99D]"
      : tone === "amber"
      ? "text-[#E1A84F]"
      : tone === "red"
      ? "text-[#DD7770]"
      : "text-[#777069]";

  return (
    <div className="flex items-center gap-2.5 border-b border-white/[0.07] py-2.5 last:border-0">

      <Icon
        size={12}
        className={iconColor}
      />

      <span className="text-[10px] text-[#A39B92]">
        {label}
      </span>

      <span
        className={`ml-auto text-[11px] font-bold ${color}`}
      >
        {value}
      </span>

    </div>
  );
}


/* ============================================================
   LOADING
============================================================ */

function HistoryLoading() {
  return (
    <div className="space-y-0">

      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="flex items-center gap-4 border-b border-[#EFE6DC] px-4 py-4"
          >

            <div className="h-8 w-8 animate-pulse rounded-lg bg-[#F0EBE3]" />

            <div className="flex-1">

              <div className="h-2.5 w-32 animate-pulse rounded bg-[#F0EBE3]" />

              <div className="mt-2 h-2 w-20 animate-pulse rounded bg-[#F5F0E9]" />

            </div>

            <div className="hidden h-2.5 w-24 animate-pulse rounded bg-[#F0EBE3] sm:block" />

            <div className="hidden h-2.5 w-16 animate-pulse rounded bg-[#F0EBE3] sm:block" />

          </div>
        )
      )}

    </div>
  );
}


/* ============================================================
   EMPTY
============================================================ */

function HistoryEmpty({
  hasFilters,
  onClear,
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EBDD] text-[#C77C1F]">

        <Archive size={19} />

      </div>


      <h3 className="mt-3 text-[13px] font-bold text-[#302B26]">
        {hasFilters
          ? "No matching orders"
          : "No order history"}
      </h3>


      <p className="mt-1 max-w-sm text-[10px] leading-4 text-[#8B7F73]">

        {hasFilters
          ? "Try changing your search or filters to find another order."
          : "Orders from this outlet will appear here once they are available."}

      </p>


      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 flex h-8 items-center gap-1.5 rounded-lg bg-[#282521] px-3 text-[9px] font-bold text-white transition hover:bg-[#1D1B18]"
        >

          <X size={11} />

          Clear filters

        </button>
      )}

    </div>
  );
}


export default OrderHistoryPage;