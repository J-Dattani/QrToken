import { useCallback, useEffect, useMemo, useState } from "react";
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
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { apiRequest } from "../api/client";

function AnalyticsPage() {
  const merchant = useSelector(
    (state) => state.merchant?.merchant
  );

  const merchantId = merchant?._id || merchant?.id;

  const [selectedRange, setSelectedRange] = useState("7days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [toast, setToast] = useState(null);
 
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const showToast = (message, type = "info") => {
  setToast({
    message,
    type,
  });

  window.setTimeout(() => {
    setToast(null);
  }, 3000);
};


  /* =========================================================
     LOAD LIVE ANALYTICS
  ========================================================= */

  const loadAnalytics = useCallback(async () => {
    if (!merchantId) {
      setLoading(false);
      setError("Merchant information is not available.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        `/analytics/${merchantId}`
      );

      const payload =
        response?.data ??
        response?.analytics ??
        response;

      setAnalytics(payload);
    } catch (requestError) {
      console.error(
        "Analytics API error:",
        requestError
      );

      setAnalytics(null);

      setError(
        requestError?.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  }, [merchantId]);

  /*
   * Delayed call keeps the effect clean for the Owner app's
   * lint rules while still loading immediately.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAnalytics();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadAnalytics]);

  /* =========================================================
     NORMALIZE API WEEKLY DATA
  ========================================================= */

  const weeklyData = useMemo(() => {
    if (!Array.isArray(analytics?.weeklyData)) {
      return [];
    }

    return analytics.weeklyData.map((item) => ({
      period:
        item?.label ||
        item?.period ||
        "—",

      date: item?.date || "",

      orders: Number(
        item?.orders ?? 0
      ),

      revenue: Number(
        item?.revenue ?? 0
      ),

      digital: Number(
        item?.digital ?? 0
      ),

      cash: Number(
        item?.cash ?? 0
      ),
    }));
  }, [analytics]);

  /* =========================================================
     TODAY DATA
  ========================================================= */

  const todayData = useMemo(() => {
    if (!weeklyData.length) {
      return [];
    }

    return weeklyData.slice(-1);
  }, [weeklyData]);

  /* =========================================================
     DISPLAYED DATA

     API currently gives weeklyData only.
     Therefore:

     Today  -> latest returned day
     7 days -> complete weeklyData
     Custom -> filters the returned weeklyData
     Month/Year -> use returned data only; no fake backend data
  ========================================================= */

  const data = useMemo(() => {
    if (selectedRange === "today") {
      return todayData;
    }

    if (
      selectedRange === "custom" &&
      customFrom &&
      customTo
    ) {
      return weeklyData.filter(
        (item) =>
          item.date >= customFrom &&
          item.date <= customTo
      );
    }

    return weeklyData;
  }, [
    selectedRange,
    customFrom,
    customTo,
    weeklyData,
    todayData,
  ]);

  /* =========================================================
     SELECTED REVENUE
  ========================================================= */

  const selectedRevenue = useMemo(() => {
    if (selectedRange === "today") {
      return Number(
        analytics?.todayRevenue ?? 0
      );
    }

    if (selectedRange === "7days") {
      return Number(
        analytics?.weekRevenue ??
          analytics?.rangeRevenue ??
          0
      );
    }

    return data.reduce(
      (sum, item) =>
        sum + item.revenue,
      0
    );
  }, [
    selectedRange,
    analytics,
    data,
  ]);

  /* =========================================================
     SELECTED ORDERS
  ========================================================= */

  const selectedOrders = useMemo(() => {
    if (selectedRange === "today") {
      return Number(
        analytics?.todayCount ?? 0
      );
    }

    if (selectedRange === "7days") {
      return Number(
        analytics?.weekOrderCount ??
          analytics?.rangeCount ??
          0
      );
    }

    return data.reduce(
      (sum, item) =>
        sum + item.orders,
      0
    );
  }, [
    selectedRange,
    analytics,
    data,
  ]);

  /* =========================================================
     ALL TIME
  ========================================================= */

  const allTimeRevenue = Number(
    analytics?.totalRevenue ?? 0
  );

  const allTimeOrders = Number(
    analytics?.totalOrderCount ?? 0
  );

  /* =========================================================
     AVERAGE ORDER VALUE
  ========================================================= */

  const averageOrderValue = useMemo(() => {
    if (selectedRange === "today") {
      return selectedOrders > 0
        ? selectedRevenue /
            selectedOrders
        : 0;
    }

    if (selectedRange === "7days") {
      return Number(
        analytics?.avgOrderValue ??
          0
      );
    }

    return selectedOrders > 0
      ? selectedRevenue /
          selectedOrders
      : 0;
  }, [
    selectedRange,
    selectedRevenue,
    selectedOrders,
    analytics,
  ]);

  /* =========================================================
     PAYMENT CHANNELS
  ========================================================= */

  const digitalOrders = useMemo(() => {
    if (
      selectedRange === "today"
    ) {
      return todayData.reduce(
        (sum, item) =>
          sum + item.digital,
        0
      );
    }

    /*
     * The supplied analytics response exposes
     * digitalOrders / cashOrders as aggregate fields.
     *
     * weeklyData also exposes daily digital/cash values.
     *
     * For the 7-day summary we use the actual daily
     * weeklyData values so the displayed breakdown matches
     * the chart/table dataset.
     */
    return data.reduce(
      (sum, item) =>
        sum + item.digital,
      0
    );
  }, [
    selectedRange,
    todayData,
    data,
  ]);

  const cashOrders = useMemo(() => {
    if (
      selectedRange === "today"
    ) {
      return todayData.reduce(
        (sum, item) =>
          sum + item.cash,
        0
      );
    }

    return data.reduce(
      (sum, item) =>
        sum + item.cash,
      0
    );
  }, [
    selectedRange,
    todayData,
    data,
  ]);

  const digitalShare = useMemo(() => {
    if (
      selectedRange === "7days" &&
      analytics?.digitalPercent != null
    ) {
      return Number(
        analytics.digitalPercent
      );
    }

    if (selectedOrders <= 0) {
      return 0;
    }

    return Math.round(
      (digitalOrders /
        selectedOrders) *
        100
    );
  }, [
    selectedRange,
    analytics,
    selectedOrders,
    digitalOrders,
  ]);

  /* =========================================================
     PEAK SLOT
  ========================================================= */

  const busiestSlot =
    analytics?.peakHour || "—";

  /* =========================================================
     CHART METRICS
  ========================================================= */

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
    peakRevenue > 0
      ? data.find(
          (item) =>
            item.revenue ===
            peakRevenue
        )?.period || "—"
      : "—";

  /* =========================================================
     TOP ITEMS
  ========================================================= */

  const bestSelling = useMemo(() => {
    if (
      !Array.isArray(
        analytics?.topItems
      )
    ) {
      return [];
    }

    return analytics.topItems.map(
      (item, index) => ({
        rank: index + 1,

        name:
          item?.name ||
          "Unknown item",

        sold: Number(
          item?.count ?? 0
        ),
      })
    );
  }, [analytics]);

  /* =========================================================
     CSV EXPORT
  ========================================================= */

  const exportCSV = () => {
    if (!data.length) {
      return;
    }

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
              `"${String(
                value
              ).replaceAll(
                '"',
                '""'
              )}"`
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

  /* =========================================================
     PRINT
  ========================================================= */

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

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={exportCSV}
            disabled={
              loading ||
              !data.length
            }
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#DCD1C6] bg-white px-3 text-[10px] font-bold text-[#574E46] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#FFFDF9] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[#292621] px-3.5 text-[10px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1E1C19] hover:shadow-md"
          >
            <Printer size={13} />

            <span className="hidden sm:inline">
              Print report
            </span>
          </button>

        </div>

      </div>


      {/* =====================================================
          RANGE CONTROL
      ===================================================== */}

      <div className="mb-4 rounded-[13px] border border-[#DED3C7] bg-white p-2 shadow-[0_2px_8px_rgba(50,40,30,0.025)]">

        <div className="flex flex-wrap items-center gap-2">

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
  active={selectedRange === "month"}
  onClick={() => {
    setSelectedRange("month");

    showToast(
      "This month analytics are currently in development. API support is not available yet.",
      "info"
    );
  }}
>
  This month
</FilterButton>

          <FilterButton
  active={selectedRange === "year"}
  onClick={() => {
    setSelectedRange("year");

    showToast(
      "This year analytics are currently in development. API support is not available yet.",
      "info"
    );
  }}
>
  This year
</FilterButton>
<FilterButton
  active={selectedRange === "custom"}
  onClick={() => {
    setSelectedRange("custom");

    showToast(
      "Custom analytics are currently in development. API range support is not available yet.",
      "info"
    );
  }}
>
  <CalendarDays size={12} />
  Custom
</FilterButton>

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

              <span className="text-[9px] font-semibold text-[#A09486]">
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
          API STATUS
      ===================================================== */}

      {loading && (
        <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-[#E4D8CB] bg-white px-3 py-2.5 text-[9px] font-semibold text-[#81766B]">
          <Activity
            size={13}
            className="animate-pulse text-[#B87718]"
          />

          Loading live analytics...
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-[10px] border border-[#F0C9C5] bg-[#FFF2F0] px-3 py-2.5 text-[9px] font-semibold text-[#B84740]">

          <AlertCircle
            size={13}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>

        </div>
      )}


      {/* =====================================================
          KPI STRIP
      ===================================================== */}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">

        <AnalyticsMetric
          icon={CircleDollarSign}
          label="Selected revenue"
          value={
            loading
              ? "—"
              : `₹${selectedRevenue.toLocaleString(
                  "en-IN"
                )}`
          }
          sub={
            loading
              ? "Loading..."
              : `${selectedOrders} orders`
          }
          accent="amber"
        />

        <AnalyticsMetric
          icon={ShoppingBag}
          label="All-time orders"
          value={
            loading
              ? "—"
              : allTimeOrders.toLocaleString(
                  "en-IN"
                )
          }
          sub={
            loading
              ? "Loading..."
              : `₹${allTimeRevenue.toLocaleString(
                  "en-IN"
                )} sales`
          }
          accent="green"
        />

        <AnalyticsMetric
          icon={ReceiptText}
          label="Average order"
          value={
            loading
              ? "—"
              : `₹${Math.round(
                  averageOrderValue
                ).toLocaleString(
                  "en-IN"
                )}`
          }
          sub="Per checkout"
          accent="neutral"
        />

        <AnalyticsMetric
          icon={WalletCards}
          label="Digital share"
          value={
            loading
              ? "—"
              : `${digitalShare}%`
          }
          sub={
            loading
              ? "Loading..."
              : `UPI ${digitalOrders} · Cash ${cashOrders}`
          }
          accent="green"
        />

        <AnalyticsMetric
          icon={Clock3}
          label="Peak slot"
          value={
            loading
              ? "—"
              : busiestSlot
          }
          sub="Highest order volume"
          accent="amber"
          compact
        />

      </div>


      {/* =====================================================
          CHART + BEST SELLERS
      ===================================================== */}

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_300px]">

        {/* REVENUE */}

        <section className="overflow-hidden rounded-[16px] border border-[#DED3C7] bg-white shadow-[0_4px_16px_rgba(54,43,30,0.035)]">

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

          <div className="px-4 pb-4 pt-5">

            <RevenueChart
              data={data}
              maxRevenue={
                maxRevenue
              }
            />

          </div>

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


        {/* BEST SELLERS */}

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

            {bestSelling.length ? (
              bestSelling.map(
                (item, index) => (
                  <BestSellerRow
                    key={`${item.name}-${index}`}
                    item={item}
                    index={index}
                    maxSold={
                      bestSelling[0]?.sold ||
                      1
                    }
                  />
                )
              )
            ) : (
              <div className="px-2.5 py-8 text-center text-[9px] text-[#948B83]">
                No best-selling items available.
              </div>
            )}

          </div>

          <div className="border-t border-white/[0.08] px-4 py-3">

            <div className="flex items-center justify-between">

              <span className="text-[9px] text-[#918980]">
                Top item
              </span>

              <span className="text-[10px] font-bold text-[#F0B348]">
                {bestSelling[0]?.name ||
                  "—"}
              </span>

            </div>

          </div>

        </section>

      </div>


      {/* =====================================================
          INSIGHTS
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
          value={
            busiestSlot
          }
          text="Highest order volume slot currently returned by the analytics API."
          tone="neutral"
        />

      </div>


      {/* =====================================================
          AUDIT TABLE
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
                (item) => {
                  const aov =
                    item.orders > 0
                      ? Math.round(
                          item.revenue /
                            item.orders
                        )
                      : 0;

                  const isPeak =
                    item.revenue ===
                      peakRevenue &&
                    peakRevenue > 0;

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

              {!loading &&
                data.length === 0 && (
                  <tr>

                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-[10px] text-[#94897E]"
                    >
                      No analytics data available.
                    </td>

                  </tr>
                )}

            </tbody>

          </table>

        </div>

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
  {/* TOAST */}

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[9999] flex max-w-[360px] items-center gap-2.5 rounded-[11px] border px-3.5 py-3 shadow-[0_10px_30px_rgba(41,38,33,0.15)] backdrop-blur-sm transition-all ${
            toast.type === "success"
              ? "border-[#BFE3D7] bg-[#F0FAF6] text-[#267A65]"
              : toast.type === "error"
                ? "border-[#F0C9C5] bg-[#FFF2F0] text-[#B84740]"
                : "border-[#E5D5BC] bg-[#FFF9EF] text-[#A96D18]"
          }`}
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              toast.type === "success"
                ? "bg-[#DDF2EB]"
                : toast.type === "error"
                  ? "bg-[#F9DEDA]"
                  : "bg-[#F5E8D3]"
            }`}
          >
            {toast.type === "success" ? (
              <CircleDollarSign size={13} />
            ) : toast.type === "error" ? (
              <AlertCircle size={13} />
            ) : (
              <Activity size={13} />
            )}
          </div>

          <p className="text-[9px] font-bold leading-4">
            {toast.message}
          </p>
        </div>
      )}

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
  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-[10px] text-[#94897E]">
        No revenue data available.
      </div>
    );
  }

  return (
    <div className="relative">

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

                <div className="relative flex h-[175px] w-full max-w-[64px] items-end">

                  {isPeak && (
                    <div className="absolute -top-1 left-1/2 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-[#E6A23C] ring-4 ring-[#E6A23C]/10" />
                  )}

                  <div
                    className={`relative w-full rounded-t-[8px] transition-all duration-300 group-hover:brightness-105 ${
                      isLast
                        ? "bg-[#247A68]"
                        : "bg-[#D8942E]"
                    }`}
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
  maxSold = 1,
}) {
  const top = index === 0;

  return (
    <div
      className={`group flex items-center gap-2.5 rounded-[10px] px-2.5 py-2.5 transition ${
        top
          ? "bg-white/[0.07]"
          : "hover:bg-white/[0.045]"
      }`}
    >

      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold ${
          top
            ? "bg-[#E6A23C] text-[#332511]"
            : "bg-white/[0.07] text-[#AFA69D]"
        }`}
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
            className={
              `h-full rounded-full ${
                top
                  ? "bg-[#E6A23C]"
                  : "bg-[#80776F]"
              }`
            }
            style={{
              width: `${
                maxSold > 0
                  ? Math.min(
                      100,
                      (item.sold /
                        maxSold) *
                        100
                    )
                  : 0
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
      icon:
        "bg-[#F5E8D3] text-[#C57B18]",
      value:
        "text-[#B97012]",
    },

    green: {
      icon:
        "bg-[#E5F3EE] text-[#25836D]",
      value:
        "text-[#267A65]",
    },

    neutral: {
      icon:
        "bg-[#F0EAE3] text-[#6C6258]",
      value:
        "text-[#4B443D]",
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
      className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[9px] font-bold transition-all active:scale-[0.98] ${
        active
          ? "border-[#292621] bg-[#292621] text-white shadow-sm"
          : "border-transparent bg-[#F7F3ED] text-[#655C54] hover:border-[#E0D5C9] hover:bg-white"
      }`}
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
        className="h-8 rounded-lg border border-[#DDD2C6] bg-white pl-7 pr-2 text-[9px] font-semibold text-[#554C44] outline-none transition focus:border-[#D49A48] focus:ring-[3px] focus:ring-[#D49A48]/10"
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