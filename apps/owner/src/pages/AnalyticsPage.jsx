import { useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  Printer,
  TrendingUp,
  ShoppingBag,
  WalletCards,
  Banknote,
  Clock3,
  BarChart3,
  FileSpreadsheet,
  Activity,
  ReceiptText,
  CircleDollarSign,
} from "lucide-react";

const ANALYTICS_DATA = [
  {
    period: "Wed 12",
    date: "2026-08-12",
    orders: 8,
    revenue: 721,
    digital: 2,
    cash: 6,
  },
  {
    period: "Thu 13",
    date: "2026-08-13",
    orders: 20,
    revenue: 1885,
    digital: 7,
    cash: 13,
  },
  {
    period: "Fri 14",
    date: "2026-08-14",
    orders: 6,
    revenue: 1625,
    digital: 1,
    cash: 5,
  },
  {
    period: "Sat 15",
    date: "2026-08-15",
    orders: 0,
    revenue: 0,
    digital: 0,
    cash: 0,
  },
  {
    period: "Sun 16",
    date: "2026-08-16",
    orders: 0,
    revenue: 0,
    digital: 0,
    cash: 0,
  },
  {
    period: "Mon 17",
    date: "2026-08-17",
    orders: 1,
    revenue: 43,
    digital: 0,
    cash: 1,
  },
  {
    period: "Tue 18",
    date: "2026-08-18",
    orders: 8,
    revenue: 1707,
    digital: 3,
    cash: 5,
  },
];

const BEST_SELLING = [
  {
    rank: 1,
    name: "Diet Coke",
    sold: 50,
  },
  {
    rank: 2,
    name: "Samosa",
    sold: 41,
  },
  {
    rank: 3,
    name: "Bun Maska",
    sold: 27,
  },
  {
    rank: 4,
    name: "Jalebi",
    sold: 25,
  },
  {
    rank: 5,
    name: "Vada Pav",
    sold: 19,
  },
];

