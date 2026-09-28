import {
  Maximize2,
  Minimize2,
  Check,
  Circle,
  UserRound,
  ChefHat,
  ClipboardCheck,
  Utensils,
  Coffee,
  GlassWater,
  Candy,
  Zap,
  ChevronRight,
  CircleDot,
  Layers3,
  TimerReset,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchMerchantOrders,
  changeOrderStatus,
} from "../redux/thunks/orderThunks";


/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    label: "All",
    icon: Layers3,
  },
  {
    label: "Tea & Coffee",
    icon: Coffee,
  },
  {
    label: "Snacks",
    icon: Utensils,
  },
  {
    label: "Cold Drinks",
    icon: GlassWater,
  },
  {
    label: "Sweets",
    icon: Candy,
  },
];


/* =========================================================
   CATEGORY MAP
========================================================= */

const categoryMap = {
  "Vada Pav": "Snacks",
  "Filter Coffee": "Tea & Coffee",
  "Bun Maska": "Snacks",
  "Diet Coke": "Cold Drinks",
  Samosa: "Snacks",
  "Sweet Lassi": "Cold Drinks",
  "Iced Coffee": "Cold Drinks",
  "Cutting Chai": "Tea & Coffee",
  "Masala Tea": "Tea & Coffee",
  Jalebi: "Sweets",
};


/* =========================================================
   FORMAT ORDER TIME
========================================================= */

function formatOrderTime(createdAt) {
  if (!createdAt) {
    return "";
  }

  const created = new Date(createdAt);
  const now = new Date();

  const diffMs =
    now.getTime() -
    created.getTime();

  const diffMinutes =
    Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Just placed";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours =
    Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  return created.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    }
  );
}


/* =========================================================
   MAP API ORDER → KITCHEN TICKET
========================================================= */

function mapApiOrderToKitchenTicket(order) {
  const status =
    String(order.status || "")
      .toUpperCase();

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  return {
    id: order._id,

    token:
      order.tokenNumber ||
      "N/A",

    type: order.tableId
      ? "TABLE ORDER"
      : "COUNTER PICKUP",

    customer:
      order.customerName ||
      "Guest",

    time: formatOrderTime(
      order.createdAt
    ),

    status,

    items: items.map((item) => ({
      name:
        item.name ||
        "Item",

      quantity:
        Number(item.quantity) || 0,

      /*
       * The current backend has order-level
       * status, not item-level preparation status.
       *
       * Therefore READY means the entire order
       * is prepared.
       */
      ready:
        status === "READY",
    })),

    originalOrder: order,
  };
}


/* =========================================================
   MAIN PAGE
========================================================= */

