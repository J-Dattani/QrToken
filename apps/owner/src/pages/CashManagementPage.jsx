import { useMemo, useState } from "react";

import {
  Search,
  Clock3,
  ReceiptText,
  CheckCircle2,
  Banknote,
  WalletCards,
  CircleDollarSign,
  ShoppingBag,
  X,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  MoreHorizontal,
  ScanLine,
  Wallet,
} from "lucide-react";

import {
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";


/* ============================================================
   DEMO CASH ORDERS
============================================================ */

const initialCashOrders = [
  {
    id: 1,
    token: "#A-001",
    type: "Counter Takeaway",
    items:
      "Samosa ×1, Masala Tea ×1, Bun Maska ×1",
    amount: 33,
    status: "Pending",
  },

  {
    id: 2,
    token: "#A-002",
    type: "Table Session",
    items:
      "Vada Pav ×2, Filter Coffee ×1",
    amount: 55,
    status: "Collected",
  },

  {
    id: 3,
    token: "#A-003",
    type: "Counter Takeaway",
    items:
      "Cutting Chai ×2, Samosa ×1",
    amount: 35,
    status: "Pending",
  },
];


/* ============================================================
   MAIN PAGE
============================================================ */

function CashManagementPage() {
  const [orders, setOrders] =
    useState(initialCashOrders);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All Cash Orders");

  const [selectedReceipt, setSelectedReceipt] =
    useState(null);

  const [copiedToken, setCopiedToken] =
    useState(null);


  /* ==========================================================
     CALCULATIONS
  ========================================================== */

  const totalPlaced = orders.reduce(
    (sum, order) =>
      sum + order.amount,
    0
  );

  const collected = orders
    .filter(
      (order) =>
        order.status === "Collected"
    )
    .reduce(
      (sum, order) =>
        sum + order.amount,
      0
    );

  const pending = orders
    .filter(
      (order) =>
        order.status === "Pending"
    )
    .reduce(
      (sum, order) =>
        sum + order.amount,
      0
    );

  const pendingCount = orders.filter(
    (order) =>
      order.status === "Pending"
  ).length;

  const collectedCount = orders.filter(
    (order) =>
      order.status === "Collected"
  ).length;

  const collectionRate =
    totalPlaced > 0
      ? Math.round(
          (collected /
            totalPlaced) *
            100
        )
      : 0;


  /* ==========================================================
     SEARCH + FILTER
  ========================================================== */

  const visibleOrders = useMemo(() => {

    const query =
      search
        .trim()
        .toLowerCase();

    return orders.filter(
      (order) => {

        const matchesSearch =
          !query ||
          order.token
            .toLowerCase()
            .includes(query) ||
          order.items
            .toLowerCase()
            .includes(query) ||
          order.type
            .toLowerCase()
            .includes(query);

        const matchesFilter =
          filter ===
            "All Cash Orders" ||
          (
            filter ===
              "Pending Collection" &&
            order.status ===
              "Pending"
          ) ||
          (
            filter ===
              "Cleared & Collected" &&
            order.status ===
              "Collected"
          );

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  }, [
    orders,
    search,
    filter,
  ]);


  const pendingOrders =
    visibleOrders.filter(
      (order) =>
        order.status === "Pending"
    );

  const collectedOrders =
    visibleOrders.filter(
      (order) =>
        order.status === "Collected"
    );


  /* ==========================================================
     ACTIONS
  ========================================================== */

  const collectOrder = (
    orderId
  ) => {

    setOrders((current) =>
      current.map(
        (order) =>
          order.id === orderId
            ? {
                ...order,
                status:
                  "Collected",
              }
            : order
      )
    );

  };


  const copyToken = async (
    token
  ) => {

    try {

      await navigator.clipboard.writeText(
        token
      );

      setCopiedToken(token);

      setTimeout(() => {
        setCopiedToken(null);
      }, 1200);

    } catch {
      // Clipboard unavailable.
    }

  };


  return (

    <section className="min-h-full bg-[#F7F3ED] px-5 py-5 lg:px-7">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-5 flex items-center justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#282521] text-[#E6A23C] shadow-sm">

            <WalletCards
              size={18}
              strokeWidth={2}
            />

          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-[20px] font-semibold tracking-[-0.03em] text-[#241F1A]">
                Cash Desk
              </h1>

              <span className="hidden items-center gap-1.5 rounded-full bg-[#EAF5F1] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#237760] sm:flex">

                <span className="h-1.5 w-1.5 rounded-full bg-[#32A985]" />

                Register

              </span>

            </div>

            <p className="mt-0.5 text-[11px] text-[#8A7E71]">
              Collect cash payments and keep the register clear.
            </p>

          </div>

        </div>


        <div className="hidden items-center gap-2 rounded-lg border border-[#E5D8C8] bg-white px-3 py-2 sm:flex">

          <Wallet
            size={13}
            className="text-[#C77C1F]"
          />

          <span className="text-[11px] font-semibold text-[#4B433B]">
            ₹{pending} pending
          </span>

        </div>

      </div>


      {/* ======================================================
          OPERATIONAL STRIP
      ====================================================== */}

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

        <CashStat
          icon={CircleDollarSign}
          label="Cash placed"
          value={`₹${totalPlaced}`}
          sub={`${orders.length} orders`}
        />

        <CashStat
          icon={CheckCircle2}
          label="Collected"
          value={`₹${collected}`}
          sub={`${collectionRate}% cleared`}
          tone="green"
        />

        <CashStat
          icon={Clock3}
          label="Needs collection"
          value={`₹${pending}`}
          sub={`${pendingCount} pending`}
          tone="amber"
          active={pendingCount > 0}
        />

        <CashStat
          icon={Banknote}
          label="Cleared orders"
          value={collectedCount}
          sub="Register entries"
        />

      </div>


      {/* ======================================================
          WORKSPACE
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_245px]">


        {/* ====================================================
            COLLECTION DESK
        ==================================================== */}

        <main className="min-w-0 overflow-hidden rounded-xl border border-[#DED3C5] bg-white shadow-sm">


          {/* Desk heading */}

          <div className="border-b border-[#E9E0D5] px-4 py-3.5">

            <div className="flex items-center justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <h2 className="text-[13px] font-bold text-[#302A24]">
                    Collection desk
                  </h2>

                  {pendingCount > 0 && (

                    <span className="rounded-full bg-[#FFF0D2] px-2 py-0.5 text-[9px] font-bold text-[#B9700D]">
                      {pendingCount} pending
                    </span>

                  )}

                </div>

                <p className="mt-0.5 text-[10px] text-[#94887B]">
                  Pending cash stays visible until collected.
                </p>

              </div>


              <div className="hidden items-center gap-1.5 sm:flex">

                <span className="h-1.5 w-1.5 rounded-full bg-[#E4A12E]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.11em] text-[#95897C]">
                  Cash
                </span>

              </div>

            </div>

          </div>


          {/* ==================================================
              SEARCH + FILTERS
          ================================================== */}

          <div className="border-b border-[#E9E0D5] bg-[#FBF9F5] px-4 py-2.5">

            <div className="flex flex-col gap-2.5 md:flex-row">

              <div className="relative min-w-0 flex-1">

                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9083]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search token, item or order type..."
                  className="
                    h-9
                    w-full
                    rounded-lg
                    border
                    border-[#DED3C5]
                    bg-white
                    pl-9
                    pr-3
                    text-[11px]
                    font-medium
                    text-[#302A24]
                    outline-none
                    transition
                    placeholder:text-[#AAA095]
                    hover:border-[#CFC2B4]
                    focus:border-[#D49A48]
                    focus:ring-2
                    focus:ring-[#D49A48]/10
                  "
                />

              </div>


              <div className="flex shrink-0 rounded-lg border border-[#DED3C5] bg-white p-0.5">

                {[
                  {
                    label: "All",
                    value:
                      "All Cash Orders",
                  },
                  {
                    label: "Pending",
                    value:
                      "Pending Collection",
                  },
                  {
                    label: "Cleared",
                    value:
                      "Cleared & Collected",
                  },
                ].map((item) => (

                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setFilter(
                        item.value
                      )
                    }
                    className={`rounded-md px-3 py-1.5 text-[10px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20 ${
                      filter ===
                      item.value
                        ? "bg-[#282521] text-white shadow-sm"
                        : "text-[#766A5D] hover:bg-[#F7F3ED]"
                    }`}
                  >
                    {item.label}
                  </button>

                ))}

              </div>

            </div>

          </div>


          {/* ==================================================
              PENDING SECTION
          ================================================== */}

          {pendingOrders.length > 0 && (

            <section>

              <div className="flex items-center border-b border-[#F0E5D5] bg-[#FFF9EF] px-4 py-2.5">

                <div className="flex items-center gap-2">

                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#F9E5C6] text-[#C47A18]">

                    <Clock3 size={12} />

                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#A16D30]">
                    Awaiting collection
                  </p>

                </div>

                <span className="ml-auto font-mono text-[11px] font-bold text-[#C2760C]">
                  ₹{pending}
                </span>

              </div>


              {pendingOrders.map(
                (order) => (

                  <CashOrderRow
                    key={order.id}
                    order={order}
                    pending
                    onCollect={() =>
                      collectOrder(
                        order.id
                      )
                    }
                    onReceipt={() =>
                      setSelectedReceipt(
                        order
                      )
                    }
                    onCopy={() =>
                      copyToken(
                        order.token
                      )
                    }
                    copied={
                      copiedToken ===
                      order.token
                    }
                  />

                )
              )}

            </section>

          )}


          {/* ==================================================
              COLLECTED SECTION
          ================================================== */}

          {collectedOrders.length > 0 && (

            <section>

              <div className="flex items-center border-y border-[#E9E0D5] bg-[#F8FAF8] px-4 py-2.5">

                <div className="flex items-center gap-2">

                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#E5F3EE] text-[#27836D]">

                    <CheckCircle2 size={12} />

                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#547B6E]">
                    Cleared
                  </p>

                </div>

                <span className="ml-auto text-[10px] font-semibold text-[#78948A]">
                  {collectedCount} entries
                </span>

              </div>


              {collectedOrders.map(
                (order) => (

                  <CashOrderRow
                    key={order.id}
                    order={order}
                    onReceipt={() =>
                      setSelectedReceipt(
                        order
                      )
                    }
                    onCopy={() =>
                      copyToken(
                        order.token
                      )
                    }
                    copied={
                      copiedToken ===
                      order.token
                    }
                  />

                )
              )}

            </section>

          )}


          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          {visibleOrders.length === 0 && (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="max-w-xs text-center">

                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EBE3] text-[#8F8375]">

                  <ReceiptText
                    size={20}
                  />

                </div>

                <h3 className="text-[13px] font-semibold text-[#40382F]">
                  No cash orders here
                </h3>

                <p className="mt-1 text-[10px] leading-5 text-[#968A7D]">
                  Try another filter or search term.
                </p>

              </div>

            </div>

          )}

        </main>


        {/* ====================================================
            REGISTER PULSE
        ==================================================== */}

        <aside className="h-fit overflow-hidden rounded-xl bg-[#292621] text-white shadow-[0_8px_25px_rgba(35,30,23,0.14)]">


          {/* Panel header */}

          <div className="border-b border-white/[0.08] px-4 py-3.5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6A23C] text-[#282016]">

                  <ScanLine size={14} />

                </div>

                <div>

                  <h2 className="text-[13px] font-bold">
                    Register pulse
                  </h2>

                  <p className="mt-0.5 text-[10px] text-[#958D84]">
                    Current cash position
                  </p>

                </div>

              </div>


              <Tooltip title="Register activity">

                <IconButton
                  size="small"
                  sx={{
                    width: 27,
                    height: 27,
                    color: "#AAA39B",
                  }}
                >
                  <MoreHorizontal
                    size={15}
                  />
                </IconButton>

              </Tooltip>

            </div>

          </div>


          {/* Main outstanding amount */}

          <div className="px-4 pt-4">

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#91887F]">
                    Still to collect
                  </p>

                  <p className="mt-1 text-[30px] font-bold tracking-[-0.05em] text-[#F0B34D]">
                    ₹{pending}
                  </p>

                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6A23C]/10 text-[#E6A23C]">

                  <ArrowDownRight
                    size={15}
                  />

                </div>

              </div>

              <div className="mt-3 flex items-center justify-between">

                <span className="text-[9px] text-[#827A72]">
                  Outstanding cash
                </span>

                <span className="rounded-full bg-[#E6A23C]/10 px-2 py-1 text-[9px] font-bold text-[#E6A23C]">
                  {pendingCount} pending
                </span>

              </div>

            </div>

          </div>


          {/* Register metrics */}

          <div className="px-4 py-3">

            <RegisterMetric
              icon={ShoppingBag}
              label="Cash orders"
              value={orders.length}
            />

            <RegisterMetric
              icon={ArrowUpRight}
              label="Collected"
              value={`₹${collected}`}
              green
            />

            <RegisterMetric
              icon={Clock3}
              label="Outstanding"
              value={`₹${pending}`}
              amber
            />

          </div>


          {/* Collection rate */}

          <div className="border-t border-white/[0.08] px-4 py-4">

            <div className="mb-2 flex items-center justify-between">

              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8F877E]">
                Collection rate
              </p>

              <p className="font-mono text-[10px] font-bold text-[#E4A546]">
                {collectionRate}%
              </p>

            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.09]">

              <div
                className="h-full rounded-full bg-[#E0A13C] transition-all duration-500"
                style={{
                  width: `${collectionRate}%`,
                }}
              />

            </div>

            <div className="mt-2 flex justify-between">

              <span className="text-[9px] text-[#777068]">
                ₹{collected} collected
              </span>

              <span className="text-[9px] text-[#777068]">
                ₹{totalPlaced} placed
              </span>

            </div>

          </div>


          {/* Insight */}

          <div className="border-t border-white/[0.08] px-4 py-3">

            <div className="flex gap-2">

              <Sparkles
                size={12}
                className="mt-0.5 shrink-0 text-[#E6A23C]"
              />

              <p className="text-[9px] leading-4 text-[#817A72]">
                Pending cash remains visible
                until it is explicitly collected.
              </p>

            </div>

          </div>

        </aside>

      </div>


      {/* ======================================================
          RECEIPT MODAL
      ====================================================== */}

      {selectedReceipt && (

        <ReceiptModal
          order={selectedReceipt}
          onClose={() =>
            setSelectedReceipt(null)
          }
        />

      )}

    </section>
  );
}


/* ============================================================
   CASH STAT
============================================================ */

function CashStat({
  icon: Icon,
  label,
  value,
  sub,
  tone,
  active,
}) {

  const styles = {

    green: {
      icon:
        "bg-[#E5F3EE] text-[#27836D]",
      value:
        "text-[#27836D]",
    },

    amber: {
      icon:
        "bg-[#FFF0D2] text-[#C1760D]",
      value:
        "text-[#C1760D]",
    },

    default: {
      icon:
        "bg-[#EEE9E1] text-[#786D61]",
      value:
        "text-[#302A24]",
    },

  };

  const current =
    styles[tone] ||
    styles.default;


  return (

    <div
      className={`relative flex items-center gap-3 rounded-xl border bg-white px-3.5 py-3 shadow-sm ${
        active
          ? "border-[#E2C999]"
          : "border-[#DED3C5]"
      }`}
    >

      {active && (
        <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#E0A13C]" />
      )}

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${current.icon}`}
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#8D8175]">
          {label}
        </p>

        <div className="mt-0.5 flex items-baseline gap-1.5">

          <p
            className={`text-[18px] font-bold tracking-[-0.025em] ${current.value}`}
          >
            {value}
          </p>

          <span className="truncate text-[10px] font-medium text-[#9B9084]">
            {sub}
          </span>

        </div>

      </div>

    </div>

  );
}


/* ============================================================
   CASH ORDER ROW
============================================================ */

function CashOrderRow({
  order,
  pending = false,
  onCollect,
  onReceipt,
  onCopy,
  copied,
}) {

  return (

    <div
      className={`relative border-b border-[#EAE2D8] px-4 py-3.5 transition last:border-b-0 ${
        pending
          ? "bg-[#FFFDF9] hover:bg-[#FFF9EF]"
          : "bg-white hover:bg-[#FCFAF7]"
      }`}
    >

      <span
        className={`absolute bottom-0 left-0 top-0 w-[3px] ${
          pending
            ? "bg-[#E0A13C]"
            : "bg-[#35A987]"
        }`}
      />


      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">


        {/* Token */}

        <div className="flex min-w-[150px] items-center gap-2.5">

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              pending
                ? "bg-[#FFF0D2] text-[#C1760D]"
                : "bg-[#E5F3EE] text-[#27836D]"
            }`}
          >

            {pending ? (
              <Clock3 size={15} />
            ) : (
              <CheckCircle2
                size={15}
              />
            )}

          </div>


          <div className="min-w-0">

            <div className="flex items-center gap-1">

              <p className="font-mono text-[14px] font-bold tracking-[-0.02em] text-[#302A24]">
                {order.token}
              </p>

              <Tooltip
                title={
                  copied
                    ? "Copied"
                    : "Copy token"
                }
              >

                <IconButton
                  size="small"
                  onClick={onCopy}
                  sx={{
                    width: 22,
                    height: 22,
                    color: copied
                      ? "#27836D"
                      : "#A0978C",
                  }}
                >

                  {copied ? (
                    <Check size={10} />
                  ) : (
                    <Copy size={10} />
                  )}

                </IconButton>

              </Tooltip>

            </div>

            <p className="truncate text-[10px] text-[#8F8376]">
              {order.type}
            </p>

          </div>

        </div>


        {/* Items */}

        <div className="min-w-0 flex-1">

          <p className="truncate text-[11px] font-semibold text-[#403931]">
            {order.items}
          </p>

        </div>


        {/* Amount */}

        <div className="flex items-center justify-between gap-3 xl:w-[80px] xl:justify-end">

          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#A09588] xl:hidden">
            Total
          </span>

          <p className="text-[15px] font-bold text-[#302A24]">
            ₹{order.amount}
          </p>

        </div>


        {/* Status */}

        <div className="xl:w-[90px]">

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9px] font-bold ${
              pending
                ? "bg-[#FFF0D2] text-[#B9700D]"
                : "bg-[#E5F3EE] text-[#27836D]"
            }`}
          >

            <span
              className={`h-1.5 w-1.5 rounded-full ${
                pending
                  ? "bg-[#D99B31]"
                  : "bg-[#35A987]"
              }`}
            />

            {pending
              ? "Pending"
              : "Collected"}

          </span>

        </div>


        {/* Actions */}

        <div className="flex items-center gap-1.5 xl:w-[190px] xl:justify-end">

          {pending && (

            <Button
              variant="contained"
              size="small"
              startIcon={
                <Banknote size={13} />
              }
              onClick={onCollect}
              sx={{
                height: 34,
                minWidth: 0,
                px: 1.5,
                borderRadius:
                  "9px",
                textTransform:
                  "none",
                fontSize: "10px",
                fontWeight: 800,
                background:
                  "#282521",
                boxShadow:
                  "none",
                "&:hover": {
                  background:
                    "#1D1B18",
                  boxShadow:
                    "none",
                },
              }}
            >
              Collect ₹{order.amount}
            </Button>

          )}


          <Button
            variant="outlined"
            size="small"
            startIcon={
              <ReceiptText
                size={12}
              />
            }
            onClick={onReceipt}
            sx={{
              height: 34,
              minWidth: 0,
              px: 1.25,
              borderRadius:
                "9px",
              textTransform:
                "none",
              fontSize: "10px",
              fontWeight: 700,
              color:
                "#665C51",
              borderColor:
                "#DED3C5",
              "&:hover": {
                borderColor:
                  "#CFC2B4",
                background:
                  "#FFF8EE",
              },
            }}
          >
            Receipt
          </Button>

        </div>

      </div>

    </div>

  );
}


/* ============================================================
   REGISTER METRIC
============================================================ */

function RegisterMetric({
  icon: Icon,
  label,
  value,
  green,
  amber,
}) {

  return (

    <div className="flex items-center gap-2.5 border-b border-white/[0.07] py-2.5 last:border-0">

      <Icon
        size={13}
        className={
          amber
            ? "text-[#DDA248]"
            : green
            ? "text-[#51B596]"
            : "text-[#8E867E]"
        }
      />

      <span className="text-[10px] text-[#A39A91]">
        {label}
      </span>

      <span
        className={`ml-auto text-[10px] font-bold ${
          amber
            ? "text-[#DFA44B]"
            : green
            ? "text-[#59B99D]"
            : "text-[#E7E0D7]"
        }`}
      >
        {value}
      </span>

    </div>

  );
}


/* ============================================================
   RECEIPT MODAL
============================================================ */

function ReceiptModal({
  order,
  onClose,
}) {

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#211D18]/55 p-4 backdrop-blur-[3px]"
      onClick={onClose}
    >

      <div
        className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#DED3C5] bg-[#FFFDF9] shadow-[0_25px_70px_rgba(30,24,17,0.24)]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >


        {/* Header */}

        <div className="flex items-start justify-between border-b border-dashed border-[#DCD0C1] px-5 py-4">

          <div className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#282521] text-[#E6A23C]">

              <ReceiptText
                size={15}
              />

            </div>

            <div>

              <p className="text-[13px] font-bold text-[#302A24]">
                Cash receipt
              </p>

              <p className="mt-0.5 font-mono text-[10px] text-[#95897C]">
                {order.token}
              </p>

            </div>

          </div>


          <Tooltip title="Close">

            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color:
                  "#8D8275",
              }}
            >
              <X size={15} />
            </IconButton>

          </Tooltip>

        </div>


        {/* Receipt body */}

        <div className="px-5 py-4">

          <div className="mb-4 rounded-xl border border-[#E1D7C9] bg-[#F5F0E8] p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9B8E80]">
                  Total amount
                </p>

                <p className="mt-1 text-[28px] font-bold tracking-[-0.05em] text-[#2E2923]">
                  ₹{order.amount}
                </p>

              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                  order.status ===
                  "Collected"
                    ? "bg-[#E5F3EE] text-[#27836D]"
                    : "bg-[#FFF0D2] text-[#B9700D]"
                }`}
              >
                {order.status}
              </span>

            </div>

          </div>


          <ReceiptLine
            label="Order type"
            value={order.type}
          />

          <ReceiptLine
            label="Items"
            value={order.items}
          />


          <div className="my-3 border-t border-dashed border-[#DDD1C2]" />


          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold text-[#766B60]">
              Cash total
            </span>

            <span className="text-[17px] font-bold text-[#C2740D]">
              ₹{order.amount}
            </span>

          </div>

        </div>


        {/* Footer */}

        <div className="border-t border-[#E9E0D6] bg-[#FAF7F2] p-4">

          <Button
            fullWidth
            variant="contained"
            onClick={onClose}
            sx={{
              height: 36,
              borderRadius:
                "9px",
              textTransform:
                "none",
              fontSize: "10px",
              fontWeight: 800,
              background:
                "#282521",
              boxShadow:
                "none",
              "&:hover": {
                background:
                  "#1D1B18",
                boxShadow:
                  "none",
              },
            }}
          >
            Done
          </Button>

        </div>

      </div>

    </div>

  );
}


/* ============================================================
   RECEIPT LINE
============================================================ */

function ReceiptLine({
  label,
  value,
}) {

  return (

    <div className="flex items-start justify-between gap-5 py-1.5">

      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A8E80]">
        {label}
      </span>

      <span className="max-w-[260px] text-right text-[10px] font-medium leading-5 text-[#4E463D]">
        {value}
      </span>

    </div>

  );
}


export default CashManagementPage;