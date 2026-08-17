import {
  Maximize2,
  Minimize2,
  Check,
  Circle,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

const categories = [
  "All",
  "Tea & Coffee",
  "Snacks",
  "Cold Drinks",
  "Sweets",
];

const initialTickets = [
  {
    id: 1,
    token: "A-003",
    type: "COUNTER PICKUP",
    customer: "Guest",
    time: "Just placed",
    category: "All",
    items: [
      { name: "Vada Pav", quantity: 1, ready: true },
      { name: "Filter Coffee", quantity: 1, ready: true },
      { name: "Bun Maska", quantity: 3, ready: true },
      { name: "Diet Coke", quantity: 1, ready: false },
      { name: "Samosa", quantity: 1, ready: false },
    ],
  },
];

function KitchenQueuePage() {
const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
  const [tickets, setTickets] = useState(initialTickets);

  const toggleItem = (ticketId, itemIndex) => {
    setTickets((current) =>
      current.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;

        return {
          ...ticket,
          items: ticket.items.map((item, index) =>
            index === itemIndex
              ? { ...item, ready: !item.ready }
              : item
          ),
        };
      })
    );
  };

  const markReady = (ticketId) => {
    setTickets((current) =>
      current.filter((ticket) => ticket.id !== ticketId)
    );
  };

  const visibleTickets = tickets.filter((ticket) => {
    if (selectedCategory === "All") return true;

    return ticket.items.some((item) => {
      const categoryMap = {
        "Vada Pav": "Snacks",
        "Filter Coffee": "Tea & Coffee",
        "Bun Maska": "Snacks",
        "Diet Coke": "Cold Drinks",
        Samosa: "Snacks",
      };

      return categoryMap[item.name] === selectedCategory;
    });
  });
  
  const handleFullscreen = async () => {
  const kdsScreen = document.getElementById("kds-screen");

  try {
    if (!document.fullscreenElement) {
      await kdsScreen.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.error("Fullscreen error:", error);
  }
};
useEffect(() => {
  const handleFullscreenChange = () => {
    setIsFullscreen(Boolean(document.fullscreenElement));
  };

  document.addEventListener(
    "fullscreenchange",
    handleFullscreenChange
  );

  return () => {
    document.removeEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );
  };
}, []);

  return (
    <div
  id="kds-screen"
  className="min-h-screen bg-[#F7F3ED]"
>
    <section className="min-h-screen bg-[#F7F3ED] px-6 py-6 lg:px-8">

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">

            <h1 className="text-[23px] font-semibold text-[#241F1A]">
              Kitchen Queue Display (KDS)
            </h1>

            <span className="rounded-lg bg-[#2B2823] px-3 py-1.5 font-mono text-xs font-semibold text-[#F6B64A]">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>

            <span className="rounded-full bg-[#E6A23C] px-3 py-1.5 text-xs font-bold text-[#241B14]">
              {tickets.length} active tickets
            </span>

          </div>

          <p className="mt-1 text-sm text-[#766A5D]">
            Tablet display · Tap items to strike out as prepared · One-tap mark ready
          </p>
        </div>

  <button
  type="button"
  onClick={handleFullscreen}
  className="flex items-center gap-2 rounded-xl bg-[#2B2823] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D1B18]"
>
  {isFullscreen ? (
    <Minimize2 size={16} />
  ) : (
    <Maximize2 size={16} />
  )}

  {isFullscreen ? "Exit Fullscreen" : "Fullscreen KDS"}
</button>

      </div>

      {/* Categories */}
      <div className="mb-5 flex flex-wrap gap-2">

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
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

      {/* Tickets */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        {visibleTickets.map((ticket) => {

          const readyCount = ticket.items.filter(
            (item) => item.ready
          ).length;

          const progress =
            (readyCount / ticket.items.length) * 100;

          return (
            <div
              key={ticket.id}
              className="overflow-hidden rounded-2xl bg-[#25221E] text-white shadow-lg"
            >

              {/* Ticket Header */}
              <div className="border-b border-white/10 px-5 py-4">

                <div className="flex items-center justify-between">

                  <span className="text-[11px] font-semibold tracking-wide text-[#B9AFA3]">
                    {ticket.type}
                  </span>

                  <span className="text-xs text-[#B9AFA3]">
                    {ticket.time}
                  </span>

                </div>

                <div className="py-4 text-center">

                  <div className="font-mono text-4xl font-bold tracking-wider text-[#E6A23C]">
                    {ticket.token}
                  </div>

                  <div className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#E6A23C]">
                    <UserRound size={14} />
                    {ticket.customer}
                  </div>

                </div>

              </div>

              {/* Items */}
              <div className="space-y-2 px-5 py-4">

                {ticket.items.map((item, index) => (

                  <button
                    key={`${item.name}-${index}`}
                    type="button"
                    onClick={() => toggleItem(ticket.id, index)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                      item.ready
                        ? "bg-[#17483F] text-[#5BE0BF]"
                        : "bg-[#302D29] text-white hover:bg-[#38342F]"
                    }`}
                  >

                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">

                      {item.ready ? (
                        <Check
                          size={15}
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Circle size={12} />
                      )}

                    </span>

                    <span
                      className={`flex-1 text-sm font-semibold ${
                        item.ready
                          ? "line-through opacity-80"
                          : ""
                      }`}
                    >
                      {item.name}
                    </span>

                    <span className="text-xs font-bold text-[#F2B84B]">
                      ×{item.quantity}
                    </span>

                  </button>

                ))}

              </div>

              {/* Progress */}
              <div className="px-5">

                <div className="h-1.5 overflow-hidden rounded-full bg-[#403C37]">
                  <div
                    className="h-full rounded-full bg-[#16866D] transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

              </div>

              {/* Action */}
              <div className="p-5">

                <button
                  type="button"
                  onClick={() => markReady(ticket.id)}
                  className="w-full rounded-lg bg-[#E6A23C] px-4 py-3 text-sm font-bold text-[#241B14] transition hover:bg-[#F0B14D]"
                >
                  MARK READY
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {/* Empty */}
      {visibleTickets.length === 0 && (
        <div className="rounded-2xl border border-[#E5D8C8] bg-white p-12 text-center">

          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E2C4]">
            <Check
              size={24}
              className="text-[#C77C1F]"
            />
          </div>

          <h2 className="font-semibold text-[#2B241E]">
            No tickets in this category
          </h2>

          <p className="mt-1 text-sm text-[#766A5D]">
            New kitchen orders will appear here.
          </p>

        </div>
      )}

    </section>
    </div>
  );
}

export default KitchenQueuePage;