import { useState } from "react";
import {
  Volume2,
  VolumeX,
  Plus,
  Check,
//   Clock3,
//   Banknote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const orders = [
  {
    token: "A-023",
    time: "3 min ago",
    status: "PAID ✓ digital",
    statusType: "paid",
    items: "Tea ×2, Samosa ×1",
    amount: "₹35",
    action: "Mark Ready",
  },
  {
    token: "A-024",
    time: "2 min ago",
    status: "CASH ₹24 pending",
    statusType: "cash",
    items: "Cutting Chai ×3",
    amount: "₹24",
    action: "Mark Ready",
    secondaryAction: "Collect",
  },
  {
    token: "A-025",
    time: "Just now",
    status: "PAID ✓ digital",
    statusType: "paid",
    items: "Biryani ×1, Lassi ×1",
    amount: "₹180",
    action: "Mark Preparing",
  },
  {
    token: "A-026",
    time: "Just now",
    status: "CASH ₹35 pending",
    statusType: "cash",
    items: "Tea ×2, Samosa ×1",
    amount: "₹35",
    action: "Mark Ready",
    secondaryAction: "Collect",
  },
  {
    token: "A-022",
    time: "6 min ago",
    status: "PAID ✓ digital",
    statusType: "paid",
    items: "Bun Maska ×2",
    amount: "₹16",
    action: "Mark Collected",
  },
];

function LiveOrdersPage() {
  const navigate = useNavigate();
  const [soundOn, setSoundOn] = useState(true);
  const [activeOrders, setActiveOrders] = useState(orders);

  const handleAction = (token, action) => {
    if (action === "Collect" || action === "Mark Collected") {
      setActiveOrders((current) =>
        current.filter((order) => order.token !== token)
      );
    }
  };

  return (
    <section className="min-h-screen bg-[#F7F3ED] px-6 py-6 lg:px-8">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-5">

        <div>
          <h1 className="text-[23px] font-semibold text-[#241F1A]">
            Live Orders
          </h1>

          <p className="mt-1 text-sm text-[#766A5D]">
            Saturday, 18 July · Updating in real time
          </p>
        </div>

        <div className="flex gap-2.5">

          <button
            type="button"
            onClick={() => setSoundOn((value) => !value)}
            className="flex items-center gap-2 rounded-lg border border-[#E5D8C8] bg-white px-4 py-2 text-sm font-semibold text-[#2B241E] transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            {soundOn ? (
              <Volume2 size={16} />
            ) : (
              <VolumeX size={16} />
            )}

            {soundOn ? "Sound on" : "Sound off"}
          </button>
<button
  type="button"
  onClick={() => navigate("/owner/manual")}
  className="flex items-center gap-2 rounded-xl bg-[#282521] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D1B18]"
>
      <Plus size={16} />
   Manual order
</button>

        </div>

      </div>

      {/* KPI Strip */}
      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          label="Orders today"
          value="142"
          sub="↑ 18% vs yesterday"
        />

        <KpiCard
          label="Revenue today"
          value="₹4,820"
          sub="Digital ₹3,180 · Cash ₹1,640"
        />

        <KpiCard
          label="Avg wait time"
          value="3.4 min"
          sub="Token to Ready"
        />

        <KpiCard
          label="Pending collection"
          value="₹340"
          sub="4 orders awaiting cash"
        />

      </div>

      {/* Active Orders */}
      <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#766A5D]">
        Active now{" "}
        <span className="font-mono normal-case tracking-normal text-[#A59A8C]">
          · {activeOrders.length} orders
        </span>
      </div>

      {activeOrders.length > 0 ? (

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {activeOrders.map((order) => (

            <div
              key={order.token}
              className="overflow-hidden rounded-2xl border border-[#E5D8C8] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >

              {/* Token */}
              <div className="flex items-center justify-between border-b border-[#F0E8DE] px-5 py-4">

                <div className="font-mono text-2xl font-bold text-[#2B2823]">
                  {order.token}
                </div>

                <div className="text-xs text-[#8B8074]">
                  {order.time}
                </div>

              </div>

              {/* Body */}
              <div className="p-5">

                <div className="mb-4 flex items-center justify-between">

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      order.statusType === "paid"
                        ? "bg-[#E4F3EE] text-[#1F6E5C]"
                        : "bg-[#FBEFD2] text-[#A66A08]"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span className="text-lg font-bold text-[#2B241E]">
                    {order.amount}
                  </span>

                </div>

                <p className="mb-5 text-sm text-[#6B6258]">
                  {order.items}
                </p>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      handleAction(order.token, order.action)
                    }
                    className="flex-1 rounded-lg bg-[#2B2823] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D1B18]"
                  >
                    {order.action}
                  </button>

                  {order.secondaryAction && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAction(
                          order.token,
                          order.secondaryAction
                        )
                      }
                      className="rounded-lg border border-[#E5D8C8] bg-white px-4 py-2.5 text-sm font-semibold text-[#2B241E] transition hover:bg-[#FFF6E9]"
                    >
                      {order.secondaryAction}
                    </button>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="rounded-2xl border border-[#E5D8C8] bg-white p-12 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3E2C4]">
            <Check
              size={28}
              className="text-[#C77C1F]"
            />
          </div>

          <h2 className="text-lg font-semibold text-[#2B241E]">
            All caught up
          </h2>

          <p className="mt-1 text-sm text-[#766A5D]">
            No active orders right now — new tokens will appear here instantly.
          </p>

        </div>

      )}

    </section>
  );
}

function KpiCard({ label, value, sub }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#E5D8C8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#C77C1F] to-[#E0A758]" />

      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#766A5D]">
        {label}
      </p>

      <p className="mt-2 text-[26px] font-bold text-[#2B241E]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#8B8074]">
        {sub}
      </p>

    </div>
  );
}

export default LiveOrdersPage;