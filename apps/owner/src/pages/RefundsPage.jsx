import { useMemo, useState } from "react";
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  Search,
  Hash,
  ArrowUpRight,
  RefreshCw,
  CircleDollarSign,
  X,
  ReceiptText,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

const initialRefunds = [
  {
    id: "refund-1",
    token: "#A-009",
    status: "Refunded",
    orderId: "6a843a989cc44a1b8dc7014e",
    amount: 136,
    reason: "Item unavailable / Customer cancellation",
  },
];

const refundReasons = [
  "Customer cancellation",
  "Item unavailable / sold out",
  "Duplicate payment",
  "Incorrect order",
  "Other",
];

function RefundsPage() {
  const [refunds, setRefunds] =
    useState(initialRefunds);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [tokenOrOrderId, setTokenOrOrderId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [reason, setReason] =
    useState(refundReasons[0]);

  const [error, setError] =
    useState("");


  /* ==========================================================
     TOTALS
  ========================================================== */

  const totalRefunded = useMemo(
    () =>
      refunds.reduce(
        (total, refund) =>
          total + refund.amount,
        0
      ),
    [refunds]
  );


  /* ==========================================================
     SEARCH
  ========================================================== */

  const filteredRefunds = useMemo(() => {

    const value =
      search.trim().toLowerCase();

    if (!value) {
      return refunds;
    }

    return refunds.filter(
      (refund) =>
        refund.token
          .toLowerCase()
          .includes(value) ||
        refund.orderId
          .toLowerCase()
          .includes(value) ||
        refund.reason
          .toLowerCase()
          .includes(value)
    );

  }, [refunds, search]);


  /* ==========================================================
     MODAL
  ========================================================== */

  const openModal = () => {

    setError("");
    setTokenOrOrderId("");
    setAmount("");
    setReason(refundReasons[0]);
    setShowModal(true);

  };


  const closeModal = () => {

    setShowModal(false);
    setError("");

  };


  /* ==========================================================
     REFUND
  ========================================================== */

  const handleConfirmRefund = () => {

    const value =
      tokenOrOrderId.trim();

    const numericAmount =
      Number(amount);


    if (!value) {

      setError(
        "Enter a token number or order reference."
      );

      return;
    }


    if (
      !amount ||
      numericAmount <= 0
    ) {

      setError(
        "Enter a valid refund amount."
      );

      return;
    }


    const newRefund = {

      id: `refund-${refunds.length + 1}`,

      token: value.startsWith("#")
        ? value
        : `#${value}`,

      orderId:
        "6a843a989cc44a1b8dc7014e",

      amount: numericAmount,

      reason,

      status: "Refunded",

    };


    setRefunds(
      (current) => [
        newRefund,
        ...current,
      ]
    );


    closeModal();

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

                <ShieldCheck
                  size={10}
                />

                Payments

              </span>

            </div>


            <p className="mt-0.5 truncate text-[11px] text-[#8A7E71]">
              Manage digital payment reversals and cancellation requests
            </p>

          </div>

        </div>


        {/* Header action */}

        <button
          type="button"
          onClick={openModal}
          className="
            inline-flex
            h-9
            items-center
            gap-1.5
            rounded-lg
            bg-[#282521]
            px-3.5
            text-[10px]
            font-bold
            text-white
            shadow-sm
            transition-all
            hover:bg-[#1D1B18]
            hover:shadow-md
            active:scale-[0.98]
          "
        >

          <RefreshCw
            size={13}
          />

          Issue refund

        </button>

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
          meta="Razorpay reversals"
          dotClass="bg-[#23866F]"
        />


        <KpiCard
          icon={Clock3}
          iconClass="bg-[#FFF0D5] text-[#D58A13]"
          label="Refund success"
          value="100%"
          meta="Instant reversal SLA"
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


          {/* Activity header */}

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
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search token or order reference..."
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

          </div>


          {/* Column headings */}

          <div className="hidden grid-cols-[125px_minmax(170px,1.2fr)_100px_minmax(160px,1.4fr)_100px] items-center gap-4 border-b border-[#EFE6DC] bg-[#FCFAF7] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#938578] md:grid">

            <span>
              Token
            </span>

            <span>
              Order reference
            </span>

            <span>
              Amount
            </span>

            <span>
              Reason
            </span>

            <span className="text-right">
              Status
            </span>

          </div>


          {/* Rows */}

          <div>

            {filteredRefunds.length >
            0 ? (

              filteredRefunds.map(
                (refund) => (
                  <RefundRow
                    key={refund.id}
                    refund={refund}
                  />
                )
              )

            ) : (

              <EmptyState />

            )}

          </div>

        </div>


        {/* ====================================================
            REFUND DESK
        ==================================================== */}

        <aside className="h-fit overflow-hidden rounded-xl bg-[#292622] text-white shadow-[0_10px_28px_rgba(37,31,24,0.15)]">


          {/* Panel header */}

          <div className="border-b border-white/[0.08] px-4 py-3.5">

            <div className="flex items-center gap-2.5">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6A23C] text-[#2B2115]">

                <CircleDollarSign
                  size={15}
                />

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


          {/* Total */}

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


          {/* Stats */}

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
              value="Instant"
            />

          </div>


          {/* Audit */}

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


          {/* CTA */}

          <div className="border-t border-white/[0.08] p-3.5">

            <button
              type="button"
              onClick={openModal}
              className="
                flex
                h-9
                w-full
                items-center
                justify-center
                gap-1.5
                rounded-lg
                bg-[#E6A23C]
                px-3
                text-[10px]
                font-bold
                text-[#292015]
                shadow-sm
                transition
                hover:bg-[#F0B447]
                hover:shadow-md
                active:scale-[0.99]
              "
            >

              <RefreshCw
                size={12}
              />

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
          tokenOrOrderId={
            tokenOrOrderId
          }
          setTokenOrOrderId={
            setTokenOrOrderId
          }
          amount={amount}
          setAmount={setAmount}
          reason={reason}
          setReason={setReason}
          error={error}
          onClose={closeModal}
          onConfirm={
            handleConfirmRefund
          }
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

function RefundRow({
  refund,
}) {

  return (

    <div className="group border-b border-[#EFE6DC] px-4 py-3.5 last:border-b-0 hover:bg-[#FFFCF8]">


      {/* Desktop */}

      <div className="hidden grid-cols-[125px_minmax(170px,1.2fr)_100px_minmax(160px,1.4fr)_100px] items-center gap-4 md:grid">


        {/* Token */}

        <div className="flex items-center gap-2.5">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBE9E7] text-[#D6534F]">

            <Hash
              size={14}
            />

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

            <CheckCircle2
              size={10}
            />

            Refunded

          </span>

        </div>

      </div>


      {/* Mobile */}

      <div className="md:hidden">

        <div className="flex items-start justify-between gap-3">

          <div className="flex items-center gap-2.5">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBE9E7] text-[#D6534F]">

              <Hash
                size={14}
              />

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

            <CheckCircle2
              size={10}
            />

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
            valueClass.includes(
              "59B99D"
            )
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

        <ReceiptText
          size={19}
        />

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
}) {

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211D18]/55 p-4 backdrop-blur-[3px]">


      <div className="w-full max-w-[470px] overflow-hidden rounded-[18px] border border-[#DED3C5] bg-white shadow-[0_25px_80px_rgba(25,20,15,0.25)]">


        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#E9E0D5] px-4 py-3.5">

          <div className="flex items-center gap-2.5">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8E7C8] text-[#C77C1F]">

              <RefreshCw
                size={16}
              />

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
            <X
              size={15}
            />
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

              <span>
                {error}
              </span>

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

              {refundReasons.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </Field>


          <div className="flex items-start gap-2 rounded-lg bg-[#F8F4EE] px-3 py-2.5">

            <ShieldCheck
              size={14}
              className="mt-0.5 shrink-0 text-[#23866F]"
            />

            <p className="text-[9px] leading-4 text-[#766A5D]">
              Refunds are recorded against the token and payment reference for audit purposes.
            </p>

          </div>

        </div>


        {/* Actions */}

        <div className="flex gap-2 border-t border-[#E9E0D5] bg-[#FCFAF7] px-4 py-3">

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              flex-1
              items-center
              justify-center
              rounded-lg
              border
              border-[#DED2C5]
              bg-white
              px-3
              text-[10px]
              font-bold
              text-[#554C44]
              transition
              hover:bg-[#F7F2EC]
            "
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={onConfirm}
            className="
              flex
              h-9
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-[#282521]
              px-3
              text-[10px]
              font-bold
              text-white
              shadow-sm
              transition
              hover:bg-[#1F1D1A]
            "
          >

            <RefreshCw
              size={12}
            />

            Confirm refund

            <ChevronRight
              size={12}
            />

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