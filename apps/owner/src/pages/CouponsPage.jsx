import { useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Trash2,
  X,
  TicketPercent,
  Tag,
  UsersRound,
  TrendingUp,
  CheckCircle2,
  Clock3,
  Sparkles,
  Copy,
  Percent,
  CircleDollarSign,
  AlertCircle,
} from "lucide-react";

const INITIAL_COUPONS = [
  {
    id: 1,
    code: "WELCOME",
    discountType: "percentage",
    discountValue: 10,
    minOrder: 49,
    maxUses: 50,
    used: 10,
    expiryDate: "2026-10-01",
    active: true,
  },
];

function CouponsPage() {
  const [coupons, setCoupons] =
    useState(INITIAL_COUPONS);

  const [showModal, setShowModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const activeCoupons =
    coupons.filter(
      (coupon) => coupon.active
    ).length;

  const totalRedemptions =
    coupons.reduce(
      (total, coupon) =>
        total + coupon.used,
      0
    );

  const averageDiscount =
    coupons.length
      ? Math.round(
          coupons.reduce(
            (total, coupon) =>
              total +
              (coupon.discountType ===
              "percentage"
                ? coupon.discountValue
                : 0),
            0
          ) / coupons.length
        )
      : 0;

  const filteredCoupons =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) return coupons;

      return coupons.filter(
        (coupon) =>
          coupon.code
            .toLowerCase()
            .includes(query)
      );
    }, [coupons, search]);

  const createCoupon = (
    newCoupon
  ) => {
    setCoupons((prev) => [
      ...prev,
      {
        ...newCoupon,
        id: Date.now(),
        used: 0,
        active: true,
      },
    ]);

    setShowModal(false);
  };

  const deleteCoupon = (id) => {
    const coupon =
      coupons.find(
        (item) => item.id === id
      );

    if (!coupon) return;

    if (
      !window.confirm(
        `Delete coupon "${coupon.code}"?`
      )
    ) {
      return;
    }

    setCoupons((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  const toggleCoupon = (id) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id
          ? {
              ...coupon,
              active:
                !coupon.active,
            }
          : coupon
      )
    );
  };

  return (
    <div className="min-h-full bg-[#F7F3ED] px-5 py-5 lg:px-7">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[#292621] text-[#E6A23C] shadow-[0_4px_12px_rgba(41,38,33,0.10)]">
            <TicketPercent
              size={17}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-[19px] font-bold tracking-[-0.03em] text-[#29251F]">
                Coupons
              </h1>

              <span className="rounded-full bg-[#E8F5F0] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#237762]">
                {activeCoupons} active
              </span>

            </div>

            <p className="mt-0.5 truncate text-[11px] text-[#81766B]">
              Create and manage promotional offers for customers
            </p>

          </div>

        </div>


        <button
          type="button"
          onClick={() =>
            setShowModal(true)
          }
          className="
            inline-flex
            h-9
            items-center
            gap-1.5
            rounded-lg
            bg-[#292621]
            px-3.5
            text-[10px]
            font-bold
            text-white
            shadow-sm
            transition-all
            hover:-translate-y-0.5
            hover:bg-[#1E1C19]
            hover:shadow-md
            active:scale-[0.98]
          "
        >
          <Plus size={14} />
          Create coupon
        </button>

      </div>


      {/* =====================================================
          KPI STRIP
      ===================================================== */}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">

        <MiniStat
          icon={TicketPercent}
          label="Active coupons"
          value={activeCoupons}
          sub={`${coupons.length} total created`}
          iconClass="bg-[#F5E8D3] text-[#C57B18]"
        />

        <MiniStat
          icon={UsersRound}
          label="Redemptions"
          value={totalRedemptions}
          sub="Total uses"
          iconClass="bg-[#E5F3EE] text-[#25836D]"
        />

        <MiniStat
          icon={Percent}
          label="Avg discount"
          value={`${averageDiscount}%`}
          sub="Percentage offers"
          iconClass="bg-[#F0EAE3] text-[#665D54]"
        />

        <MiniStat
          icon={TrendingUp}
          label="Promotion status"
          value="Healthy"
          sub="Offers running normally"
          iconClass="bg-[#E7F4EF] text-[#25836D]"
          valueClass="text-[#277C67]"
        />

      </div>


      {/* =====================================================
          SEARCH BAR
      ===================================================== */}

      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">

        <div className="relative min-w-0 flex-1">

          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F84]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search coupon code..."
            className="
              h-10.5
              w-full
              rounded-[10px]
              border
              border-[#DDD2C6]
              bg-white
              pl-9
              pr-3
              text-[12px]
              font-medium
              text-[#29251F]
              outline-none
              shadow-[0_1px_2px_rgba(40,32,24,0.025)]
              transition
              placeholder:text-[#AAA096]
              hover:border-[#CEC0B3]
              focus:border-[#D49A48]
              focus:bg-[#FFFDF9]
              focus:ring-[3px]
              focus:ring-[#D49A48]/10
            "
          />

        </div>


        <div className="flex h-10.5 shrink-0 items-center gap-2 rounded-[10px] border border-[#DDD2C6] bg-white px-3">

          <Sparkles
            size={13}
            className="text-[#C57B18]"
          />

          <span className="text-[10px] font-semibold text-[#6C6258]">
            {filteredCoupons.length}{" "}
            {filteredCoupons.length === 1
              ? "offer"
              : "offers"}{" "}
            shown
          </span>

        </div>

      </div>


      {/* =====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">

        {/* ===================================================
            COUPON LIST
        =================================================== */}

        <div className="min-w-0">

          {filteredCoupons.length ===
          0 ? (

            <EmptyCoupons
              search={search}
              onCreate={() =>
                setShowModal(true)
              }
            />

          ) : (

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">

              {filteredCoupons.map(
                (coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onDelete={() =>
                      deleteCoupon(
                        coupon.id
                      )
                    }
                    onToggle={() =>
                      toggleCoupon(
                        coupon.id
                      )
                    }
                  />
                )
              )}

            </div>

          )}

        </div>


        {/* ===================================================
            PROMOTION DESK
        =================================================== */}

        <aside className="h-fit overflow-hidden rounded-[16px] bg-[#292621] text-white shadow-[0_10px_28px_rgba(31,27,22,0.13)]">

          {/* Panel header */}

          <div className="border-b border-white/[0.08] px-4 py-3.5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6A23C] text-[#292015]">
                  <Sparkles size={14} />
                </div>

                <div>

                  <h2 className="text-[12px] font-bold">
                    Promotion desk
                  </h2>

                  <p className="mt-0.5 text-[9px] text-[#AFA69C]">
                    Quick campaign overview
                  </p>

                </div>

              </div>

              <TrendingUp
                size={14}
                className="text-[#E6A23C]"
              />

            </div>

          </div>


          {/* Main insight */}

          <div className="p-3">

            <div className="rounded-[12px] border border-[#66502E] bg-[#342C21] p-3">

              <div className="flex items-start gap-2.5">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0B348] text-[#382610]">
                  <TicketPercent
                    size={15}
                  />
                </div>

                <div>

                  <p className="text-[11px] font-bold">
                    {activeCoupons
                      ? `${activeCoupons} promotion${
                          activeCoupons >
                          1
                            ? "s"
                            : ""
                        } running`
                      : "No active promotions"}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#A49A90]">
                    {activeCoupons
                      ? "Your active offers are currently available to customers."
                      : "Create a promotion to encourage more orders."}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* Metrics */}

          <div className="border-t border-white/[0.08]">

            <DarkMetric
              icon={UsersRound}
              label="Redemptions"
              value={totalRedemptions}
            />

            <DarkMetric
              icon={Percent}
              label="Average discount"
              value={`${averageDiscount}%`}
              valueClass="text-[#F0B348]"
            />

            <DarkMetric
              icon={CheckCircle2}
              label="Active offers"
              value={activeCoupons}
              valueClass="text-[#59B99D]"
            />

          </div>


          {/* Campaign tips */}

          <div className="border-t border-white/[0.08] p-3.5">

            <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.14em] text-[#938A81]">
              Campaign tips
            </p>

            <div className="space-y-2">

              <Tip
                icon={CircleDollarSign}
                text="Use a minimum order value to protect margins."
              />

              <Tip
                icon={Clock3}
                text="Add an expiry date to create urgency."
              />

              <Tip
                icon={UsersRound}
                text="Set usage limits for controlled campaigns."
              />

            </div>

          </div>


          {/* CTA */}

          <div className="border-t border-white/[0.08] p-3.5">

            <button
              type="button"
              onClick={() =>
                setShowModal(true)
              }
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
              <Plus size={12} />
              Create promotion
            </button>

          </div>

        </aside>

      </div>


      {/* =====================================================
          CREATE MODAL
      ===================================================== */}

      {showModal && (
        <CreateCouponModal
          onClose={() =>
            setShowModal(false)
          }
          onCreate={createCoupon}
        />
      )}

    </div>
  );
}


/* =============================================================
   MINI STAT
============================================================= */

function MiniStat({
  icon: Icon,
  label,
  value,
  sub,
  iconClass,
  valueClass = "text-[#29251F]",
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-[12px] border border-[#DED3C5] bg-white px-3 py-2.5 shadow-sm">

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon size={14} />
      </div>

      <div className="min-w-0">

        <p className="text-[8px] font-bold uppercase tracking-[0.11em] text-[#8D8175]">
          {label}
        </p>

        <div className="mt-0.5 flex min-w-0 items-baseline gap-1.5">

          <p
            className={`text-[16px] font-bold tracking-[-0.02em] ${valueClass}`}
          >
            {value}
          </p>

          <p className="truncate text-[9px] font-medium text-[#9B9084]">
            {sub}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   COUPON CARD
============================================================= */

function CouponCard({
  coupon,
  onDelete,
  onToggle,
}) {
  const usagePercent =
    coupon.maxUses > 0
      ? Math.min(
          100,
          Math.round(
            (coupon.used /
              coupon.maxUses) *
              100
          )
        )
      : 0;

  const remaining =
    Math.max(
      0,
      coupon.maxUses -
        coupon.used
    );

  return (
    <div
      className={`group overflow-hidden rounded-[14px] border bg-white shadow-[0_4px_16px_rgba(54,43,30,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(54,43,30,0.075)] ${
        coupon.active
          ? "border-[#E0D5C8]"
          : "border-[#E8DDD2] opacity-75"
      }`}
    >

      {/* ===================================================
          TOP STRIP
      =================================================== */}

      <div className="relative overflow-hidden border-b border-[#EEE6DC] bg-[#FCFAF7] px-4 py-3.5">

        <div className="absolute -right-5 -top-7 h-24 w-24 rounded-full bg-[#E6A23C]/[0.08]" />

        <div className="relative flex items-start justify-between gap-3">

          <div className="flex min-w-0 items-center gap-2.5">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#F4E5CD] text-[#C47712]">
              <Tag
                size={15}
              />
            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <p className="truncate font-mono text-[14px] font-bold tracking-[0.05em] text-[#B97012]">
                  {coupon.code}
                </p>

                <button
                  type="button"
                  title="Copy coupon code"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      coupon.code
                    );
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#A09386] opacity-0 transition hover:bg-[#F1E9DE] hover:text-[#62584E] group-hover:opacity-100"
                >
                  <Copy
                    size={11}
                  />
                </button>

              </div>

              <p className="mt-0.5 text-[9px] text-[#968A7E]">
                Promotional offer
              </p>

            </div>

          </div>


          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-bold ${
              coupon.active
                ? "bg-[#E5F4EE] text-[#247B66]"
                : "bg-[#EEEAE5] text-[#766E66]"
            }`}
          >
            {coupon.active
              ? "Active"
              : "Inactive"}
          </span>

        </div>

      </div>


      {/* ===================================================
          OFFER
      =================================================== */}

      <div className="px-4 py-3.5">

        <div className="flex items-end justify-between gap-4">

          <div>

            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#94887C]">
              Customer receives
            </p>

            <p className="mt-1 text-[22px] font-bold tracking-[-0.04em] text-[#29251F]">

              {coupon.discountType ===
              "percentage"
                ? `${coupon.discountValue}%`
                : `₹${coupon.discountValue}`}

              <span className="ml-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#80756A]">
                {coupon.discountType ===
                "percentage"
                  ? "OFF"
                  : "discount"}
              </span>

            </p>

          </div>


          <div className="rounded-lg bg-[#F6F0E8] px-2.5 py-2 text-right">

            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#978B7E]">
              Min order
            </p>

            <p className="mt-0.5 text-[11px] font-bold text-[#4B433B]">
              ₹{coupon.minOrder}
            </p>

          </div>

        </div>


        {/* =================================================
            USAGE
        ================================================= */}

        <div className="mt-4">

          <div className="mb-1.5 flex items-center justify-between">

            <div className="flex items-center gap-1.5">

              <UsersRound
                size={11}
                className="text-[#8C8176]"
              />

              <span className="text-[9px] font-semibold text-[#6D6258]">
                Redemptions
              </span>

            </div>

            <span className="text-[9px] font-bold text-[#4E463E]">
              {coupon.used} /{" "}
              {coupon.maxUses}
            </span>

          </div>


          <div className="h-[5px] overflow-hidden rounded-full bg-[#EEE8E0]">

            <div
              className="h-full rounded-full bg-[#D8942E] transition-all"
              style={{
                width: `${usagePercent}%`,
              }}
            />

          </div>


          <div className="mt-1 flex justify-between">

            <span className="text-[8px] text-[#A0968A]">
              {usagePercent}% used
            </span>

            <span className="text-[8px] text-[#A0968A]">
              {remaining} remaining
            </span>

          </div>

        </div>


        {/* =================================================
            DETAILS
        ================================================= */}

        <div className="mt-3 grid grid-cols-2 gap-2">

          <DetailCell
            icon={CalendarDays}
            label="Expires"
            value={
              coupon.expiryDate
                ? formatDate(
                    coupon.expiryDate
                  )
                : "No expiry"
            }
          />

          <DetailCell
            icon={CircleDollarSign}
            label="Type"
            value={
              coupon.discountType ===
              "percentage"
                ? "Percentage"
                : "Flat discount"
            }
          />

        </div>

      </div>


      {/* ===================================================
          ACTION BAR
      =================================================== */}

      <div className="flex items-center gap-2 border-t border-[#EEE6DC] bg-[#FCFAF7] px-4 py-2.5">

        <button
          type="button"
          onClick={onToggle}
          className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-[9px] font-bold transition ${
            coupon.active
              ? "border border-[#CDE3DB] bg-[#EFF8F4] text-[#267C67] hover:bg-[#E5F3EE]"
              : "border border-[#DDD3C8] bg-white text-[#645B53] hover:bg-[#F7F2EC]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              coupon.active
                ? "bg-[#2CA982]"
                : "bg-[#AAA097]"
            }`}
          />

          {coupon.active
            ? "Active"
            : "Activate"}

        </button>


        <button
          type="button"
          onClick={onDelete}
          className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-[#E7D7D3] bg-white px-3 text-[9px] font-bold text-[#C34C44] transition hover:bg-[#FFF4F2]"
        >
          <Trash2
            size={11}
          />

          Delete

        </button>

      </div>

    </div>
  );
}


/* =============================================================
   DETAIL CELL
============================================================= */

function DetailCell({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-[9px] border border-[#EAE1D8] bg-[#FCFAF7] px-2.5 py-2">

      <div className="flex items-center gap-1.5">

        <Icon
          size={10}
          className="text-[#9B8F83]"
        />

        <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#9A8E82]">
          {label}
        </span>

      </div>

      <p className="mt-1 text-[9px] font-bold text-[#4D453D]">
        {value}
      </p>

    </div>
  );
}


/* =============================================================
   DARK METRIC
============================================================= */

function DarkMetric({
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
          className="text-[#777069]"
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


/* =============================================================
   TIP
============================================================= */

function Tip({
  icon: Icon,
  text,
}) {
  return (
    <div className="flex items-start gap-2">

      <Icon
        size={11}
        className="mt-0.5 shrink-0 text-[#E6A23C]"
      />

      <p className="text-[9px] leading-4 text-[#938B83]">
        {text}
      </p>

    </div>
  );
}


/* =============================================================
   EMPTY STATE
============================================================= */

function EmptyCoupons({
  search,
  onCreate,
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[#DCCFC0] bg-white px-6 text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EBDD] text-[#C77C1F]">
        {search ? (
          <Search size={20} />
        ) : (
          <TicketPercent
            size={20}
          />
        )}
      </div>

      <h3 className="mt-3 text-[14px] font-bold text-[#302B26]">
        {search
          ? "No coupons found"
          : "No promotions yet"}
      </h3>

      <p className="mt-1 max-w-sm text-[10px] leading-4 text-[#8B7F73]">
        {search
          ? "Try another coupon code."
          : "Create your first promotional coupon to start driving repeat orders."}
      </p>

      {!search && (
        <button
          type="button"
          onClick={onCreate}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#292621] px-3.5 py-2 text-[10px] font-bold text-white shadow-sm"
        >
          <Plus size={12} />
          Create coupon
        </button>
      )}

    </div>
  );
}


/* =============================================================
   CREATE COUPON MODAL
============================================================= */

function CreateCouponModal({
  onClose,
  onCreate,
}) {
  const [form, setForm] =
    useState({
      code: "",
      discountType:
        "percentage",
      discountValue: "",
      minOrder: "0",
      maxUses: "0",
      expiryDate: "",
    });

  const [error, setError] =
    useState("");

  const updateField = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const submit = (event) => {
    event.preventDefault();

    const code =
      form.code
        .trim()
        .toUpperCase();

    if (!code) {
      setError(
        "Enter a coupon code."
      );
      return;
    }

    if (!form.discountValue) {
      setError(
        "Enter a discount value."
      );
      return;
    }

    if (
      form.discountType ===
        "percentage" &&
      Number(form.discountValue) >
        100
    ) {
      setError(
        "Percentage discount cannot exceed 100%."
      );
      return;
    }

    onCreate({
      code,
      discountType:
        form.discountType,
      discountValue: Number(
        form.discountValue
      ),
      minOrder: Number(
        form.minOrder || 0
      ),
      maxUses: Number(
        form.maxUses || 0
      ),
      expiryDate:
        form.expiryDate,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#201B17]/45 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="flex h-full w-full max-w-[500px] flex-col overflow-hidden bg-[#FCFAF7] shadow-[-24px_0_70px_rgba(30,25,20,0.22)]">

        {/* =================================================
            DRAWER HEADER
        ================================================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#E7DDD2] bg-[#FCFAF7] px-5 py-4">

          <div className="flex min-w-0 items-center gap-2.5">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4E5CD] text-[#C47712]">
              <TicketPercent
                size={16}
              />
            </div>

            <div className="min-w-0">

              <h2 className="truncate text-[16px] font-bold tracking-[-0.025em] text-[#29251F]">
                Create coupon
              </h2>

              <p className="mt-0.5 text-[9px] text-[#8B7F73]">
                Build a promotional offer for customers
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#DED3C8] bg-white text-[#645B53] transition hover:bg-[#F7F3ED]"
          >
            <X size={15} />
          </button>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={submit}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
        >

          {/* HERO */}

          <div className="mb-5 overflow-hidden rounded-[14px] border border-[#E6D9C9] bg-[#F8F0E3] p-3.5">

            <div className="flex items-start gap-2.5">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E6A23C] text-[#352712]">
                <Sparkles
                  size={14}
                />
              </div>

              <div>

                <p className="text-[10px] font-bold text-[#60431E]">
                  Make the offer easy to understand
                </p>

                <p className="mt-0.5 text-[9px] leading-4 text-[#8A7254]">
                  A clear code, sensible minimum order and expiry date make promotions easier to manage.
                </p>

              </div>

            </div>

          </div>


          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-[10px] border border-[#F0C9C5] bg-[#FFF2F0] px-3 py-2.5 text-[9px] font-semibold text-[#B84740]">

              <AlertCircle
                size={13}
                className="mt-0.5 shrink-0"
              />

              {error}

            </div>
          )}


          {/* CODE */}

          <FormSection
            eyebrow="Campaign"
            title="Coupon identity"
            description="Give customers a short, memorable promotion code."
          >

            <FormField label="Coupon code">

              <div className="relative">

                <Tag
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08F7C]"
                />

                <input
                  value={form.code}
                  onChange={(event) =>
                    updateField(
                      "code",
                      event.target
                        .value
                    )
                  }
                  placeholder="WELCOME10"
                  className={`${INPUT_CLASS} pl-9 font-mono uppercase tracking-[0.08em]`}
                />

              </div>

            </FormField>

          </FormSection>


          {/* DISCOUNT */}

          <FormSection
            eyebrow="Offer"
            title="Discount configuration"
            description="Choose whether customers receive a percentage or flat-value discount."
          >

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <FormField label="Discount type">

                <select
                  value={
                    form.discountType
                  }
                  onChange={(event) =>
                    updateField(
                      "discountType",
                      event.target
                        .value
                    )
                  }
                  className={INPUT_CLASS}
                >

                  <option value="percentage">
                    Percentage (% OFF)
                  </option>

                  <option value="flat">
                    Flat discount (₹)
                  </option>

                </select>

              </FormField>


              <FormField label="Discount value">

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#756A60]">
                    {form.discountType ===
                    "percentage"
                      ? "%"
                      : "₹"}
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.discountValue
                    }
                    onChange={(event) =>
                      updateField(
                        "discountValue",
                        event.target
                          .value
                      )
                    }
                    placeholder={
                      form.discountType ===
                      "percentage"
                        ? "10"
                        : "50"
                    }
                    className={`${INPUT_CLASS} pl-7`}
                  />

                </div>

              </FormField>

            </div>

          </FormSection>


          {/* LIMITS */}

          <FormSection
            eyebrow="Protection"
            title="Order & usage limits"
            description="Keep promotional spending controlled during busy periods."
          >

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <FormField label="Minimum order">

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#756A60]">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.minOrder
                    }
                    onChange={(event) =>
                      updateField(
                        "minOrder",
                        event.target
                          .value
                      )
                    }
                    className={`${INPUT_CLASS} pl-7`}
                  />

                </div>

              </FormField>


              <FormField label="Maximum uses">

                <div className="relative">

                  <UsersRound
                    size={13}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#968A7D]"
                  />

                  <input
                    type="number"
                    min="0"
                    value={
                      form.maxUses
                    }
                    onChange={(event) =>
                      updateField(
                        "maxUses",
                        event.target
                          .value
                      )
                    }
                    placeholder="50"
                    className={`${INPUT_CLASS} pl-8`}
                  />

                </div>

              </FormField>

            </div>

          </FormSection>


          {/* EXPIRY */}

          <FormSection
            eyebrow="Timing"
            title="Campaign expiry"
            description="Optional — leave blank if the promotion should remain available."
          >

            <div className="relative">

              <CalendarDays
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#968A7D]"
              />

              <input
                type="date"
                value={
                  form.expiryDate
                }
                onChange={(event) =>
                  updateField(
                    "expiryDate",
                    event.target
                      .value
                  )
                }
                className={`${INPUT_CLASS} pl-9`}
              />

            </div>

          </FormSection>


          <div className="h-20" />

        </form>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="shrink-0 border-t border-[#E7DDD2] bg-[#FCFAF7]/95 px-5 py-3.5 backdrop-blur-md">

          <div className="flex gap-2.5">

            <button
              type="button"
              onClick={onClose}
              className="h-9 flex-1 rounded-lg border border-[#DED3C7] bg-white px-3 text-[10px] font-bold text-[#554C44] transition hover:bg-[#F7F3ED]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-9 flex-[1.35] rounded-lg bg-[#292621] px-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#1F1D1A]"
            >
              Create coupon
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   FORM SECTION
============================================================= */

function FormSection({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="mb-6">

      <div className="mb-3">

        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#B17A30]">
          {eyebrow}
        </p>

        <h3 className="mt-0.5 text-[14px] font-bold text-[#37312B]">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] leading-4 text-[#93887D]">
          {description}
        </p>

      </div>

      {children}

    </section>
  );
}


/* =============================================================
   FORM FIELD
============================================================= */

function FormField({
  label,
  children,
}) {
  return (
    <div>

      <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.09em] text-[#756A60]">
        {label}
      </label>

      {children}

    </div>
  );
}


/* =============================================================
   DATE FORMAT
============================================================= */

function formatDate(date) {
  if (!date) {
    return "No expiry";
  }

  const [
    year,
    month,
    day,
  ] = date.split("-");

  return `${Number(day)}/${Number(
    month
  )}/${year}`;
}


/* =============================================================
   EXPORT
============================================================= */

export default CouponsPage;