function KitchenQueuePage() {
  const dispatch = useDispatch();


  /* =======================================================
     REDUX
  ======================================================= */

  const merchant = useSelector(
    (state) =>
      state.merchant.merchant
  );

  const apiOrders = useSelector(
    (state) =>
      state.orders.orders
  );

  const loading = useSelector(
    (state) =>
      state.orders.loading
  );

  const error = useSelector(
    (state) =>
      state.orders.error
  );


  /* =======================================================
     LOCAL UI STATE
  ======================================================= */

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [
    isFullscreen,
    setIsFullscreen,
  ] = useState(false);

  const [
    updatingOrderId,
    setUpdatingOrderId,
  ] = useState(null);

  /*
   * Local item preparation state.
   *
   * This is only for the visual checklist.
   * The real persisted status remains the
   * order-level backend status.
   */
  const [
    preparedItems,
    setPreparedItems,
  ] = useState({});


  /* =======================================================
     FETCH ORDERS
     
     New orders automatically appear.
     Updated orders automatically refresh.
  ======================================================= */

  useEffect(() => {
    if (!merchant?._id) {
      return;
    }

    dispatch(
      fetchMerchantOrders()
    );

    const interval =
      setInterval(() => {
        dispatch(
          fetchMerchantOrders()
        );
      }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [
    dispatch,
    merchant?._id,
  ]);


  /* =======================================================
     MAP API ORDERS
  ======================================================= */

  const tickets = useMemo(() => {
    return apiOrders
      .filter((order) => {
        const status =
          String(
            order.status || ""
          ).toUpperCase();

        /*
         * Kitchen should only show orders
         * which are still in kitchen workflow.
         *
         * COMPLETED / COLLECTED are no longer
         * kitchen orders.
         */
        return (
          status === "RECEIVED" ||
          status === "PREPARING" ||
          status === "READY"
        );
      })
      .map(
        mapApiOrderToKitchenTicket
      );
  }, [apiOrders]);




  /* =======================================================
     FULLSCREEN STATE
  ======================================================= */

  useEffect(() => {
    const handleFullscreenChange =
      () => {
        setIsFullscreen(
          Boolean(
            document.fullscreenElement
          )
        );
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


  /* =======================================================
     TOGGLE ITEM
     
     Visual preparation only.
  ======================================================= */

  const toggleItem = (
    ticketId,
    itemIndex
  ) => {
    setPreparedItems(
      (current) => {
        const existing =
          current[
            ticketId
          ] || [];

        const next =
          [...existing];

        next[itemIndex] =
          !next[itemIndex];

        return {
          ...current,
          [ticketId]: next,
        };
      }
    );
  };


  /* =======================================================
     MARK ORDER READY
  ======================================================= */

  const markReady = async (
    ticket
  ) => {
    const orderId =
      ticket?.originalOrder?._id ||
      ticket?.id;

    if (!orderId) {
      console.error(
        "Kitchen order ID not available."
      );

      return;
    }

    /*
     * Don't send READY again.
     */
    if (
      ticket.status ===
      "READY"
    ) {
      return;
    }

    try {
      setUpdatingOrderId(
        orderId
      );

      await dispatch(
        changeOrderStatus(
          orderId,
          "ready"
        )
      );

      /*
       * Immediately refresh Redux
       * so every owner page sees the
       * same updated order.
       */
      await dispatch(
        fetchMerchantOrders()
      );

    } catch (updateError) {
      console.error(
        "Failed to mark order ready:",
        updateError
      );
    } finally {
      setUpdatingOrderId(
        null
      );
    }
  };


  /* =======================================================
     CATEGORY FILTER
  ======================================================= */

  const visibleTickets =
    useMemo(() => {
      if (
        selectedCategory ===
        "All"
      ) {
        return tickets;
      }

      return tickets.filter(
        (ticket) =>
          ticket.items.some(
            (item) =>
              categoryMap[
                item.name
              ] ===
              selectedCategory
          )
      );
    }, [
      tickets,
      selectedCategory,
    ]);


  /* =======================================================
     QUEUE STATISTICS
  ======================================================= */

  const queueStats =
    useMemo(() => {
      let totalItems = 0;

      let readyItems = 0;

      tickets.forEach(
        (ticket) => {
          totalItems +=
            ticket.items.length;

          if (
            ticket.status ===
            "READY"
          ) {
            readyItems +=
              ticket.items.length;

            return;
          }

          const localReady =
            preparedItems[
              ticket.id
            ] || [];

          readyItems +=
            localReady.filter(
              Boolean
            ).length;
        }
      );

      const completion =
        totalItems > 0
          ? Math.round(
              (readyItems /
                totalItems) *
                100
            )
          : 0;

      const readyOrders =
        tickets.filter(
          (ticket) =>
            ticket.status ===
            "READY"
        ).length;

      const preparingOrders =
        tickets.filter(
          (ticket) =>
            ticket.status ===
              "PREPARING" ||
            ticket.status ===
              "RECEIVED"
        ).length;

      return {
        totalItems,
        readyItems,
        completion,
        readyOrders,
        preparingOrders,
      };
    }, [
      tickets,
      preparedItems,
    ]);


  /* =======================================================
     FULLSCREEN
  ======================================================= */

  const handleFullscreen =
    async () => {
      const element =
        document.getElementById(
          "kds-screen"
        );

      if (!element) {
        return;
      }

      try {
        if (
          !document.fullscreenElement
        ) {
          await element.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (fullscreenError) {
        console.error(
          "Fullscreen error:",
          fullscreenError
        );
      }
    };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      id="kds-screen"
      className="min-h-screen bg-[#F7F3ED]"
    >
      <section className="px-5 py-5 lg:px-7">

        {/* =====================================================
            WORKSPACE TITLE
        ===================================================== */}

        <div className="mb-5 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#282521] text-[#E6A23C] shadow-sm">

              <ChefHat
                size={19}
                strokeWidth={2}
              />

            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-[20px] font-semibold tracking-[-0.03em] text-[#241F1A]">
                  Kitchen Workspace
                </h1>

                <span className="flex items-center gap-1.5 rounded-full bg-[#EAF5F1] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#237760]">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#32A985]" />

                  Active

                </span>

              </div>

              <p className="mt-0.5 text-[11px] text-[#8A7E71]">
                Prepare incoming orders and move them to ready.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2">

            <div className="hidden items-center gap-2 rounded-lg border border-[#E5D8C8] bg-white px-3 py-2 sm:flex">

              <ClipboardCheck
                size={14}
                className="text-[#C77C1F]"
              />

              <span className="text-[11px] font-semibold text-[#4B433B]">
                {tickets.length} active
              </span>

            </div>


            <button
              type="button"
              onClick={
                handleFullscreen
              }
              className="flex h-9 items-center gap-2 rounded-lg bg-[#282521] px-3.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#1D1B18]"
            >

              {isFullscreen ? (
                <Minimize2
                  size={14}
                />
              ) : (
                <Maximize2
                  size={14}
                />
              )}

              <span className="hidden sm:inline">
                {isFullscreen
                  ? "Exit Fullscreen"
                  : "Fullscreen"}
              </span>

            </button>

          </div>

        </div>


        {/* =====================================================
            CATEGORY + QUEUE STATUS
        ===================================================== */}

        <div className="mb-5 flex items-center justify-between gap-4">

          <div className="flex max-w-full items-center overflow-x-auto rounded-xl border border-[#E4D9CB] bg-white p-1 shadow-sm">

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
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/25 ${
                      active
                        ? "bg-[#282521] text-white shadow-sm"
                        : "text-[#766A5D] hover:bg-[#F7F3ED]"
                    }`}
                  >

                    <Icon
                      size={12}
                      strokeWidth={2}
                    />

                    {category.label}

                  </button>
                );
              }
            )}

          </div>


          <div className="hidden items-center gap-4 text-[10px] font-medium text-[#877A6D] md:flex">

            <span className="flex items-center gap-1.5">

              <span className="h-2 w-2 rounded-full bg-[#E4A12E]" />

              Preparing

            </span>

            <span className="flex items-center gap-1.5">

              <span className="h-2 w-2 rounded-full bg-[#35A987]" />

              Ready

            </span>

          </div>

        </div>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-4 rounded-xl border border-[#E7CFC8] bg-[#FFF7F5] px-4 py-3 text-[11px] font-medium text-[#A14E43]">
            Unable to refresh kitchen orders.
          </div>
        )}


        {/* =====================================================
            MAIN WORKSPACE
        ===================================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_245px]">

          {/* =================================================
              TICKETS
          ================================================= */}

          <main>

            <div className="mb-3 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <CircleDot
                  size={13}
                  className="text-[#C77C1F]"
                />

                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#62574C]">
                  Active queue
                </span>

                <span className="rounded-full bg-[#EEE7DD] px-2 py-0.5 text-[9px] font-bold text-[#7B6E61]">
                  {
                    visibleTickets.length
                  }
                </span>

              </div>

              <span className="text-[10px] text-[#9A8E81]">
                Tap an item when preparation is complete
              </span>

            </div>


            {loading &&
            tickets.length ===
              0 ? (

              <div className="flex min-h-[390px] items-center justify-center rounded-xl border border-[#DDD2C4] bg-white">

                <p className="text-[11px] font-medium text-[#8B7E70]">
                  Loading kitchen orders...
                </p>

              </div>

            ) : visibleTickets.length >
              0 ? (

              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 2xl:grid-cols-3">

                {visibleTickets.map(
                  (ticket) => (
                    <KitchenTicket
                      key={
                        ticket.id
                      }
                      ticket={
                        ticket
                      }
                      preparedItems={
                        preparedItems[
                          ticket.id
                        ] || []
                      }
                      updating={
                        updatingOrderId ===
                        ticket.id
                      }
                      onToggleItem={
                        toggleItem
                      }
                      onMarkReady={
                        markReady
                      }
                    />
                  )
                )}

              </div>

            ) : (

              <EmptyState />

            )}

          </main>


          {/* =================================================
              QUEUE OVERVIEW
          ================================================= */}

          <aside className="h-fit overflow-hidden rounded-xl border border-[#DED3C5] bg-white shadow-sm">

            <div className="border-b border-[#E9E0D5] px-4 py-3.5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[11px] font-bold text-[#302A24]">
                    Queue overview
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#94887B]">
                    Current kitchen workload
                  </p>

                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F4E6D1] text-[#C77C1F]">

                  <Layers3
                    size={14}
                  />

                </div>

              </div>

            </div>


            <div className="border-b border-[#E9E0D5] px-4 py-4">

              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#95897C]">
                Active orders
              </p>

              <div className="mt-1 flex items-end gap-2">

                <span className="text-[30px] font-semibold leading-none tracking-[-0.04em] text-[#28231F]">
                  {
                    tickets.length
                  }
                </span>

                <span className="mb-0.5 text-[11px] font-semibold text-[#35A987]">
                  in queue
                </span>

              </div>

            </div>


            <div className="border-b border-[#E9E0D5] px-4 py-4">

              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.11em] text-[#95897C]">
                Queue status
              </p>

              <div className="space-y-3">

                <StatusRow
                  label="Preparing"
                  value={
                    queueStats.preparingOrders
                  }
                  dot="bg-[#E4A12E]"
                />

                <StatusRow
                  label="Ready"
                  value={
                    queueStats.readyOrders
                  }
                  dot="bg-[#35A987]"
                />

              </div>

            </div>


            <div className="border-b border-[#E9E0D5] px-4 py-4">

              <div className="mb-2 flex items-center justify-between">

                <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#95897C]">
                  Item completion
                </p>

                <span className="font-mono text-[10px] font-bold text-[#302A24]">
                  {
                    queueStats.completion
                  }
                  %
                </span>

              </div>


              <div className="h-1.5 overflow-hidden rounded-full bg-[#EEE8DF]">

                <div
                  className="h-full rounded-full bg-[#35A987] transition-all duration-300"
                  style={{
                    width: `${queueStats.completion}%`,
                  }}
                />

              </div>


              <p className="mt-2 text-[10px] text-[#968A7D]">
                {
                  queueStats.readyItems
                }{" "}
                of{" "}
                {
                  queueStats.totalItems
                }{" "}
                items prepared
              </p>

            </div>


            <div className="px-4 py-4">

              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.11em] text-[#95897C]">
                Kitchen workflow
              </p>


              <WorkflowStep
                number="01"
                label="Received"
                active
              />

              <WorkflowLine />

              <WorkflowStep
                number="02"
                label="Preparing"
                active
              />

              <WorkflowLine />

              <WorkflowStep
                number="03"
                label="Ready"
              />

              <WorkflowLine />

              <WorkflowStep
                number="04"
                label="Pickup"
              />

            </div>

          </aside>

        </div>

      </section>
    </div>
  );
}


/* =========================================================
   KITCHEN TICKET
========================================================= */

function KitchenTicket({
  ticket,
  preparedItems,
  updating,
  onToggleItem,
  onMarkReady,
}) {
  const totalCount =
    ticket.items.length;

  const readyCount =
    ticket.status ===
    "READY"
      ? totalCount
      : preparedItems.filter(
          Boolean
        ).length;

  const progress =
    totalCount > 0
      ? Math.round(
          (readyCount /
            totalCount) *
            100
        )
      : 0;

  const isComplete =
    ticket.status ===
      "READY" ||
    readyCount ===
      totalCount;


  return (
    <article
      className={`overflow-hidden rounded-xl border bg-[#292621] shadow-[0_6px_20px_rgba(43,35,26,0.08)] transition ${
        isComplete
          ? "border-[#3C9278]"
          : "border-[#403B35]"
      }`}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="px-4 pb-3.5 pt-3.5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-1.5">

            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isComplete
                  ? "bg-[#43B995]"
                  : "bg-[#E6A23C]"
              }`}
            />

            <span className="text-[9px] font-bold tracking-[0.14em] text-[#A49B91]">
              {ticket.type}
            </span>

          </div>


          <span className="text-[10px] text-[#837A70]">
            {ticket.time}
          </span>

        </div>


        <div className="mt-3 flex items-end justify-between">

          <div>

            <h2 className="font-mono text-[28px] font-bold leading-none tracking-[-0.04em] text-white">
              {ticket.token}
            </h2>


            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#9F968B]">

              <UserRound
                size={10}
              />

              {ticket.customer}

            </div>

          </div>


          <div className="text-right">

            <div
              className={`font-mono text-[16px] font-bold ${
                isComplete
                  ? "text-[#46B995]"
                  : "text-[#E6A23C]"
              }`}
            >
              {readyCount}/
              {totalCount}
            </div>

            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#756D64]">
              prepared
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          ITEMS
      ===================================================== */}

      <div className="border-t border-white/[0.06] px-3 py-3">

        <div className="space-y-1.5">

          {ticket.items.map(
            (item, index) => {

              const itemReady =
                ticket.status ===
                  "READY" ||
                Boolean(
                  preparedItems[
                    index
                  ]
                );

              return (
                <button
                  key={`${item.name}-${index}`}
                  type="button"
                  disabled={
                    ticket.status ===
                    "READY"
                  }
                  onClick={() =>
                    onToggleItem(
                      ticket.id,
                      index
                    )
                  }
                  className="flex w-full items-center gap-2.5 rounded-lg bg-[#332F2A] px-2.5 py-2 text-left transition hover:bg-[#3A3631] disabled:cursor-default"
                >

                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                      itemReady
                        ? "bg-[#2D9D7E] text-white"
                        : "border border-[#5C554C] text-[#746D64]"
                    }`}
                  >

                    {itemReady ? (
                      <Check
                        size={12}
                        strokeWidth={3}
                      />
                    ) : (
                      <Circle
                        size={8}
                      />
                    )}

                  </span>


                  <span
                    className={`min-w-0 flex-1 truncate text-[11px] font-semibold ${
                      itemReady
                        ? "text-[#78C9B2] line-through"
                        : "text-[#E9E2D8]"
                    }`}
                  >
                    {item.name}
                  </span>


                  <span
                    className={`font-mono text-[10px] font-bold ${
                      itemReady
                        ? "text-[#5AA38F]"
                        : "text-[#E6A23C]"
                    }`}
                  >
                    ×
                    {
                      item.quantity
                    }
                  </span>

                </button>
              );
            }
          )}

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="border-t border-white/[0.06] px-3 pb-3 pt-2.5">

        <div className="mb-2">

          <div className="mb-1.5 flex items-center justify-between">

            <div className="flex items-center gap-1.5">

              <TimerReset
                size={10}
                className="text-[#81786D]"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#81786D]">
                Preparation
              </span>

            </div>


            <span
              className={`font-mono text-[9px] font-bold ${
                isComplete
                  ? "text-[#48B894]"
                  : "text-[#A59A8E]"
              }`}
            >
              {progress}%
            </span>

          </div>


          <div className="h-1 overflow-hidden rounded-full bg-[#464139]">

            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isComplete
                  ? "bg-[#35A987]"
                  : "bg-[#D99228]"
              }`}
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>


        <button
          type="button"
          disabled={
            updating ||
            ticket.status ===
              "READY"
          }
          onClick={() =>
            onMarkReady(
              ticket
            )
          }
          className={`flex h-9 w-full items-center justify-center gap-2 rounded-lg text-[10px] font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            isComplete
              ? "bg-[#35A987] text-white hover:bg-[#43B995]"
              : "bg-[#3A3631] text-[#DED6CD] hover:bg-[#454039]"
          }`}
        >

          {updating ? (
            <>
              <TimerReset
                size={12}
                className="animate-spin"
              />

              Updating...
            </>
          ) : ticket.status ===
            "READY" ? (
            <>
              <Check
                size={13}
                strokeWidth={3}
              />

              Ready
            </>
          ) : isComplete ? (
            <>
              <Check
                size={13}
                strokeWidth={3}
              />

              Mark order ready
            </>
          ) : (
            <>
              <Zap
                size={12}
              />

              Complete remaining

              <ChevronRight
                size={12}
              />
            </>
          )}

        </button>

      </div>

    </article>
  );
}


/* =========================================================
   STATUS ROW
========================================================= */

function StatusRow({
  label,
  value,
  dot,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">

        <span
          className={`h-2 w-2 rounded-full ${dot}`}
        />

        <span className="text-[10px] font-medium text-[#62584E]">
          {label}
        </span>

      </div>


      <span className="font-mono text-[10px] font-bold text-[#302A24]">
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   WORKFLOW STEP
========================================================= */

function WorkflowStep({
  number,
  label,
  active = false,
}) {
  return (
    <div className="flex items-center gap-2.5">

      <span
        className={`flex h-6 w-6 items-center justify-center rounded-md font-mono text-[9px] font-bold ${
          active
            ? "bg-[#282521] text-[#E6A23C]"
            : "bg-[#F1EBE3] text-[#A39789]"
        }`}
      >
        {number}
      </span>


      <span
        className={`text-[11px] font-semibold ${
          active
            ? "text-[#3D362F]"
            : "text-[#9A8E81]"
        }`}
      >
        {label}
      </span>

    </div>
  );
}


/* =========================================================
   WORKFLOW LINE
========================================================= */

function WorkflowLine() {
  return (
    <div className="ml-3 h-3 border-l border-dashed border-[#D9CFC2]" />
  );
}


/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex min-h-[390px] items-center justify-center rounded-xl border border-dashed border-[#DDD2C4] bg-white">

      <div className="max-w-xs text-center">

        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3E4CF] text-[#C77C1F]">

          <ChefHat
            size={21}
          />

        </div>


        <h2 className="text-sm font-semibold text-[#302A24]">
          Kitchen queue is clear
        </h2>


        <p className="mt-1 text-[10px] leading-5 text-[#8B7E70]">
          There are no orders waiting for
          preparation. New orders will
          appear here automatically.
        </p>

      </div>

    </div>
  );
}


export default KitchenQueuePage;