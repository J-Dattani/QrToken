import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMerchantOrders,
  changeOrderStatus,
} from "../redux/thunks/orderThunks";

import TaxReceiptModal from "../components/tracking/TaxReceiptModal";

import {
  Search,
  Volume2,
  VolumeX,
  Plus,
  ChevronRight,
  X,
  UserRound,
  Clock3,
  CreditCard,
  Banknote,
  Phone,
  CheckCircle2,
  ChefHat,
  ReceiptText,
  Printer,
  ArrowRight,
  Zap,
  ShoppingBag,
  Timer,
  WalletCards,
} from "lucide-react";


/* =========================================================
   FORMAT ORDER TIME
========================================================= */

function formatOrderTime(createdAt) {
  if (!createdAt) return "";

  const created = new Date(createdAt);
  const now = new Date();

  const diffMs = now - created;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  return created.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}


/* =========================================================
   MAP API ORDER
========================================================= */

function mapApiOrder(order) {
  const paymentType =
    order.payMode?.toLowerCase() === "cash"
      ? "cash"
      : "digital";

  const payment =
    paymentType === "cash" &&
    order.paymentStatus === "pending"
      ? "CASH PENDING"
      : "PAID";

  return {
    id: order._id,

    token: order.tokenNumber,

    time: formatOrderTime(order.createdAt),

    customer: order.customerName || "Guest",

    phoneNumber: order.customerPhone || "",

    orderType: order.tableId
      ? `Table ${order.tableId}`
      : "Counter Takeaway",

    status: order.status?.toUpperCase(),

    payment,

    paymentType,

    items: (order.items || []).map((item) => ({
      name: item.name,
      qty: item.quantity,
      price: item.price,
    })),

    amount: order.total,

    // Keep complete API order for GST receipt
    originalOrder: order,
  };
}


/* =========================================================
   LIVE ORDERS PAGE
========================================================= */

function LiveOrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const merchant = useSelector(
    (state) => state.merchant.merchant
  );

  const apiOrders = useSelector(
    (state) => state.orders.orders
  );


  /* =======================================================
     RECEIPT STATE
  ======================================================= */

  const [receiptOrder, setReceiptOrder] = useState(null);


  /* =======================================================
     LIVE ORDERS
  ======================================================= */

  const orders = useMemo(
    () =>
      apiOrders
        .map(mapApiOrder)
        .filter(
          (order) =>
            order.status !== "COMPLETED" &&
            order.status !== "COLLECTED"
        ),
    [apiOrders]
  );


  /* =======================================================
     LOCAL UI STATE
  ======================================================= */

  const [soundOn, setSoundOn] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [paymentFilter, setPaymentFilter] =
    useState("ALL");

  const [selectedOrder, setSelectedOrder] =
    useState(null);


  /* =======================================================
     FETCH ORDERS
  ======================================================= */

  useEffect(() => {
    if (!merchant?._id) return;

    // Fetch immediately when page opens
    dispatch(fetchMerchantOrders());

    // Keep checking for new / updated orders
    const interval = setInterval(() => {
      dispatch(fetchMerchantOrders());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch, merchant?._id]);


  /* =======================================================
     FILTERED ORDERS
  ======================================================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        order.token.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "ALL" ||
        order.paymentType === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ]);


  /* =======================================================
     ORDER ACTION
  ======================================================= */

  const handleOrderAction = async (order) => {
    if (!order?.originalOrder?._id) {
      console.error("Order ID not available");
      return;
    }

    let nextStatus = null;

    if (order.status === "RECEIVED") {
      nextStatus = "preparing";
    } else if (order.status === "PREPARING") {
      nextStatus = "ready";
    } else if (
      order.status === "READY" &&
      order.paymentType === "cash"
    ) {
      nextStatus = "collected";
    } else if (
      order.status === "READY" &&
      order.paymentType === "digital"
    ) {
      nextStatus = "completed";
    }

    if (!nextStatus) {
      return;
    }

    try {
      await dispatch(
        changeOrderStatus(
          order.originalOrder._id,
          nextStatus
        )
      );

      await dispatch(fetchMerchantOrders());

      setSelectedOrder(null);
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );
    }
  };


  /* =======================================================
     DETAILS MODAL ACTION
  ======================================================= */

  const handleDetailsAdvance = () => {
    if (!selectedOrder) return;

    handleOrderAction(selectedOrder);
  };


  /* =======================================================
     ACTION CONFIG
  ======================================================= */

  const getActionConfig = (order) => {
    if (order.status === "RECEIVED") {
      return {
        label: "Start Preparing",
        icon: ChefHat,
        type: "preparing",
      };
    }

    if (order.status === "PREPARING") {
      return {
        label: "Ready",
        icon: CheckCircle2,
        type: "ready",
      };
    }

    if (
      order.status === "READY" &&
      order.paymentType === "cash"
    ) {
      return {
        label: "Collect",
        icon: Banknote,
        type: "collect",
      };
    }

    if (
      order.status === "READY" &&
      order.paymentType === "digital"
    ) {
      return {
        label: "Complete",
        icon: CheckCircle2,
        type: "complete",
      };
    }

    return {
      label: "Complete",
      icon: CheckCircle2,
      type: "complete",
    };
  };


  /* =======================================================
     QUEUE COUNTS
  ======================================================= */

  const preparingCount = orders.filter(
    (order) =>
      order.status === "PREPARING"
  ).length;

  const readyCount = orders.filter(
    (order) =>
      order.status === "READY"
  ).length;

  const receivedCount = orders.filter(
    (order) =>
      order.status === "RECEIVED"
  ).length;


  /* =======================================================
     PAYMENT TOTALS
  ======================================================= */

  const paymentTotals = useMemo(() => {
    const cash = orders
      .filter(
        (order) =>
          order.paymentType === "cash"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.amount || 0),
        0
      );

    const digital = orders
      .filter(
        (order) =>
          order.paymentType === "digital"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.amount || 0),
        0
      );

    const total = cash + digital;

    return {
      cash,
      digital,

      cashPercent:
        total > 0
          ? Math.round(
              (cash / total) * 100
            )
          : 0,

      digitalPercent:
        total > 0
          ? Math.round(
              (digital / total) * 100
            )
          : 0,
    };
  }, [orders]);


  /* =======================================================
     UI
  ======================================================= */

  return (
    <section className="min-h-screen bg-[#F7F3ED] px-4 py-5 text-[#241F1A] lg:px-7">

      {/* =================================================
          PAGE INTRO
      ================================================= */}

      <div className="mb-5 flex items-end justify-between gap-4">

        <div>

          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A7C6C]">

            <span className="h-1.5 w-1.5 rounded-full bg-[#C77C1F]" />

            Today's service

          </div>

          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#201C18]">
            Live Orders
          </h1>

          <p className="mt-0.5 text-[12px] text-[#8A7C6C]">
            Monitor incoming tokens and kitchen progress in real time.
          </p>

        </div>


        <div className="hidden items-center gap-2 sm:flex">

          <div className="flex items-center gap-2 rounded-lg border border-[#E4D8C9] bg-white px-3 py-2">

            <Zap
              size={14}
              className="text-[#C77C1F]"
            />

            <div className="leading-tight">

              <p className="text-[10px] uppercase tracking-[0.08em] text-[#9A8D7D]">
                Shift performance
              </p>

              <p className="text-xs font-semibold text-[#2A241E]">
                ↑ 18%
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              setSoundOn(
                (value) => !value
              )
            }
            className="flex h-9 items-center gap-2 rounded-lg border border-[#E4D8C9] bg-white px-3 text-xs font-medium text-[#40382F] transition hover:border-[#CDBA9E] hover:shadow-sm"
          >

            {soundOn ? (
              <Volume2 size={15} />
            ) : (
              <VolumeX size={15} />
            )}

            Sound

          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/owner/manual")
            }
            className="flex h-9 items-center gap-2 rounded-lg bg-[#282521] px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#181614]"
          >

            <Plus size={15} />

            Manual order

          </button>

        </div>

      </div>


      {/* =================================================
          KPI STRIP
      ================================================= */}

      <div className="mb-5 grid grid-cols-2 overflow-hidden rounded-xl border border-[#E4D8C9] bg-white lg:grid-cols-4">

        <Metric
          icon={ShoppingBag}
          label="Orders today"
          value="142"
          sub="+18% vs yesterday"
        />

        <Metric
          icon={WalletCards}
          label="Revenue"
          value="₹4,820"
          sub="₹3,180 digital"
        />

        <Metric
          icon={Timer}
          label="Average wait"
          value="3.4 min"
          sub="Token → ready"
        />

        <Metric
          icon={Banknote}
          label="Cash pending"
          value="₹340"
          sub="4 orders"
        />

      </div>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_270px]">


        {/* =================================================
            QUEUE
        ================================================= */}

        <div className="min-w-0">


          {/* Queue toolbar */}

          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#282521] text-white">
                <Zap size={15} />
              </div>

              <div>

                <h2 className="text-xs font-semibold text-[#28231E]">
                  Live queue
                </h2>

                <p className="text-[10px] text-[#958879]">
                  {filteredOrders.length} orders visible
                </p>

              </div>

            </div>


            {/* Status tabs */}

            <div className="flex items-center rounded-lg border border-[#E4D8C9] bg-white p-0.5">

              {[
                ["ALL", "All"],
                ["RECEIVED", "Received"],
                ["PREPARING", "Preparing"],
                ["READY", "Ready"],
              ].map(([value, label]) => (

                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(value)
                  }
                  className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition ${
                    statusFilter === value
                      ? "bg-[#282521] text-white shadow-sm"
                      : "text-[#74695D] hover:bg-[#F5EFE7]"
                  }`}
                >
                  {label}
                </button>

              ))}

            </div>

          </div>


          {/* Search */}

          <div className="mb-2.5 flex gap-2">

            <div className="relative min-w-0 flex-1">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9D9183]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search token or item..."
                className="h-9 w-full rounded-lg border border-[#E4D8C9] bg-white pl-9 pr-10 text-xs text-[#2A241E] outline-none transition placeholder:text-[#A79B8E] focus:border-[#C88A32] focus:ring-2 focus:ring-[#C88A32]/10"
              />

              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[#E5DACC] px-1.5 py-0.5 text-[9px] text-[#A19587]">
                /
              </span>

            </div>


            {/* Payment filter */}

            <select
              value={paymentFilter}
              onChange={(event) =>
                setPaymentFilter(
                  event.target.value
                )
              }
              className="h-9 rounded-lg border border-[#E4D8C9] bg-white px-3 text-[11px] font-medium text-[#5F554B] outline-none focus:border-[#C88A32]"
            >

              <option value="ALL">
                All payments
              </option>

              <option value="digital">
                Digital
              </option>

              <option value="cash">
                Cash
              </option>

            </select>

          </div>


          {/* =================================================
              ORDER LIST
          ================================================= */}

          {filteredOrders.length > 0 ? (

            <div className="overflow-hidden rounded-xl border border-[#E4D8C9] bg-white">

              {filteredOrders.map(
                (order, index) => (

                  <OrderRow
                    key={order.token}
                    order={order}
                    isLast={
                      index ===
                      filteredOrders.length - 1
                    }
                    actionConfig={getActionConfig(
                      order
                    )}
                    onAction={() =>
                      handleOrderAction(
                        order
                      )
                    }
                    onDetails={() =>
                      setSelectedOrder(
                        order
                      )
                    }
                  />

                )
              )}

            </div>

          ) : (

            <EmptyState />

          )}

        </div>


        {/* =================================================
            SERVICE PULSE
        ================================================= */}

        <ServicePulse
          active={orders.length}
          received={receivedCount}
          preparing={preparingCount}
          ready={readyCount}
          cashPercent={
            paymentTotals.cashPercent
          }
          digitalPercent={
            paymentTotals.digitalPercent
          }
        />

      </div>


      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      {selectedOrder && (

        <OrderDetailsModal
          order={selectedOrder}
          actionConfig={getActionConfig(
            selectedOrder
          )}
          onClose={() =>
            setSelectedOrder(null)
          }
          onAdvance={
            handleDetailsAdvance
          }
          onPrintReceipt={() => {
            setReceiptOrder(
              selectedOrder
            );
          }}
        />

      )}


      {/* =================================================
          GST RECEIPT MODAL
      ================================================= */}

      {receiptOrder && (

        <TaxReceiptModal
          isOpen={true}
          onClose={() =>
            setReceiptOrder(null)
          }
          order={
            receiptOrder.originalOrder
          }
          merchant={merchant}
        />

      )}

    </section>
  );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({
  icon: Icon,
  label,
  value,
  sub,
}) {
  return (
    <div className="relative flex items-center gap-3 border-b border-[#EDE4DA] px-4 py-3 lg:border-b-0 lg:border-r last:border-r-0">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F8EBD8] text-[#B96F18]">

        <Icon size={15} />

      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#9A8D7E]">
          {label}
        </p>

        <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-[#27221D]">
          {value}
        </p>

        <p className="truncate text-[10px] text-[#958879]">
          {sub}
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   ORDER ROW
========================================================= */

function OrderRow({
  order,
  isLast,
  actionConfig,
  onAction,
  onDetails,
}) {
  const ActionIcon =
    actionConfig.icon;

  const statusColor =
    order.status === "PREPARING"
      ? "bg-[#FFF0D8] text-[#A76410]"
      : "bg-[#E4F3EE] text-[#21705E]";

  const accentColor =
    order.status === "PREPARING"
      ? "bg-[#D98A1B]"
      : "bg-[#36A27E]";

  return (
    <div
      className={`group relative flex min-h-[78px] items-center gap-3 px-3.5 py-2.5 transition hover:bg-[#FFFCF8] ${
        !isLast
          ? "border-b border-[#EEE6DC]"
          : ""
      }`}
    >

      {/* Accent */}

      <div
        className={`absolute bottom-0 left-0 top-0 w-[3px] ${accentColor}`}
      />


      {/* Token */}

      <button
        type="button"
        onClick={onDetails}
        className="w-[88px] shrink-0 text-left"
      >

        <p className="font-mono text-[16px] font-semibold tracking-tight text-[#302A24]">
          {order.token}
        </p>

        <p className="mt-0.5 text-[10px] text-[#A09588]">
          {order.time}
        </p>

      </button>


      {/* Orderer information */}

      <button
        type="button"
        onClick={onDetails}
        className="text-left"
      >

        <div className="w-[125px] shrink-0 text-left lg:w-[145px]">

          <p className="truncate text-[11px] font-semibold text-[#373028]">
            {order.customer}
          </p>

          {order.phoneNumber ? (

            <a
              href={`tel:${order.phoneNumber}`}
              className="mt-0.5 flex w-fit items-center gap-1 text-[10px] text-[#A09588] transition-colors hover:text-[#C47B1C]"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <Phone
                size={9}
                strokeWidth={2}
                className="shrink-0"
              />

              <span>
                {order.phoneNumber}
              </span>

            </a>

          ) : (

            <p className="mt-0.5 text-[10px] text-[#A09588]">
              N/A
            </p>

          )}

        </div>

      </button>


      {/* Order information */}

      <button
        type="button"
        onClick={onDetails}
        className="min-w-0 flex-1 text-left"
      >

        <p className="truncate text-[11px] font-semibold text-[#373028]">

          {order.items
            .map(
              (item) =>
                `${item.name} ×${item.qty}`
            )
            .join(", ")}

        </p>


        <div className="mt-1.5 flex items-center gap-1.5">

          <span
            className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${
              order.paymentType ===
              "digital"
                ? "bg-[#E5F4EF] text-[#21715E]"
                : "bg-[#FFF0D3] text-[#A5660A]"
            }`}
          >
            {order.payment}
          </span>

          <span className="text-[#B3A79A]">
            ·
          </span>

          <span
            className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${statusColor}`}
          >
            {order.status}
          </span>

        </div>

      </button>


      {/* Mini progress */}

      <button
        type="button"
        onClick={onDetails}
        className="text-left"
      >

        <div className="hidden w-[125px] items-center gap-1.5 lg:flex">

          <div
            className={`h-1.5 w-1.5 rounded-full ${
              order.status ===
                "PREPARING" ||
              order.status ===
                "READY"
                ? "bg-[#D88A1A]"
                : "bg-[#D8CEC2]"
            }`}
          />

          <div
            className={`h-[2px] flex-1 ${
              order.status ===
              "READY"
                ? "bg-[#39A47F]"
                : "bg-[#E6D7C5]"
            }`}
          />

          <div
            className={`h-1.5 w-1.5 rounded-full ${
              order.status ===
              "READY"
                ? "bg-[#39A47F]"
                : "bg-[#D8CEC2]"
            }`}
          />

        </div>

      </button>


      {/* Amount */}

      <button
        type="button"
        onClick={onDetails}
        className="text-left"
      >

        <div className="w-[55px] shrink-0 text-right">

          <p className="text-[13px] font-semibold text-[#302A24]">
            ₹{order.amount}
          </p>

          <p className="text-[9px] text-[#A09588]">
            total
          </p>

        </div>

      </button>


      {/* SMART ACTION */}

      <button
        type="button"
        onClick={onAction}
        className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold transition ${
          actionConfig.type ===
          "preparing"
            ? "bg-[#F2E1C7] text-[#9C5F0E] hover:bg-[#EBD4B0]"
            : actionConfig.type ===
              "ready"
            ? "bg-[#E4F3EE] text-[#20705C] hover:bg-[#D6EDE5]"
            : actionConfig.type ===
              "collect"
            ? "bg-[#292622] text-white hover:bg-[#171512]"
            : "bg-[#E4F3EE] text-[#20705C] hover:bg-[#D6EDE5]"
        }`}
      >

        <ActionIcon size={13} />

        <span className="hidden sm:inline">
          {actionConfig.label}
        </span>

      </button>


      {/* Details */}

      <button
        type="button"
        onClick={onDetails}
        aria-label={`View ${order.token} details`}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#B2A69A] transition hover:bg-[#F4ECE3] hover:text-[#4B4239]"
      >

        <ChevronRight size={16} />

      </button>

    </div>
  );
}