function AnalyticsPage() {
  const [selectedRange, setSelectedRange] =
    useState("7days");

  const [customFrom, setCustomFrom] =
    useState("");

  const [customTo, setCustomTo] =
    useState("");

  const data = useMemo(() => {
    if (selectedRange === "today") {
      return ANALYTICS_DATA.slice(-1);
    }

    if (
      selectedRange === "7days" ||
      selectedRange === "month" ||
      selectedRange === "year"
    ) {
      return ANALYTICS_DATA;
    }

    if (
      selectedRange === "custom" &&
      customFrom &&
      customTo
    ) {
      return ANALYTICS_DATA.filter(
        (item) =>
          item.date >= customFrom &&
          item.date <= customTo
      );
    }

    return ANALYTICS_DATA;
  }, [
    selectedRange,
    customFrom,
    customTo,
  ]);

  const selectedRevenue = data.reduce(
    (sum, item) =>
      sum + item.revenue,
    0
  );

  const selectedOrders = data.reduce(
    (sum, item) =>
      sum + item.orders,
    0
  );

  const allTimeRevenue =
    ANALYTICS_DATA.reduce(
      (sum, item) =>
        sum + item.revenue,
      0
    );

  const allTimeOrders =
    ANALYTICS_DATA.reduce(
      (sum, item) =>
        sum + item.orders,
      0
    );

  const averageOrderValue =
    selectedOrders > 0
      ? Math.round(
          selectedRevenue /
            selectedOrders
        )
      : 0;

  const digitalOrders = data.reduce(
    (sum, item) =>
      sum + item.digital,
    0
  );

  const cashOrders = data.reduce(
    (sum, item) =>
      sum + item.cash,
    0
  );

  const digitalShare =
    selectedOrders > 0
      ? Math.round(
          (digitalOrders /
            selectedOrders) *
            100
        )
      : 0;

  const busiestSlot =
    "12:00–13:00";

  const maxRevenue = Math.max(
    ...data.map(
      (item) => item.revenue
    ),
    1
  );

  const peakRevenue = Math.max(
    ...data.map(
      (item) => item.revenue
    ),
    0
  );

  const peakDay =
    data.find(
      (item) =>
        item.revenue === peakRevenue
    )?.period || "—";

  const exportCSV = () => {
    const headers = [
      "Period",
      "Date",
      "Orders",
      "Gross Revenue",
      "Avg Order",
      "Digital (UPI)",
      "Cash Orders",
    ];

    const rows = data.map(
      (item) => [
        item.period,
        item.date,
        item.orders,
        item.revenue,
        item.orders
          ? Math.round(
              item.revenue /
                item.orders
            )
          : 0,
        item.digital,
        item.cash,
      ]
    );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${value}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      "qr-token-analytics.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="min-h-full bg-[#F7F3ED] px-5 py-5 lg:px-7">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[#292621] text-[#E6A23C] shadow-[0_4px_12px_rgba(41,38,33,0.10)]">
            <BarChart3
              size={18}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-[19px] font-bold tracking-[-0.03em] text-[#29251F]">
                Analytics
              </h1>

              <span className="hidden rounded-full bg-[#E8F5F0] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#237762] sm:inline-flex">
                Business intelligence
              </span>

            </div>

            <p className="mt-0.5 truncate text-[11px] text-[#81766B]">
              Revenue, order behaviour and payment performance
            </p>

          </div>

        </div>


        {/* Export controls */}

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={exportCSV}
            className="
              flex
              h-9
              items-center
              gap-1.5
              rounded-lg
              border
              border-[#DCD1C6]
              bg-white
              px-3
              text-[10px]
              font-bold
              text-[#574E46]
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:bg-[#FFFDF9]
              hover:shadow-md
            "
          >
            <FileSpreadsheet
              size={13}
              className="text-[#27816D]"
            />

            <span className="hidden sm:inline">
              Export CSV
            </span>

            <Download
              size={11}
              className="text-[#9A8E82]"
            />
          </button>


          <button
            type="button"
            onClick={printReport}
            className="
              flex
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
              transition
              hover:-translate-y-0.5
              hover:bg-[#1E1C19]
              hover:shadow-md
            "
          >
            <Printer size={13} />

            <span className="hidden sm:inline">
              Print report
            </span>
          </button>

        </div>

      </div>


      {/* =====================================================
          CONTROL BAR
      ===================================================== */}

      <div className="mb-4 rounded-[13px] border border-[#DED3C7] bg-white p-2 shadow-[0_2px_8px_rgba(50,40,30,0.025)]">

        <div className="flex flex-wrap items-center gap-2">

          {/* Range label */}

          <div className="mr-1 flex h-8 items-center gap-2 px-2">

            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F3E7D6] text-[#B87718]">
              <CalendarDays
                size={12}
              />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#766B61]">
              Range
            </span>

          </div>


          <FilterButton
            active={
              selectedRange ===
              "today"
            }
            onClick={() =>
              setSelectedRange(
                "today"
              )
            }
          >
            Today
          </FilterButton>

          <FilterButton
            active={
              selectedRange ===
              "7days"
            }
            onClick={() =>
              setSelectedRange(
                "7days"
              )
            }
          >
            Last 7 days
          </FilterButton>

          <FilterButton
            active={
              selectedRange ===
              "month"
            }
            onClick={() =>
              setSelectedRange(
                "month"
              )
            }
          >
            This month
          </FilterButton>

          <FilterButton
            active={
              selectedRange ===
              "year"
            }
            onClick={() =>
              setSelectedRange(
                "year"
              )
            }
          >
            This year
          </FilterButton>

          <FilterButton
            active={
              selectedRange ===
              "custom"
            }
            onClick={() =>
              setSelectedRange(
                "custom"
              )
            }
          >
            <CalendarDays
              size={12}
            />

            Custom
          </FilterButton>


          {/* Custom date controls */}

          {selectedRange ===
            "custom" && (
            <div className="ml-auto flex w-full flex-wrap items-center gap-2 border-t border-[#EEE6DC] pt-2 sm:w-auto sm:border-0 sm:pt-0">

              <DateInput
                value={
                  customFrom
                }
                onChange={
                  setCustomFrom
                }
              />

              <span className="text-[9px] font-semibold text-[#A09488]">
                to
              </span>

              <DateInput
                value={
                  customTo
                }
                onChange={
                  setCustomTo
                }
              />

            </div>
          )}

        </div>

      </div>


      {/* =====================================================
          INTELLIGENCE SUMMARY
      ===================================================== */}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">

        <AnalyticsMetric
          icon={CircleDollarSign}
          label="Selected revenue"
          value={`₹${selectedRevenue.toLocaleString(
            "en-IN"
          )}`}
          sub={`${selectedOrders} orders`}
          accent="amber"
        />

        <AnalyticsMetric
          icon={ShoppingBag}
          label="All-time orders"
          value={allTimeOrders}
          sub={`₹${allTimeRevenue.toLocaleString(
            "en-IN"
          )} sales`}
          accent="green"
        />

        <AnalyticsMetric
          icon={ReceiptText}
          label="Average order"
          value={`₹${averageOrderValue}`}
          sub="Per checkout"
          accent="neutral"
        />

        <AnalyticsMetric
          icon={WalletCards}
          label="Digital share"
          value={`${digitalShare}%`}
          sub={`UPI ${digitalOrders} · Cash ${cashOrders}`}
          accent="green"
        />

        <AnalyticsMetric
          icon={Clock3}
          label="Peak slot"
          value={busiestSlot}
          sub="Highest order volume"
          accent="amber"
          compact
        />

      </div>


      {/* =====================================================
          PRIMARY ANALYTICS AREA
      ===================================================== */}

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_300px]">

        {/* ===================================================
            REVENUE COMMAND CHART
        =================================================== */}

        <section className="overflow-hidden rounded-[16px] border border-[#DED3C7] bg-white shadow-[0_4px_16px_rgba(54,43,30,0.035)]">

          {/* Chart header */}

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEE6DC] px-4 py-3.5">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F4E5CD] text-[#C47712]">
                  <TrendingUp
                    size={13}
                  />
                </div>

                <h2 className="text-[13px] font-bold text-[#332D27]">
                  Revenue performance
                </h2>

              </div>

              <p className="mt-1 pl-9 text-[9px] text-[#94897E]">
                Gross sales movement across the selected period
              </p>

            </div>


            <div className="flex items-center gap-2">

              <div className="rounded-lg bg-[#F7F1E9] px-2.5 py-1.5">

                <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#988B7E]">
                  Period total
                </p>

                <p className="mt-0.5 text-[12px] font-bold text-[#B96F10]">
                  ₹{selectedRevenue.toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

              <div className="hidden rounded-lg bg-[#EDF6F2] px-2.5 py-1.5 sm:block">

                <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#83978E]">
                  Peak day
                </p>

                <p className="mt-0.5 text-[10px] font-bold text-[#287965]">
                  {peakDay}
                </p>

              </div>

            </div>

          </div>


          {/* Chart body */}

          <div className="px-4 pb-4 pt-5">

            <RevenueChart
              data={data}
              maxRevenue={
                maxRevenue
              }
            />

          </div>


          {/* Chart footer */}

          <div className="grid grid-cols-3 border-t border-[#EEE6DC] bg-[#FCFAF7]">

            <ChartFooterStat
              label="Orders"
              value={
                selectedOrders
              }
              icon={ShoppingBag}
            />

            <ChartFooterStat
              label="Digital"
              value={
                digitalOrders
              }
              icon={WalletCards}
              green
            />

            <ChartFooterStat
              label="Cash"
              value={
                cashOrders
              }
              icon={Banknote}
            />

          </div>

        </section>


        {/* ===================================================
            BEST SELLING PANEL
        =================================================== */}

        <section className="overflow-hidden rounded-[16px] bg-[#292621] text-white shadow-[0_10px_28px_rgba(31,27,22,0.13)]">

          <div className="border-b border-white/[0.08] px-4 py-3.5">

            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6A23C] text-[#332511]">
                    <ShoppingBag
                      size={13}
                    />
                  </div>

                  <h2 className="text-[12px] font-bold">
                    Best sellers
                  </h2>

                </div>

                <p className="mt-1 pl-9 text-[9px] text-[#948B83]">
                  Highest-selling menu items
                </p>

              </div>

              <Activity
                size={14}
                className="text-[#E6A23C]"
              />

            </div>

          </div>


          <div className="p-2.5">

            {BEST_SELLING.map(
              (item, index) => (
                <BestSellerRow
                  key={item.name}
                  item={item}
                  index={index}
                />
              )
            )}

          </div>


          <div className="border-t border-white/[0.08] px-4 py-3">

            <div className="flex items-center justify-between">

              <span className="text-[9px] text-[#918980]">
                Top item
              </span>

              <span className="text-[10px] font-bold text-[#F0B348]">
                {BEST_SELLING[0]?.name ||
                  "—"}
              </span>

            </div>

          </div>

        </section>

      </div>


      {/* =====================================================
          OPERATIONAL INSIGHT STRIP
      ===================================================== */}

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">

        <InsightCard
          icon={TrendingUp}
          title="Revenue signal"
          value={
            peakRevenue > 0
              ? `₹${peakRevenue.toLocaleString(
                  "en-IN"
                )}`
              : "₹0"
          }
          text={`${peakDay} produced the highest revenue in this view.`}
          tone="amber"
        />

        <InsightCard
          icon={WalletCards}
          title="Payment mix"
          value={`${digitalShare}% digital`}
          text={`${digitalOrders} digital vs ${cashOrders} cash orders in the selected range.`}
          tone="green"
        />

        <InsightCard
          icon={Clock3}
          title="Peak operation"
          value={busiestSlot}
          text="Highest order volume slot currently configured for the analytics view."
          tone="neutral"
        />

      </div>


      {/* =====================================================
          AUDIT SECTION
      ===================================================== */}

      <section className="overflow-hidden rounded-[16px] border border-[#DED3C7] bg-white shadow-[0_4px_16px_rgba(54,43,30,0.035)]">

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEE6DC] px-4 py-3.5">

          <div className="flex items-center gap-2.5">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0EAE3] text-[#6C6258]">
              <ReceiptText
                size={14}
              />
            </div>

            <div>

              <h2 className="text-[13px] font-bold text-[#332D27]">
                Sales & channel audit
              </h2>

              <p className="mt-0.5 text-[9px] text-[#94897E]">
                Daily order, revenue and payment breakdown
              </p>

            </div>

          </div>


          <div className="flex items-center gap-1.5 rounded-full border border-[#E6DDD3] bg-[#FCFAF7] px-2.5 py-1">

            <span className="h-1.5 w-1.5 rounded-full bg-[#39A88B]" />

            <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#766B61]">
              {data.length} periods
            </span>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] border-collapse">

            <thead>

              <tr className="border-b border-[#EAE2D8] bg-[#FCFAF7]">

                <AuditHeader>
                  Period
                </AuditHeader>

                <AuditHeader>
                  Date
                </AuditHeader>

                <AuditHeader align="right">
                  Orders
                </AuditHeader>

                <AuditHeader align="right">
                  Gross revenue
                </AuditHeader>

                <AuditHeader align="right">
                  Avg order
                </AuditHeader>

                <AuditHeader align="right">
                  Digital
                </AuditHeader>

                <AuditHeader align="right">
                  Cash
                </AuditHeader>

              </tr>

            </thead>


            <tbody>

              {data.map(
                (item, index) => {

                  const aov =
                    item.orders >
                    0
                      ? Math.round(
                          item.revenue /
                            item.orders
                        )
                      : 0;

                  const isPeak =
                    item.revenue ===
                      peakRevenue &&
                    peakRevenue >
                      0;

                  return (
                    <tr
                      key={
                        item.date
                      }
                      className="group border-b border-[#EEE7DE] transition last:border-b-0 hover:bg-[#FCFAF7]"
                    >

                      <td className="px-4 py-3.5">

                        <div className="flex items-center gap-2">

                          {isPeak && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D8942E]" />
                          )}

                          <span className="text-[11px] font-bold text-[#39322C]">
                            {item.period}
                          </span>

                        </div>

                      </td>


                      <td className="px-4 py-3.5">

                        <span className="text-[10px] font-medium text-[#877C71]">
                          {item.date}
                        </span>

                      </td>


                      <td className="px-4 py-3.5 text-right">

                        <span className="text-[11px] font-bold text-[#3D3730]">
                          {item.orders}
                        </span>

                      </td>


                      <td className="px-4 py-3.5 text-right">

                        <span className="text-[11px] font-bold text-[#B97012]">
                          ₹{item.revenue.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </td>


                      <td className="px-4 py-3.5 text-right">

                        <span className="text-[10px] font-semibold text-[#5E554D]">
                          ₹{aov}
                        </span>

                      </td>


                      <td className="px-4 py-3.5 text-right">

                        <span className="inline-flex min-w-[28px] justify-center rounded-md bg-[#E8F5F0] px-1.5 py-1 text-[9px] font-bold text-[#267A65]">
                          {item.digital}
                        </span>

                      </td>


                      <td className="px-4 py-3.5 text-right">

                        <span className="inline-flex min-w-[28px] justify-center rounded-md bg-[#F8EEDC] px-1.5 py-1 text-[9px] font-bold text-[#B66F15]">
                          {item.cash}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>


        {/* Table footer */}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#EEE6DC] bg-[#FCFAF7] px-4 py-2.5">

          <p className="text-[9px] text-[#94897E]">
            Revenue values represent gross sales in the selected view.
          </p>

          <div className="flex items-center gap-1.5">

            <span className="h-1.5 w-1.5 rounded-full bg-[#267A65]" />

            <span className="text-[8px] font-semibold text-[#766B61]">
              Digital
            </span>

            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#B66F15]" />

            <span className="text-[8px] font-semibold text-[#766B61]">
              Cash
            </span>

          </div>

        </div>

      </section>

    </div>
  );
}


/* =============================================================
   REVENUE CHART
============================================================= */

function RevenueChart({
  data,
  maxRevenue,
}) {
  return (
    <div className="relative">

      {/* Grid */}

      <div className="pointer-events-none absolute inset-x-0 bottom-[28px] top-0 flex flex-col justify-between">

        {[0, 1, 2, 3].map(
          (line) => (
            <div
              key={line}
              className="border-t border-dashed border-[#EDE6DD]"
            />
          )
        )}

      </div>


      <div className="relative flex h-[220px] items-end gap-2 sm:gap-3">

        {data.map(
          (item, index) => {

            const percentage =
              item.revenue === 0
                ? 1
                : Math.max(
                    3,
                    (item.revenue /
                      maxRevenue) *
                      100
                  );

            const isPeak =
              item.revenue ===
                maxRevenue &&
              item.revenue > 0;

            const isLast =
              index ===
              data.length - 1;

            return (
              <div
                key={item.date}
                className="group flex h-full flex-1 flex-col items-center justify-end"
              >

                {/* Value */}

                <div className="mb-1.5 h-5">

                  {item.revenue >
                    0 && (
                    <span
                      className={`text-[8px] font-bold opacity-0 transition group-hover:opacity-100 ${
                        isLast
                          ? "text-[#267A65]"
                          : "text-[#B97012]"
                      }`}
                    >
                      ₹
                      {item.revenue.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  )}

                </div>


                {/* Bar */}

                <div className="relative flex h-[175px] w-full max-w-[64px] items-end">

                  {isPeak && (
                    <div className="absolute -top-1 left-1/2 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-[#E6A23C] ring-4 ring-[#E6A23C]/10" />
                  )}

                  <div
                    className={`
                      relative
                      w-full
                      rounded-t-[8px]
                      transition-all
                      duration-300
                      group-hover:brightness-105
                      ${
                        isLast
                          ? "bg-[#247A68]"
                          : "bg-[#D8942E]"
                      }
                    `}
                    style={{
                      height: `${percentage}%`,
                      minHeight:
                        item.revenue ===
                        0
                          ? "2px"
                          : "5px",
                    }}
                  >

                    <div className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-white/20" />

                  </div>

                </div>


                {/* Label */}

                <div className="mt-2.5 flex flex-col items-center">

                  <span className="text-[9px] font-bold text-[#655B52]">
                    {item.period}
                  </span>

                  {isLast && (
                    <span className="mt-0.5 rounded-full bg-[#E7F4EF] px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-[0.08em] text-[#287965]">
                      Latest
                    </span>
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}


/* =============================================================
   ANALYTICS METRIC
============================================================= */

function AnalyticsMetric({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  compact = false,
}) {
  const iconStyles = {
    amber:
      "bg-[#F5E8D3] text-[#C57B18]",
    green:
      "bg-[#E5F3EE] text-[#25836D]",
    neutral:
      "bg-[#F0EAE3] text-[#6C6258]",
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-[12px] border border-[#DED3C7] bg-white shadow-[0_2px_8px_rgba(50,40,30,0.025)]">

      <div className="flex items-center gap-2.5 px-3 py-2.5">

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconStyles[accent]}`}
        >
          <Icon
            size={14}
          />
        </div>

        <div className="min-w-0">

          <p className="truncate text-[8px] font-bold uppercase tracking-[0.1em] text-[#908478]">
            {label}
          </p>

          <p
            className={`mt-0.5 truncate font-bold tracking-[-0.03em] ${
              compact
                ? "text-[14px] text-[#B97012]"
                : "text-[17px] text-[#29251F]"
            }`}
          >
            {value}
          </p>

          <p className="truncate text-[8px] font-medium text-[#9A8E82]">
            {sub}
          </p>

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   CHART FOOTER STAT
============================================================= */

function ChartFooterStat({
  label,
  value,
  icon: Icon,
  green = false,
}) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5">

      <div className="flex items-center gap-1.5">

        <Icon
          size={11}
          className={
            green
              ? "text-[#27816D]"
              : "text-[#A28F7D]"
          }
        />

        <span className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#968B80]">
          {label}
        </span>

      </div>

      <span
        className={`text-[11px] font-bold ${
          green
            ? "text-[#267A65]"
            : "text-[#4C443D]"
        }`}
      >
        {value}
      </span>

    </div>
  );
}


/* =============================================================
   BEST SELLER ROW
============================================================= */

function BestSellerRow({
  item,
  index,
}) {
  const top = index === 0;

  return (
    <div
      className={`
        group
        flex
        items-center
        gap-2.5
        rounded-[10px]
        px-2.5
        py-2.5
        transition
        ${
          top
            ? "bg-white/[0.07]"
            : "hover:bg-white/[0.045]"
        }
      `}
    >

      <div
        className={`
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-lg
          text-[9px]
          font-bold
          ${
            top
              ? "bg-[#E6A23C] text-[#332511]"
              : "bg-white/[0.07] text-[#AFA69D]"
          }
        `}
      >
        {String(
          item.rank
        ).padStart(2, "0")}
      </div>


      <div className="min-w-0 flex-1">

        <p className="truncate text-[10px] font-bold text-white">
          {item.name}
        </p>

        <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">

          <div
            className={`h-full rounded-full ${
              top
                ? "bg-[#E6A23C]"
                : "bg-[#80776F]"
            }`}
            style={{
              width: `${
                (item.sold /
                  BEST_SELLING[0]
                    .sold) *
                100
              }%`,
            }}
          />

        </div>

      </div>


      <div className="shrink-0 text-right">

        <p className="font-mono text-[10px] font-bold text-[#F0B348]">
          {item.sold}×
        </p>

        <p className="text-[7px] uppercase tracking-[0.06em] text-[#817870]">
          sold
        </p>

      </div>

    </div>
  );
}


/* =============================================================
   INSIGHT CARD
============================================================= */

function InsightCard({
  icon: Icon,
  title,
  value,
  text,
  tone,
}) {
  const styles = {
    amber: {
      icon: "bg-[#F5E8D3] text-[#C57B18]",
      value: "text-[#B97012]",
    },
    green: {
      icon: "bg-[#E5F3EE] text-[#25836D]",
      value: "text-[#267A65]",
    },
    neutral: {
      icon: "bg-[#F0EAE3] text-[#6C6258]",
      value: "text-[#4B443D]",
    },
  };

  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-[12px] border border-[#DED3C7] bg-white px-3.5 py-3 shadow-[0_2px_8px_rgba(50,40,30,0.025)]">

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles[tone].icon}`}
      >
        <Icon
          size={14}
        />
      </div>

      <div className="min-w-0">

        <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#93887D]">
          {title}
        </p>

        <p
          className={`mt-0.5 truncate text-[13px] font-bold ${styles[tone].value}`}
        >
          {value}
        </p>

        <p className="mt-0.5 text-[8px] leading-3.5 text-[#94897E]">
          {text}
        </p>

      </div>

    </div>
  );
}


/* =============================================================
   FILTER BUTTON
============================================================= */

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        h-8
        items-center
        gap-1.5
        rounded-lg
        border
        px-3
        text-[9px]
        font-bold
        transition-all
        active:scale-[0.98]
        ${
          active
            ? "border-[#292621] bg-[#292621] text-white shadow-sm"
            : "border-transparent bg-[#F7F3ED] text-[#655C54] hover:border-[#E0D5C9] hover:bg-white"
        }
      `}
    >
      {children}
    </button>
  );
}


/* =============================================================
   DATE INPUT
============================================================= */

function DateInput({
  value,
  onChange,
}) {
  return (
    <div className="relative">

      <CalendarDays
        size={11}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9A8E82]"
      />

      <input
        type="date"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          h-8
          rounded-lg
          border
          border-[#DDD2C6]
          bg-white
          pl-7
          pr-2
          text-[9px]
          font-semibold
          text-[#554C44]
          outline-none
          transition
          focus:border-[#D49A48]
          focus:ring-[3px]
          focus:ring-[#D49A48]/10
        "
      />

    </div>
  );
}


/* =============================================================
   AUDIT HEADER
============================================================= */

function AuditHeader({
  children,
  align = "left",
}) {
  return (
    <th
      className={`px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.09em] text-[#786D62] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}


export default AnalyticsPage;