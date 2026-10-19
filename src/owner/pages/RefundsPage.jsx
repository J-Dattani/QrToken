import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Hash,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { apiRequest } from "../api/client";

const refundReasons = [
  "Customer cancellation",
  "Item unavailable / sold out",
  "Duplicate payment",
  "Incorrect order",
  "Other",
];

function RefundsPage() {
  const merchant = useSelector((state) => state.merchant?.merchant);

  const merchantId =
    merchant?._id ||
    merchant?.id ||
    merchant?.merchantId ||
    "";

  const [refunds, setRefunds] = useState([]);
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [tokenOrOrderId, setTokenOrOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState(refundReasons[0]);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  /*
   * ==========================================================
   * LOAD ORDERS / REFUND ACTIVITY
   * ==========================================================
   *
   * Confirmed API:
   *
   * GET /orders/merchant/:merchantId
   *
   * There is no separate confirmed refund-list endpoint.
   * Refund activity is therefore derived from merchant orders
   * after the backend marks an order as refunded.
   */
  const loadRefundData = useCallback(
    async (showRefresh = false) => {
      if (!merchantId) {
        setOrders([]);
        setRefunds([]);
        setLoading(false);
        return;
      }

      try {
        setError("");

        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await apiRequest(
          `/orders/merchant/${merchantId}`
        );

        const data = Array.isArray(response)
          ? response
          : response?.orders ||
            response?.data ||
            [];

        setOrders(data);

        /*
         * A refunded order can be identified from the backend
         * using the persisted refund/payment fields.
         */
        const refundedOrders = data.filter((order) => {
          const paymentStatus = String(
            order?.paymentStatus || ""
          ).toLowerCase();

          const refundStatus = String(
            order?.refundStatus || ""
          ).toLowerCase();

          return (
            paymentStatus === "refunded" ||
            refundStatus === "refunded" ||
            order?.refunded === true
          );
        });

        const mappedRefunds = refundedOrders.map((order) => {
          const orderId =
            order?._id ||
            order?.id ||
            "—";

          const token = order?.tokenNumber
            ? `#${String(order.tokenNumber).replace(/^#/, "")}`
            : "#—";

          const refundAmount = Number(
            order?.refundAmount ??
              order?.refundedAmount ??
              order?.total ??
              0
          );

          const refundReason =
            order?.refundReason ||
            order?.refund?.reason ||
            "Payment refund";

          return {
            id: orderId,
            token,
            status: "Refunded",
            orderId,
            amount: refundAmount,
            reason: refundReason,
            createdAt:
              order?.updatedAt ||
              order?.createdAt ||
              null,
            originalOrder: order,
          };
        });

        setRefunds(mappedRefunds);
      } catch (requestError) {
        setError(
          requestError?.message ||
            "Unable to load refund activity."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [merchantId]
  );

  useEffect(() => {
    loadRefundData();
  }, [loadRefundData]);

  /*
   * ==========================================================
   * TOTAL REFUNDED
   * ==========================================================
   */
  const totalRefunded = useMemo(() => {
    return refunds.reduce(
      (total, refund) =>
        total + Number(refund.amount || 0),
      0
    );
  }, [refunds]);

  /*
   * ==========================================================
   * SEARCH
   * ==========================================================
   */
  const filteredRefunds = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return refunds;
    }

    return refunds.filter((refund) => {
      return (
        String(refund.token || "")
          .toLowerCase()
          .includes(value) ||
        String(refund.orderId || "")
          .toLowerCase()
          .includes(value) ||
        String(refund.reason || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [refunds, search]);

  /*
   * ==========================================================
   * REFUND SUCCESS RATE
   * ==========================================================
   */
  const refundSuccessRate = useMemo(() => {
    if (!refunds.length) {
      return "0%";
    }

    const successful = refunds.filter(
      (refund) =>
        String(refund.status).toLowerCase() ===
        "refunded"
    ).length;

    return `${Math.round(
      (successful / refunds.length) * 100
    )}%`;
  }, [refunds]);

  /*
   * ==========================================================
   * MODAL
   * ==========================================================
   */
  const openModal = () => {
    setError("");
    setTokenOrOrderId("");
    setAmount("");
    setReason(refundReasons[0]);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setError("");
  };

  /*
   * ==========================================================
   * FIND ORDER
   * ==========================================================
   */
  const findOrder = (value) => {
    const cleanValue = String(value || "")
      .trim()
      .replace(/^#/, "")
      .toLowerCase();

    if (!cleanValue) {
      return null;
    }

    return (
      orders.find((order) => {
        const orderId = String(
          order?._id ||
            order?.id ||
            ""
        ).toLowerCase();

        const token = String(
          order?.tokenNumber || ""
        )
          .replace(/^#/, "")
          .toLowerCase();

        return (
          orderId === cleanValue ||
          token === cleanValue
        );
      }) || null
    );
  };

  /*
   * ==========================================================
   * ISSUE REFUND
   * ==========================================================
   *
   * Confirmed API:
   *
   * POST /orders/:orderId/refund
   *
   * No request body.
   *
   * The backend performs a full-order refund.
   */
  const handleConfirmRefund = async () => {
    const value = tokenOrOrderId.trim();

    if (!value) {
      setError(
        "Enter a token number or order reference."
      );
      return;
    }

    const selectedOrder = findOrder(value);

    if (!selectedOrder) {
      setError(
        "Order not found. Enter a valid token number or order ID."
      );
      return;
    }

    const orderId =
      selectedOrder?._id ||
      selectedOrder?.id;

    if (!orderId) {
      setError(
        "This order does not have a valid order ID."
      );
      return;
    }

    const paymentStatus = String(
      selectedOrder?.paymentStatus || ""
    ).toLowerCase();

    /*
     * Backend requires a paid order for refund.
     */
    if (paymentStatus !== "paid") {
      setError(
        "Only paid orders can be refunded."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      /*
       * IMPORTANT:
       * Do not send amount or reason.
       *
       * Confirmed backend API accepts only the order ID
       * and performs the complete order refund.
       */
      const response = await apiRequest(
        `/orders/${orderId}/refund`,
        {
          method: "POST",
        }
      );

      if (response?.success === false) {
        throw new Error(
          response?.message ||
            "Refund could not be processed."
        );
      }

      /*
       * Reload from backend so the UI reflects the
       * actual persisted refund status.
       */
      await loadRefundData(true);

      setShowModal(false);
      setTokenOrOrderId("");
      setAmount("");
      setReason(refundReasons[0]);
      setError("");
    } catch (requestError) {
      setError(
        requestError?.message ||
          "Unable to process refund."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-full bg-[#F7F3ED] px-5 py-5 lg:px-7">
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#282521] text-[#E6A23C] shadow-sm">
            <RotateCcw
              size={17}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[20px] font-semibold tracking-[-0.03em] text-[#241F1A]">
                Refunds
              </h1>

              <span className="hidden items-center gap-1 rounded-full bg-[#E7F4EF] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#287A66] sm:inline-flex">
                <ShieldCheck size={10} />
                Payments
              </span>
            </div>

            <p className="mt-0.5 truncate text-[11px] text-[#8A7E71]">
              Manage digital payment reversals and cancellation requests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadRefundData(true)}
            disabled={refreshing}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DED3C5] bg-white px-3 text-[10px] font-bold text-[#554C44] shadow-sm transition hover:bg-[#FAF7F2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={13}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={openModal}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#282521] px-3.5 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-[#1D1B18] hover:shadow-md active:scale-[0.98]"
          >
            <RefreshCw size={13} />
            Issue refund
          </button>
        </div>
      </div>

      {/* ======================================================
          KPI STRIP
      ====================================================== */}

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <KpiCard
          icon={CircleDollarSign}
          iconClass="bg-[#FBE8E5] text-[#D9534F]"
          label="Total refunded"
          value={`₹${totalRefunded}`}
          meta={`${refunds.length} ${
            refunds.length === 1
              ? "order"
              : "orders"
          }`}
          dotClass="bg-[#D9534F]"
        />

        <KpiCard
          icon={CheckCircle2}
          iconClass="bg-[#E4F4EE] text-[#23866F]"
          label="Processed"
          value={refunds.length}
          meta="Backend-confirmed refunds"
          dotClass="bg-[#23866F]"
        />

        <KpiCard
          icon={Clock3}
          iconClass="bg-[#FFF0D5] text-[#D58A13]"
          label="Refund success"
          value={refundSuccessRate}
          meta="Based on loaded refund records"
          dotClass="bg-[#D58A13]"
          valueClass="text-[#C87909]"
        />
      </div>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_285px]">
        {/* ====================================================
            REFUND ACTIVITY
        ==================================================== */}

        <div className="min-w-0 overflow-hidden rounded-xl border border-[#DED3C5] bg-white shadow-sm">
          <div className="border-b border-[#E9E0D5] px-4 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[13px] font-bold text-[#302A24]">
                    Refund activity
                  </h2>

                  <span className="rounded-full bg-[#F0EBE3] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[#817568]">
                    {refunds.length}{" "}
                    {refunds.length === 1
                      ? "record"
                      : "records"}
                  </span>
                </div>

                <p className="mt-0.5 text-[10px] text-[#978B7E]">
                  Search and review processed digital refunds.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] font-semibold text-[#5F746C]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-[#2CA982]/30" />
                  <span className="relative h-2 w-2 rounded-full bg-[#2CA982]" />
                </span>

                Payment system ready
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-3">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A99E92]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search token or order reference..."
                className="h-9 w-full rounded-lg border border-[#DCD1C5] bg-[#FCFAF7] pl-9 pr-3 text-[11px] font-medium text-[#29251F] outline-none placeholder:text-[#A79C91] transition hover:border-[#CEC0B1] focus:border-[#D49A42] focus:bg-white focus:ring-2 focus:ring-[#E6A23C]/10"
              />
            </div>
          </div>

          {/* Column headings */}
          <div className="hidden grid-cols-[125px_minmax(170px,1.2fr)_100px_minmax(160px,1.4fr)_100px] items-center gap-4 border-b border-[#EFE6DC] bg-[#FCFAF7] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#938578] md:grid">
            <span>Token</span>
            <span>Order reference</span>
            <span>Amount</span>
            <span>Reason</span>
            <span className="text-right">
              Status
            </span>
          </div>

          {/* Rows */}
          <div>
            {loading ? (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-[#887C70]">
                  <RefreshCw
                    size={14}
                    className="animate-spin"
                  />

                  Loading refund activity...
                </div>
              </div>
            ) : error && !showModal ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF2F1] text-[#C94D49]">
                  <AlertCircle size={19} />
                </div>

                <h3 className="mt-3 text-[13px] font-bold text-[#302B26]">
                  Unable to load refunds
                </h3>

                <p className="mt-1 max-w-sm text-[10px] leading-4 text-[#8B7F73]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    loadRefundData(true)
                  }
                  className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#282521] px-3 text-[9px] font-bold text-white"
                >
                  <RefreshCw size={12} />
                  Try again
                </button>
              </div>
            ) : filteredRefunds.length > 0 ? (
              filteredRefunds.map((refund) => (
                <RefundRow
                  key={refund.id}
                  refund={refund}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* ====================================================
            REFUND DESK
        ==================================================== */}

        <aside className="h-fit overflow-hidden rounded-xl bg-[#292622] text-white shadow-[0_10px_28px_rgba(37,31,24,0.15)]">
          <div className="border-b border-white/[0.08] px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6A23C] text-[#2B2115]">
                <CircleDollarSign size={15} />
              </div>

              <div>
                <h2 className="text-[12px] font-bold">
                  Refund desk
                </h2>

                <p className="mt-0.5 text-[9px] text-[#8E877F]">
                  Current payment position
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5">
            <div className="rounded-[14px] border border-white/[0.09] bg-white/[0.035] p-3.5">
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#948A80]">
                Total returned
              </p>

              <div className="mt-1.5 flex items-end justify-between">
                <p className="text-[26px] font-bold tracking-[-0.05em] text-[#F0B44F]">
                  ₹{totalRefunded}
                </p>

                <ArrowUpRight
                  size={15}
                  className="mb-1 text-[#E6A23C]"
                />
              </div>

              <p className="mt-0.5 text-[9px] text-[#81786F]">
                Money reversed to customers
              </p>
            </div>
          </div>

          <div className="border-t border-white/[0.08]">
            <DarkStatRow
              icon={RefreshCw}
              label="Refunds processed"
              value={refunds.length}
            />

            <DarkStatRow
              icon={CheckCircle2}
              label="Successful"
              value={refunds.length}
              valueClass="text-[#59B99D]"
            />

            <DarkStatRow
              icon={Clock3}
              label="Average SLA"
              value="Backend"
            />
          </div>

          <div className="border-t border-white/[0.08] p-3.5">
            <div className="rounded-[12px] border border-white/[0.08] bg-white/[0.025] p-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-[#59B99D]"
                />

                <div>
                  <p className="text-[10px] font-bold text-white">
                    Refunds are audited
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#8E867D]">
                    Every processed refund is recorded against its token and payment reference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.08] p-3.5">
            <button
              type="button"
              onClick={openModal}
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#E6A23C] px-3 text-[10px] font-bold text-[#292015] shadow-sm transition hover:bg-[#F0B447] hover:shadow-md active:scale-[0.99]"
            >
              <RefreshCw size={12} />
              Initiate refund
            </button>
          </div>
        </aside>
      </div>

      {/* ======================================================
          MODAL
      ====================================================== */}

      {showModal && (
        <RefundModal
          tokenOrOrderId={tokenOrOrderId}
          setTokenOrOrderId={setTokenOrOrderId}
          amount={amount}
          setAmount={setAmount}
          reason={reason}
          setReason={setReason}
          error={error}
          onClose={closeModal}
          onConfirm={handleConfirmRefund}
          saving={saving}
        />
      )}
    </section>
  );
}

/* ==============================================================
   KPI CARD
================================================================ */

function KpiCard({
  icon: Icon,
  iconClass,
  label,
  value,
  meta,
  dotClass,
  valueClass = "text-[#29251F]",
}) {
  return (
    <div className="rounded-xl border border-[#DED3C5] bg-white px-3.5 py-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon
            size={14}
            strokeWidth={2}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#95897B]">
              {label}
            </p>

            <span
              className={`h-1.5 w-1.5 rounded-full ${dotClass}`}
            />
          </div>

          <div className="mt-0.5 flex items-baseline gap-1.5">
            <p
              className={`text-[17px] font-bold tracking-[-0.03em] ${valueClass}`}
            >
              {value}
            </p>

            <span className="truncate text-[9px] text-[#A09689]">
              {meta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   REFUND ROW
================================================================ */

function RefundRow({ refund }) {
  return (
    <div className="group border-b border-[#EFE6DC] px-4 py-3.5 last:border-b-0 hover:bg-[#FFFCF8]">
      {/* Desktop */}
      <div className="hidden grid-cols-[125px_minmax(170px,1.2fr)_100px_minmax(160px,1.4fr)_100px] items-center gap-4 md:grid">
        {/* Token */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBE9E7] text-[#D6534F]">
            <Hash size={14} />
          </div>

          <div>
            <p className="text-[11px] font-bold text-[#302B26]">
              {refund.token}
            </p>

            <p className="mt-0.5 text-[8px] text-[#95897D]">
              {refund.status}
            </p>
          </div>
        </div>

        {/* Reference */}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-[#403932]">
            Order reference
          </p>

          <p
            title={refund.orderId}
            className="mt-0.5 truncate font-mono text-[9px] text-[#81766B]"
          >
            {refund.orderId}
          </p>
        </div>

        {/* Amount */}
        <div>
          <p className="text-[12px] font-bold text-[#C94D49]">
            -₹{refund.amount}
          </p>

          <p className="mt-0.5 text-[8px] text-[#9B9084]">
            refunded
          </p>
        </div>

        {/* Reason */}
        <div className="min-w-0">
          <p
            title={refund.reason}
            className="truncate text-[10px] font-medium text-[#675D53]"
          >
            {refund.reason}
          </p>
        </div>

        {/* Status */}
        <div className="flex justify-end">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F5EF] px-2 py-1 text-[8px] font-bold text-[#19745F]">
            <CheckCircle2 size={10} />
            Refunded
          </span>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBE9E7] text-[#D6534F]">
              <Hash size={14} />
            </div>

            <div>
              <p className="text-[12px] font-bold text-[#302B26]">
                {refund.token}
              </p>

              <p className="mt-0.5 text-[9px] text-[#95897D]">
                {refund.status}
              </p>
            </div>
          </div>

          <p className="text-[14px] font-bold text-[#C94D49]">
            -₹{refund.amount}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2.5">
          <InfoBlock
            label="Order reference"
            value={refund.orderId}
            mono
          />

          <InfoBlock
            label="Reason"
            value={refund.reason}
          />
        </div>

        <div className="mt-2.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F5EF] px-2 py-1 text-[8px] font-bold text-[#19745F]">
            <CheckCircle2 size={10} />
            Refunded
          </span>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   DARK STAT ROW
================================================================ */

function DarkStatRow({
  icon: Icon,
  label,
  value,
  valueClass = "text-white",
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5 last:border-b-0">
      <div className="flex items-center gap-2">
        <Icon
          size={12}
          className={
            valueClass.includes("59B99D")
              ? "text-[#59B99D]"
              : "text-[#777069]"
          }
        />

        <span className="text-[9px] text-[#A39B92]">
          {label}
        </span>
      </div>

      <span
        className={`text-[10px] font-bold ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ==============================================================
   INFO BLOCK
================================================================ */

function InfoBlock({
  label,
  value,
  mono = false,
}) {
  return (
    <div>
      <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#988C80]">
        {label}
      </p>

      <p
        className={`mt-0.5 text-[10px] font-medium text-[#4D453E] ${
          mono
            ? "break-all font-mono text-[9px]"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ==============================================================
   EMPTY STATE
================================================================ */

function EmptyState() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EBDD] text-[#C77C1F]">
        <ReceiptText size={19} />
      </div>

      <h3 className="mt-3 text-[13px] font-bold text-[#302B26]">
        No refunds found
      </h3>

      <p className="mt-1 max-w-sm text-[10px] leading-4 text-[#8B7F73]">
        Try another token or order reference, or initiate a new refund.
      </p>
    </div>
  );
}

/* ==============================================================
   REFUND MODAL
================================================================ */

function RefundModal({
  tokenOrOrderId,
  setTokenOrOrderId,
  amount,
  setAmount,
  reason,
  setReason,
  error,
  onClose,
  onConfirm,
  saving,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211D18]/55 p-4 backdrop-blur-[3px]">
      <div className="w-full max-w-[470px] overflow-hidden rounded-[18px] border border-[#DED3C5] bg-white shadow-[0_25px_80px_rgba(25,20,15,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E9E0D5] px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8E7C8] text-[#C77C1F]">
              <RefreshCw size={16} />
            </div>

            <div>
              <h2 className="text-[13px] font-bold text-[#29251F]">
                Initiate refund
              </h2>

              <p className="mt-0.5 text-[9px] text-[#8A7D70]">
                Reverse a digital payment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8D8175] transition hover:bg-[#F5EFE8] hover:text-[#29251F]"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3.5 p-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-[#F2C8C5] bg-[#FFF2F1] px-3 py-2.5 text-[10px] font-medium text-[#B74743]">
              <AlertCircle
                size={13}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          <Field label="Token / order reference">
            <input
              type="text"
              value={tokenOrOrderId}
              onChange={(event) =>
                setTokenOrOrderId(
                  event.target.value
                )
              }
              placeholder="e.g. A-009"
              className="form-input"
              autoFocus
            />
          </Field>

          <Field label="Refund amount">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#756A5F]">
                ₹
              </span>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                placeholder="0"
                className="form-input pl-8"
              />
            </div>
          </Field>

          <Field label="Refund reason">
            <select
              value={reason}
              onChange={(event) =>
                setReason(
                  event.target.value
                )
              }
              className="form-input appearance-none"
            >
              {refundReasons.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex items-start gap-2 rounded-lg bg-[#F8F4EE] px-3 py-2.5">
            <ShieldCheck
              size={14}
              className="mt-0.5 shrink-0 text-[#23866F]"
            />

            <p className="text-[9px] leading-4 text-[#766A5D]">
              The backend processes a full-order refund against the selected order. The amount and reason fields are shown for reference and are not sent to the refund API.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-[#E9E0D5] bg-[#FCFAF7] px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 flex-1 items-center justify-center rounded-lg border border-[#DED2C5] bg-white px-3 text-[10px] font-bold text-[#554C44] transition hover:bg-[#F7F2EC] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#282521] px-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#1F1D1A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={12}
              className={
                saving
                  ? "animate-spin"
                  : ""
              }
            />

            {saving
              ? "Processing..."
              : "Confirm refund"}

            {!saving && (
              <ChevronRight size={12} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   FORM FIELD
================================================================ */

function Field({
  label,
  children,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.09em] text-[#786C60]">
        {label}
      </span>

      {children}
    </label>
  );
}

export default RefundsPage;