/* =========================================================
   SERVICE PULSE
========================================================= */

function ServicePulse({
  active,
  received,
  preparing,
  ready,
  cashPercent,
  digitalPercent,
}) {
  return (
    <aside className="overflow-hidden rounded-xl border border-[#302D29] bg-[#282622] text-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

        <div>

          <p className="text-[11px] font-semibold">
            Service pulse
          </p>

          <p className="mt-0.5 text-[10px] text-white/40">
            Current shift overview
          </p>

        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-[#E6A23C]">
          <Zap size={14} />
        </div>

      </div>


      {/* Active */}

      <div className="border-b border-white/10 px-4 py-4">

        <p className="text-[10px] uppercase tracking-[0.13em] text-white/40">
          Active now
        </p>

        <div className="mt-1 flex items-end gap-2">

          <span className="text-[32px] font-semibold leading-none">
            {active}
          </span>

          <span className="mb-1 text-[10px] font-medium text-[#54C29D]">
            ↗ Live
          </span>

        </div>

      </div>


      {/* Queue */}

      <div className="border-b border-white/10 px-4 py-4">

        <p className="mb-3 text-[10px] uppercase tracking-[0.13em] text-white/40">
          Queue status
        </p>

        <QueueStat
          label="Received"
          value={received}
          dot="bg-[#A8A29C]"
        />

        <QueueStat
          label="Preparing"
          value={preparing}
          dot="bg-[#E2A43A]"
        />

        <QueueStat
          label="Ready"
          value={ready}
          dot="bg-[#4BB793]"
        />

      </div>


      {/* Payment */}

      <div className="px-4 py-4">

        <p className="mb-3 text-[10px] uppercase tracking-[0.13em] text-white/40">
          Payment mix
        </p>

        <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10">

          <div
            className="bg-[#E6A23C]"
            style={{
              width: `${digitalPercent}%`,
            }}
          />

          <div
            className="bg-[#54B996]"
            style={{
              width: `${cashPercent}%`,
            }}
          />

        </div>


        <div className="mt-2 flex justify-between text-[9px]">

          <span className="text-white/50">

            <span className="mr-1 text-[#E6A23C]">
              ●
            </span>

            Digital{" "}

            <strong className="text-white">
              {digitalPercent}%
            </strong>

          </span>


          <span className="text-white/50">

            <span className="mr-1 text-[#54B996]">
              ●
            </span>

            Cash{" "}

            <strong className="text-white">
              {cashPercent}%
            </strong>

          </span>

        </div>

      </div>

    </aside>
  );
}


/* =========================================================
   QUEUE STAT
========================================================= */

function QueueStat({
  label,
  value,
  dot,
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between last:mb-0">

      <span className="flex items-center gap-2 text-[10px] text-white/65">

        <span
          className={`h-1.5 w-1.5 rounded-full ${dot}`}
        />

        {label}

      </span>

      <span className="text-[10px] font-semibold text-white">
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-[#DCCFC0] bg-white px-6 py-14 text-center">

      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F5E8D4] text-[#C77C1F]">

        <CheckCircle2 size={19} />

      </div>

      <h3 className="text-sm font-semibold text-[#302A24]">
        Queue is clear
      </h3>

      <p className="mt-1 text-[11px] text-[#958879]">
        No orders match your current filters.
      </p>

    </div>
  );
}


/* =========================================================
   ORDER DETAILS MODAL
========================================================= */

function OrderDetailsModal({
  order,
  actionConfig,
  onClose,
  onAdvance,
  onPrintReceipt,
}) {
  const ActionIcon =
    actionConfig.icon;

  const statusColor =
    order.status === "PREPARING"
      ? "text-[#B36A0C]"
      : "text-[#21806A]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#181512]/55 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-[#E2D6C7] bg-[#FBF9F5] shadow-2xl">

        {/* =================================================
            MODAL HEADER
        ================================================= */}

        <div className="flex items-start justify-between border-b border-[#E8DED3] px-5 py-4">

          <div>

            <div className="flex items-center gap-2">

              <h2 className="font-mono text-[18px] font-bold text-[#27221D]">
                Token #{order.token}
              </h2>

              <span className="rounded-full bg-[#F3E4CF] px-2 py-0.5 text-[9px] font-semibold text-[#A3630D]">
                {order.status}
              </span>

            </div>

            <p className="mt-1 text-[11px] text-[#8D8174]">
              {order.orderType} · Placed{" "}
              {order.time}
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E1D5C6] bg-white text-[#756A5E] transition hover:bg-[#F5EEE6]"
          >

            <X size={16} />

          </button>

        </div>


        {/* =================================================
            CUSTOMER
        ================================================= */}

        <div className="px-5 pt-4">

          <div className="flex items-center justify-between rounded-xl border border-[#E4B46B] bg-[#FFF8EC] px-3.5 py-3">

            <div className="flex items-center gap-2.5">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0DFC2] text-[#9D6213]">
                <UserRound size={15} />
              </div>

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#998B7A]">
                  Customer
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[#302A24]">
                  {order.customer}
                </p>


                {order.phoneNumber ? (

                  <a
                    href={`tel:${order.phoneNumber}`}
                    className="mt-0.5 flex w-fit items-center gap-1 text-[10px] text-[#A09588] transition-colors hover:text-[#C47B1C]"
                  >

                    <Phone
                      size={9}
                      strokeWidth={2}
                      className="shrink-0"
                    />

                    <span>
                      {order.phoneNumber}
                    </span>

                  </a>

                ) : (

                  <p className="mt-0.5 text-[10px] text-[#A09588]">
                    N/A
                  </p>

                )}

              </div>

            </div>


            <div className="text-right">

              <p className="text-[9px] uppercase tracking-wide text-[#998B7A]">
                Order time
              </p>

              <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-[#5E554C]">

                <Clock3 size={11} />

                {order.time}

              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="px-5 pt-3">

          <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-[#E3D8CA] bg-[#F1EBE2]">

            <SummaryCell
              icon={ChefHat}
              label="Status"
              value={order.status}
              valueClass={statusColor}
            />

            <SummaryCell
              icon={
                order.paymentType ===
                "cash"
                  ? Banknote
                  : CreditCard
              }
              label="Payment"
              value={order.payment}
              valueClass={
                order.paymentType ===
                "cash"
                  ? "text-[#A3630D]"
                  : "text-[#21806A]"
              }
            />

            <SummaryCell
              icon={ReceiptText}
              label="Total"
              value={`₹${order.amount}`}
              valueClass="text-[#302A24]"
            />

          </div>

        </div>


        {/* =================================================
            ITEMS
        ================================================= */}

        <div className="px-5 pt-4">

          <div className="mb-2 flex items-center justify-between">

            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#766A5E]">
              Itemized order
            </p>

            <span className="text-[10px] text-[#A19588]">

              {order.items.length} line
              {order.items.length !== 1
                ? "s"
                : ""}

            </span>

          </div>


          <div className="overflow-hidden rounded-xl border border-[#E3D8CA] bg-white">

            <div className="grid grid-cols-[1fr_55px_75px_75px] border-b border-[#ECE3D8] bg-[#FBF8F3] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#948779]">

              <span>Item</span>

              <span>Qty</span>

              <span>Unit</span>

              <span className="text-right">
                Total
              </span>

            </div>


            {order.items.map(
              (item, index) => (

                <div
                  key={`${item.name}-${index}`}
                  className="grid grid-cols-[1fr_55px_75px_75px] items-center border-b border-[#F0E8DE] px-3 py-2.5 last:border-0"
                >

                  <span className="text-[11px] font-semibold text-[#342E28]">
                    {item.name}
                  </span>

                  <span className="text-[10px] text-[#62584E]">
                    ×{item.qty}
                  </span>

                  <span className="text-[10px] text-[#62584E]">
                    ₹{item.price}
                  </span>

                  <span className="text-right text-[10px] font-semibold text-[#342E28]">
                    ₹{item.qty * item.price}
                  </span>

                </div>

              )
            )}


            <div className="flex items-center justify-between border-t border-[#E5DACE] bg-[#FBF8F3] px-3 py-3">

              <span className="text-[10px] font-semibold text-[#6F6458]">
                Order total
              </span>

              <span className="text-[15px] font-bold text-[#27221D]">
                ₹{order.amount}
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            FOOTER ACTIONS
        ================================================= */}

        <div className="flex gap-2.5 px-5 py-4">

          {/* PRINT RECEIPT */}

          <button
            type="button"
            onClick={onPrintReceipt}
            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#DED2C4] bg-white text-[11px] font-semibold text-[#40382F] transition hover:bg-[#F7F1E9]"
          >

            <Printer size={14} />

            Print receipt

          </button>


          {/* ORDER ACTION */}

          <button
            type="button"
            onClick={onAdvance}
            className={`flex h-9 flex-[1.3] items-center justify-center gap-2 rounded-lg px-4 text-[11px] font-semibold transition ${
              actionConfig.type ===
              "ready"
                ? "bg-[#C77C1F] text-white hover:bg-[#AD6917]"
                : actionConfig.type ===
                  "collect"
                ? "bg-[#282521] text-white hover:bg-[#171512]"
                : "bg-[#217B65] text-white hover:bg-[#196451]"
            }`}
          >

            <ActionIcon size={14} />

            {actionConfig.type ===
            "preparing"
              ? "Start Preparing"
              : actionConfig.type ===
                "ready"
              ? "Advance to Ready"
              : actionConfig.type ===
                "collect"
              ? "Collect Payment"
              : "Complete Order"}

            <ArrowRight size={13} />

          </button>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SUMMARY CELL
========================================================= */

function SummaryCell({
  icon: Icon,
  label,
  value,
  valueClass,
}) {
  return (
    <div className="border-r border-[#E1D6C8] px-3 py-2.5 last:border-0">

      <div className="mb-1 flex items-center gap-1.5">

        <Icon
          size={11}
          className="text-[#8F8172]"
        />

        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8F8172]">
          {label}
        </span>

      </div>

      <p
        className={`truncate text-[10px] font-bold ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}


export default LiveOrdersPage;