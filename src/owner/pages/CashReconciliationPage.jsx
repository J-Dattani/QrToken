  import {
    useEffect,
    useMemo,
    useState,
  } from "react";

  import { useSelector } from "react-redux";

  import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    Banknote,
    Calculator,
    Check,
    CheckCircle2,
    CircleDollarSign,
    ClipboardCheck,
    FileText,
    IndianRupee,
    Printer,
    Scale,
    Sparkles,
    WalletCards,
  } from "lucide-react";

  import {
    Button,
    Chip,
    Tooltip,
  } from "@mui/material";

  import { apiRequest } from "../api/client";


  /* ============================================================
    CONSTANTS
  ============================================================ */

  const denominations = [
    {
      value: 500,
      label: "₹500",
      note: "Notes",
    },
    {
      value: 200,
      label: "₹200",
      note: "Notes",
    },
    {
      value: 100,
      label: "₹100",
      note: "Notes",
    },
    {
      value: 50,
      label: "₹50",
      note: "Notes",
    },
    {
      value: 20,
      label: "₹20",
      note: "Notes",
    },
    {
      value: 10,
      label: "₹10",
      note: "Notes",
    },
  ];


  const formatINR = (value) =>
    `₹${Number(value || 0).toLocaleString(
      "en-IN"
    )}`;


  /* ============================================================
    HELPERS
  ============================================================ */

  const getTodayKey = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  const isToday = (dateValue) => {
    if (!dateValue) {
      return false;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}` ===
      getTodayKey();
  };


  const getOrderTotal = (order) => {
    const total = Number(
      order?.total
    );

    if (
      Number.isFinite(total)
    ) {
      return total;
    }

    const subtotal = Number(
      order?.subtotal
    );

    return Number.isFinite(subtotal)
      ? subtotal
      : 0;
  };


  const getPayMode = (order) =>
    String(
      order?.payMode ||
        order?.paymentMethod ||
        order?.paymentMode ||
        ""
    )
      .trim()
      .toLowerCase();


  const isCounterPOSOrder = (order) => {
    const source = String(
      order?.source ||
        order?.orderSource ||
        order?.channel ||
        order?.orderChannel ||
        order?.origin ||
        ""
    )
      .trim()
      .toLowerCase();

    if (!source) {
      return false;
    }

    return (
      source.includes("manual") ||
      source.includes("counter") ||
      source.includes("pos")
    );
  };


  /* ============================================================
    PAGE
  ============================================================ */

  function CashReconciliationPage() {

    const merchant = useSelector(
      (state) =>
        state.merchant?.merchant
    );

    const merchantId =
      merchant?._id ||
      merchant?.id ||
      "";


    /* ==========================================================
      ORDER DATA
    ========================================================== */

    const [
      orders,
      setOrders,
    ] = useState([]);

    const [
      ordersLoading,
      setOrdersLoading,
    ] = useState(true);

    const [
      ordersError,
      setOrdersError,
    ] = useState("");


    /* ==========================================================
      LOAD TODAY'S ORDERS
    ========================================================== */

    useEffect(() => {

      let cancelled = false;


      const loadOrders = async () => {

        if (!merchantId) {
          setOrders([]);
          setOrdersLoading(false);
          return;
        }


        setOrdersLoading(true);
        setOrdersError("");


        try {

          const response =
            await apiRequest(
              `/orders/merchant/${merchantId}`,
              {
                method: "GET",
              }
            );


          if (cancelled) {
            return;
          }


          console.log(
            "CASH RECONCILIATION ORDERS:",
            response
          );


          let rawOrders = [];


          if (
            Array.isArray(response)
          ) {
            rawOrders = response;

          } else if (
            Array.isArray(
              response?.orders
            )
          ) {
            rawOrders =
              response.orders;

          } else if (
            Array.isArray(
              response?.data
            )
          ) {
            rawOrders =
              response.data;

          } else if (
            Array.isArray(
              response?.data?.orders
            )
          ) {
            rawOrders =
              response.data.orders;
          }


          setOrders(rawOrders);

        } catch (error) {

          if (cancelled) {
            return;
          }


          console.error(
            "Failed to load reconciliation orders:",
            error
          );


          setOrders([]);
          setOrdersError(
            error?.message ||
              "Unable to load today's orders."
          );

        } finally {

          if (!cancelled) {
            setOrdersLoading(false);
          }

        }

      };


      loadOrders();


      return () => {
        cancelled = true;
      };

    }, [merchantId]);


    /* ==========================================================
      TODAY'S ORDERS
    ========================================================== */

    const todayOrders = useMemo(() => {

      return orders.filter(
        (order) =>
          isToday(
            order?.createdAt
          )
      );

    }, [orders]);


    /* ==========================================================
      RECONCILIATION TOTALS
    ========================================================== */

    const reconciliation = useMemo(() => {

      let digitalProcessed = 0;

      let appCash = 0;

      let counterPOS = 0;


      todayOrders.forEach(
        (order) => {

          const total =
            getOrderTotal(order);

          const payMode =
            getPayMode(order);


        if (payMode === "cash") {
    const paymentStatus = String(
      order?.paymentStatus || ""
    ).toLowerCase();

    if (paymentStatus !== "paid") {
      return;
    }

    if (isCounterPOSOrder(order)) {
      counterPOS += total;
    } else {
      appCash += total;
    }
  } else {

            digitalProcessed +=
              total;

          }

        }
      );


      const expectedCash =
        appCash + counterPOS;


      return {
        digitalProcessed,
        appCash,
        counterPOS,
        expectedCash,
      };

    }, [todayOrders]);


    const EXPECTED_CASH =
      reconciliation.expectedCash;


    /* ==========================================================
      PHYSICAL CASH
    ========================================================== */

    const [
      inputMode,
      setInputMode,
    ] = useState("direct");


    const [
      directCash,
      setDirectCash,
    ] = useState("");


    const [
      noteCounts,
      setNoteCounts,
    ] = useState({
      500: "",
      200: "",
      100: "",
      50: "",
      20: "",
      10: "",
    });


    const physicalCash =
      useMemo(() => {

        if (
          inputMode === "direct"
        ) {

          return (
            Number(directCash) || 0
          );

        }


        return denominations.reduce(
          (
            total,
            note
          ) => {

            const count =
              Number(
                noteCounts[
                  note.value
                ]
              ) || 0;


            return (
              total +
              note.value *
                count
            );

          },
          0
        );

      }, [
        inputMode,
        directCash,
        noteCounts,
      ]);


    /* ==========================================================
      VARIANCE
    ========================================================== */

    const discrepancy =
      physicalCash -
      EXPECTED_CASH;


    const absoluteDifference =
      Math.abs(
        discrepancy
      );


    const balancePercentage =
      EXPECTED_CASH > 0
        ? Math.min(
            100,
            Math.round(
              (physicalCash /
                EXPECTED_CASH) *
                100
            )
          )
        : 0;


    const status =
      discrepancy === 0
        ? "balanced"
        : discrepancy > 0
        ? "excess"
        : "short";


    /* ==========================================================
      NOTE COUNT
    ========================================================== */

    const totalNotes =
      useMemo(() => {

        return denominations.reduce(
          (
            total,
            note
          ) =>
            total +
            (
              Number(
                noteCounts[
                  note.value
                ]
              ) || 0
            ),
          0
        );

      }, [noteCounts]);


    const updateNoteCount = (
      value,
      count
    ) => {

      setNoteCounts(
        (current) => ({
          ...current,
          [value]: count,
        })
      );

    };


    /* ==========================================================
      ACTIONS
    ========================================================== */

    const printReport = () => {
      window.print();
    };


    const clearInput = () => {

      setDirectCash("");

      setNoteCounts({
        500: "",
        200: "",
        100: "",
        50: "",
        20: "",
        10: "",
      });

    };


    /* ============================================================
      RENDER
    ============================================================ */

    return (

      <section className="min-h-full bg-[#F7F3ED] px-5 py-5 lg:px-7">


        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-5 flex items-center justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#282521] text-[#E6A23C] shadow-sm">

              <Scale
                size={18}
                strokeWidth={2}
              />

            </div>


            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h1 className="truncate text-[20px] font-semibold tracking-[-0.03em] text-[#241F1A]">
                  Cash Reconciliation
                </h1>


                <Chip
                  icon={
                    <ClipboardCheck
                      size={11}
                    />
                  }
                  label="EOD AUDIT"
                  size="small"
                  sx={{
                    height: 19,
                    borderRadius: "6px",
                    background:
                      "#EAF5F1",
                    color:
                      "#287A66",
                    fontSize: "8px",
                    fontWeight: 800,
                    letterSpacing:
                      "0.08em",
                    "& .MuiChip-label": {
                      px: 0.8,
                    },
                    "& .MuiChip-icon": {
                      color:
                        "#287A66",
                      ml: 0.6,
                    },
                  }}
                />

              </div>


              <p className="mt-0.5 truncate text-[11px] text-[#8A7E71]">
                Verify drawer cash against the expected register balance.
              </p>

            </div>

          </div>


          {/* Header actions */}

          <div className="flex shrink-0 items-center gap-1.5">

            <Tooltip title="Clear physical cash input">

              <Button
                variant="text"
                onClick={clearInput}
                sx={{
                  minWidth: 0,
                  height: 34,
                  px: 1.3,
                  borderRadius: "9px",
                  textTransform:
                    "none",
                  fontSize: "10px",
                  fontWeight: 700,
                  color:
                    "#766B5F",
                }}
              >
                Clear
              </Button>

            </Tooltip>


            <Button
              variant="contained"
              startIcon={
                <Printer size={13} />
              }
              onClick={printReport}
              sx={{
                height: 34,
                px: 1.5,
                borderRadius: "9px",
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
              Print report
            </Button>

          </div>

        </div>


        {/* ======================================================
            ERROR
        ====================================================== */}

        {ordersError && (

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#E8C0BD] bg-[#FFF1F0] px-3.5 py-2.5 text-[10px] font-semibold text-[#B44842]">

            <AlertCircle
              size={13}
            />

            <span>
              {ordersError}
            </span>

          </div>

        )}


        {/* ======================================================
            AUDIT SNAPSHOT
        ====================================================== */}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">

          <SnapshotCard
            icon={WalletCards}
            label="Expected drawer"
            value={
              ordersLoading
                ? "..."
                : formatINR(
                    reconciliation.expectedCash
                  )
            }
            detail="Register target"
          />


          <SnapshotCard
            icon={CircleDollarSign}
            label="Digital processed"
            value={
              ordersLoading
                ? "..."
                : formatINR(
                    reconciliation.digitalProcessed
                  )
            }
            detail="UPI / Cards"
            tone="green"
          />


          <SnapshotCard
            icon={Banknote}
            label="App cash"
            value={
              ordersLoading
                ? "..."
                : formatINR(
                    reconciliation.appCash
                  )
            }
            detail="Collected orders"
            tone="amber"
          />


        

        </div>


        {/* ======================================================
            MAIN WORKSPACE
        ====================================================== */}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_245px]">


          {/* ====================================================
              LEFT
          ==================================================== */}

          <main className="min-w-0 overflow-hidden rounded-xl border border-[#DED3C5] bg-white shadow-sm">


            {/* Workspace heading */}

            <div className="border-b border-[#E9E0D5] px-4 py-3.5">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-[13px] font-bold text-[#302A24]">
                      Physical cash count
                    </h2>

                    <span className="rounded-full bg-[#F0EBE3] px-2 py-0.5 text-[8px] font-bold text-[#8C8174]">
                      REQUIRED
                    </span>

                  </div>

                  <p className="mt-0.5 text-[10px] text-[#978B7E]">
                    Enter the amount currently inside the cash drawer.
                  </p>

                </div>


                <AuditStatus
                  status={status}
                />

              </div>

            </div>


            {/* ==================================================
                MODE SWITCHER
            ================================================== */}

            <div className="px-4 pt-4">

              <div className="inline-flex rounded-lg border border-[#DED3C5] bg-[#F7F3ED] p-1">

                <ModeButton
                  active={
                    inputMode === "direct"
                  }
                  icon={IndianRupee}
                  label="Direct total"
                  onClick={() =>
                    setInputMode(
                      "direct"
                    )
                  }
                />


                <ModeButton
                  active={
                    inputMode === "notes"
                  }
                  icon={Calculator}
                  label="Count notes"
                  onClick={() =>
                    setInputMode(
                      "notes"
                    )
                  }
                />

              </div>

            </div>


            {/* ==================================================
                DIRECT INPUT
            ================================================== */}

            {inputMode === "direct" && (

              <div className="px-4 py-5">

                <div className="relative overflow-hidden rounded-[15px] border border-[#E1D7C9] bg-[#FCFAF6] p-4">

                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#E6A23C]/10 blur-2xl" />

                  <div className="relative">

                    <div className="mb-3 flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEE8DF] text-[#776C60]">

                        <Banknote
                          size={14}
                        />

                      </div>


                      <div>

                        <p className="text-[11px] font-bold text-[#403931]">
                          Drawer total
                        </p>

                        <p className="text-[9px] text-[#9A8E81]">
                          Count all physical cash before submitting.
                        </p>

                      </div>

                    </div>


                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px]">

                      <div>

                        <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.11em] text-[#93877A]">
                          Physical cash
                        </label>


                        <div className="relative">

                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] font-bold text-[#9B8F81]">
                            ₹
                          </span>


                          <input
                            type="number"
                            min="0"
                            value={
                              directCash
                            }
                            onChange={(
                              event
                            ) =>
                              setDirectCash(
                                event
                                  .target
                                  .value
                              )
                            }
                            placeholder="0"
                            className="
                              h-[54px]
                              w-full
                              rounded-xl
                              border
                              border-[#D9CEC0]
                              bg-white
                              pl-9
                              pr-4
                              text-[23px]
                              font-bold
                              tracking-[-0.04em]
                              text-[#29241F]
                              outline-none
                              transition
                              placeholder:text-[#C6BDB2]
                              hover:border-[#CFC2B4]
                              focus:border-[#C57B20]
                              focus:ring-4
                              focus:ring-[#C57B20]/10
                            "
                          />

                        </div>

                      </div>


                      <div className="flex h-[54px] items-center justify-between self-end rounded-xl border border-[#E0D6C9] bg-[#F3EEE7] px-3.5">

                        <div>

                          <p className="text-[8px] font-bold uppercase tracking-[0.11em] text-[#94887B]">
                            Expected
                          </p>

                          <p className="mt-0.5 text-[15px] font-bold text-[#3B342D]">
                            {ordersLoading
                              ? "..."
                              : formatINR(
                                  EXPECTED_CASH
                                )}
                          </p>

                        </div>


                        <Scale
                          size={16}
                          className="text-[#C17A20]"
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            )}


            {/* ==================================================
                NOTE COUNTER
            ================================================== */}

            {inputMode === "notes" && (

              <div className="px-4 py-4">

                <div className="rounded-[15px] border border-[#E1D6C8] bg-[#F6F1E9] p-4">

                  <div className="mb-3 flex items-center justify-between gap-3">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#282521] text-[#E6A23C]">

                        <Calculator
                          size={14}
                        />

                      </div>


                      <div>

                        <p className="text-[11px] font-bold text-[#342E28]">
                          Denomination counter
                        </p>

                        <p className="text-[9px] text-[#95897A]">
                          Count notes by value.
                        </p>

                      </div>

                    </div>


                    <div className="rounded-full bg-white px-2.5 py-1.5 text-[9px] font-bold text-[#756A5D] shadow-sm">
                      {totalNotes} notes
                    </div>

                  </div>


                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">

                    {denominations.map(
                      (note) => {

                        const count =
                          Number(
                            noteCounts[
                              note.value
                            ]
                          ) || 0;

                        const subtotal =
                          note.value *
                          count;


                        return (

                          <DenominationCard
                            key={
                              note.value
                            }
                            note={
                              note
                            }
                            count={
                              noteCounts[
                                note.value
                              ]
                            }
                            subtotal={
                              subtotal
                            }
                            onChange={(
                              value
                            ) =>
                              updateNoteCount(
                                note.value,
                                value
                              )
                            }
                          />

                        );

                      }
                    )}

                  </div>


                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#DED4C7] bg-white px-3.5 py-2.5">

                    <div className="flex items-center gap-2">

                      <CircleDollarSign
                        size={13}
                        className="text-[#C47B20]"
                      />

                      <span className="text-[9px] font-semibold text-[#73685C]">
                        Calculated physical cash
                      </span>

                    </div>


                    <span className="font-mono text-[15px] font-bold text-[#287D68]">
                      {formatINR(
                        physicalCash
                      )}
                    </span>

                  </div>

                </div>

              </div>

            )}


            {/* ==================================================
                VARIANCE
            ================================================== */}

            <div className="px-4 pb-4">

              <div
                className={`overflow-hidden rounded-[15px] border ${
                  status ===
                  "balanced"
                    ? "border-[#BDE1D4]"
                    : status ===
                      "excess"
                    ? "border-[#E8CEA1]"
                    : "border-[#E8C0BD]"
                }`}
              >

                <div
                  className={`px-4 py-3 ${
                    status ===
                    "balanced"
                      ? "bg-[#EEF8F4]"
                      : status ===
                        "excess"
                      ? "bg-[#FFF7E8]"
                      : "bg-[#FFF1F0]"
                  }`}
                >

                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <div className="flex items-center gap-2.5">

                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          status ===
                          "balanced"
                            ? "bg-[#D9EFE7] text-[#287D68]"
                            : status ===
                              "excess"
                            ? "bg-[#FBE8C4] text-[#BD760F]"
                            : "bg-[#F7DAD8] text-[#B94D46]"
                        }`}
                      >

                        {status ===
                        "balanced" ? (
                          <Check
                            size={15}
                          />
                        ) : status ===
                          "excess" ? (
                          <ArrowUp
                            size={15}
                          />
                        ) : (
                          <ArrowDown
                            size={15}
                          />
                        )}

                      </div>


                      <div>

                        <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#8A7E71]">
                          Variance
                        </p>


                        <p
                          className={`text-[17px] font-bold tracking-[-0.03em] ${
                            status ===
                            "balanced"
                              ? "text-[#277C67]"
                              : status ===
                                "excess"
                              ? "text-[#B9700C]"
                              : "text-[#B44842]"
                          }`}
                        >
                          {discrepancy ===
                          0
                            ? "₹0"
                            : discrepancy >
                              0
                            ? `+${formatINR(
                                absoluteDifference
                              )}`
                            : `-${formatINR(
                                absoluteDifference
                              )}`}
                        </p>

                      </div>

                    </div>


                    <div className="text-right">

                      <p className="text-[8px] font-semibold text-[#968A7D]">
                        {status ===
                        "balanced"
                          ? "Perfect match"
                          : status ===
                            "excess"
                          ? "More cash than expected"
                          : "Less cash than expected"}
                      </p>


                      <p
                        className={`mt-0.5 text-[10px] font-bold ${
                          status ===
                          "balanced"
                            ? "text-[#277C67]"
                            : status ===
                              "excess"
                            ? "text-[#B9700C]"
                            : "text-[#B44842]"
                        }`}
                      >
                        {status ===
                        "balanced"
                          ? "Drawer is balanced"
                          : status ===
                            "excess"
                          ? "Review excess before closing"
                          : "Review short cash before closing"}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Comparison */}

                <div className="bg-white px-4 py-3">

                  <div className="mb-1.5 flex items-center justify-between">

                    <span className="text-[8px] font-bold uppercase tracking-[0.11em] text-[#9A8E80]">
                      Physical vs expected
                    </span>


                    <span className="font-mono text-[9px] font-bold text-[#84786C]">
                      {balancePercentage}%
                    </span>

                  </div>


                  <div className="h-2 overflow-hidden rounded-full bg-[#EEE9E1]">

                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        status ===
                        "balanced"
                          ? "bg-[#2B9B7C]"
                          : status ===
                            "excess"
                          ? "bg-[#D8942B]"
                          : "bg-[#C85A52]"
                      }`}
                      style={{
                        width: `${balancePercentage}%`,
                      }}
                    />

                  </div>


                  <div className="mt-1.5 flex justify-between text-[8px] text-[#A0968A]">

                    <span>
                      Physical{" "}
                      {formatINR(
                        physicalCash
                      )}
                    </span>


                    <span>
                      Target{" "}
                      {formatINR(
                        EXPECTED_CASH
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="border-t border-[#E9E0D5] bg-[#FBF8F3] px-4 py-3">

              <div className="flex items-center gap-2">

                <Sparkles
                  size={12}
                  className="shrink-0 text-[#C17A20]"
                />


                <p className="text-[9px] leading-4 text-[#8D8275]">
                  Reconciliation compares physical drawer cash against the expected register amount.
                </p>


                <span className="ml-auto hidden shrink-0 rounded-full border border-[#DED4C7] bg-white px-2 py-1 font-mono text-[8px] text-[#8D8275] sm:block">
                  AUDIT READY
                </span>

              </div>

            </div>

          </main>


          {/* ====================================================
              RIGHT — CASH POSITION
          ==================================================== */}

          <aside className="h-fit overflow-hidden rounded-xl bg-[#292622] text-white shadow-[0_10px_28px_rgba(37,31,24,0.15)]">


            {/* Header */}

            <div className="border-b border-white/[0.08] px-4 py-3.5">

              <div className="flex items-center gap-2.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6A23C] text-[#2B2115]">

                  <WalletCards
                    size={15}
                  />

                </div>


                <div>

                  <p className="text-[12px] font-bold">
                    Cash position
                  </p>

                  <p className="text-[9px] text-[#8E877F]">
                    Reconciliation cockpit
                  </p>

                </div>

              </div>

            </div>


            {/* Expected */}

            <div className="px-4 pt-4">

              <div className="rounded-[15px] border border-white/[0.09] bg-white/[0.035] p-4">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#948A80]">
                      Expected cash
                    </p>


                    <p className="mt-1 text-[29px] font-bold tracking-[-0.055em] text-[#F0B44F]">
                      {ordersLoading
                        ? "..."
                        : formatINR(
                            EXPECTED_CASH
                          )}
                    </p>

                  </div>


                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6A23C]/10 text-[#E6A23C]">

                    <Scale
                      size={14}
                    />

                  </div>

                </div>


                <div className="mt-3 flex items-center gap-1.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#E6A23C]" />

                  <span className="text-[8px] text-[#928980]">
                    Register target
                  </span>

                </div>

              </div>

            </div>


            {/* Position rows */}

            <div className="px-4 py-3.5">

              <PositionRow
                label="Physical cash"
                value={formatINR(
                  physicalCash
                )}
                icon={Banknote}
                highlight
              />


              <PositionRow
                label="Expected"
                value={
                  ordersLoading
                    ? "..."
                    : formatINR(
                        EXPECTED_CASH
                      )
                }
                icon={
                  CircleDollarSign
                }
              />


              <PositionRow
                label="Variance"
                value={
                  discrepancy ===
                  0
                    ? "₹0"
                    : discrepancy >
                      0
                    ? `+${formatINR(
                        discrepancy
                      )}`
                    : `-${formatINR(
                        Math.abs(
                          discrepancy
                        )
                      )}`
                }
                icon={
                  discrepancy ===
                  0
                    ? CheckCircle2
                    : AlertCircle
                }
                tone={status}
              />

            </div>


            {/* Audit state */}

            <div className="border-t border-white/[0.08] px-4 py-4">

              <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.14em] text-[#837B73]">
                Audit state
              </p>


              <div
                className={`rounded-[12px] border p-3 ${
                  status ===
                  "balanced"
                    ? "border-[#2B7665]/40 bg-[#1F493F]"
                    : status ===
                      "excess"
                    ? "border-[#8D682F]/40 bg-[#493922]"
                    : "border-[#824945]/40 bg-[#492F2D]"
                }`}
              >

                <div className="flex items-center gap-2">

                  {status ===
                  "balanced" ? (
                    <CheckCircle2
                      size={16}
                      className="text-[#55B99B]"
                    />
                  ) : (
                    <AlertCircle
                      size={16}
                      className={
                        status ===
                        "excess"
                          ? "text-[#E1A84F]"
                          : "text-[#DD7770]"
                      }
                    />
                  )}


                  <div>

                    <p
                      className={`text-[10px] font-bold ${
                        status ===
                        "balanced"
                          ? "text-[#65C5A8]"
                          : status ===
                            "excess"
                          ? "text-[#E5B45C]"
                          : "text-[#E07D76]"
                      }`}
                    >
                      {status ===
                      "balanced"
                        ? "Balanced"
                        : status ===
                          "excess"
                        ? "Excess cash"
                        : "Short cash"}
                    </p>


                    <p className="mt-0.5 text-[8px] text-[#9E968E]">
                      {status ===
                      "balanced"
                        ? "Physical and expected amounts match."
                        : status ===
                          "excess"
                        ? "Physical drawer exceeds target."
                        : "Physical drawer is below target."}
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Quick numbers */}

            <div className="border-t border-white/[0.08] px-4 py-3.5">

              <PositionMini
                label="Digital"
                value={
                  ordersLoading
                    ? "..."
                    : formatINR(
                        reconciliation.digitalProcessed
                      )
                }
              />


              <PositionMini
                label="App cash"
                value={
                  ordersLoading
                    ? "..."
                    : formatINR(
                        reconciliation.appCash
                      )
                }
              />



            </div>


            {/* Bottom */}

            <div className="border-t border-white/[0.08] bg-white/[0.025] px-4 py-3">

              <div className="flex items-center gap-2">

                <FileText
                  size={11}
                  className="text-[#9C948B]"
                />


                <p className="text-[9px] leading-4 text-[#817A72]">
                  Print the EOD report after resolving any variance.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </section>

    );
  }


  /* ============================================================
    SNAPSHOT CARD
  ============================================================ */

  function SnapshotCard({
    icon: Icon,
    label,
    value,
    detail,
    tone = "default",
  }) {

    const styles = {

      default: {
        icon:
          "bg-[#EEE9E1] text-[#756A5E]",
        value:
          "text-[#302A24]",
      },

      green: {
        icon:
          "bg-[#E3F3EC] text-[#267C67]",
        value:
          "text-[#267C67]",
      },

      amber: {
        icon:
          "bg-[#FFF0D2] text-[#BF770E]",
        value:
          "text-[#BF770E]",
      },

    };


    const current =
      styles[tone] ||
      styles.default;


    return (

      <div className="rounded-xl border border-[#DED3C5] bg-white px-3.5 py-3 shadow-sm">

        <div className="flex items-center gap-2.5">

          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${current.icon}`}
          >

            <Icon size={14} />

          </div>


          <div className="min-w-0">

            <p className="text-[9px] font-bold uppercase tracking-[0.11em] text-[#95897B]">
              {label}
            </p>


            <div className="mt-0.5 flex items-baseline gap-1.5">

              <p
                className={`text-[17px] font-bold tracking-[-0.03em] ${current.value}`}
              >
                {value}
              </p>


              <span className="truncate text-[9px] text-[#A09689]">
                {detail}
              </span>

            </div>

          </div>

        </div>

      </div>

    );
  }


  /* ============================================================
    AUDIT STATUS
  ============================================================ */

  function AuditStatus({
    status,
  }) {

    const config = {

      balanced: {
        classes:
          "bg-[#E5F4ED] text-[#277D67]",
        icon:
          CheckCircle2,
        label:
          "Drawer balanced",
      },

      excess: {
        classes:
          "bg-[#FFF0D4] text-[#B8730E]",
        icon:
          AlertCircle,
        label:
          "Excess detected",
      },

      short: {
        classes:
          "bg-[#FBE3E1] text-[#B64B45]",
        icon:
          AlertCircle,
        label:
          "Short cash detected",
      },

    };


    const current =
      config[status];


    const Icon =
      current.icon;


    return (

      <div
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[8px] font-bold ${current.classes}`}
      >

        <Icon size={11} />

        {current.label}

      </div>

    );
  }


  /* ============================================================
    MODE BUTTON
  ============================================================ */

  function ModeButton({
    active,
    icon: Icon,
    label,
    onClick,
  }) {

    return (

      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-[10px] font-bold transition ${
          active
            ? "bg-white text-[#2D2822] shadow-sm"
            : "text-[#81766A] hover:text-[#3A342D]"
        }`}
      >

        <Icon size={12} />

        {label}

      </button>

    );
  }


  /* ============================================================
    DENOMINATION CARD
  ============================================================ */

  function DenominationCard({
    note,
    count,
    subtotal,
    onChange,
  }) {

    return (

      <div className="rounded-xl border border-[#DDD3C5] bg-white p-2.5 transition hover:-translate-y-0.5 hover:border-[#CDBDA8] hover:shadow-sm">

        <div className="mb-1.5 flex items-center justify-between">

          <span className="text-[11px] font-bold text-[#373029]">
            {note.label}
          </span>


          <Banknote
            size={11}
            className="text-[#A09487]"
          />

        </div>


        <input
          type="number"
          min="0"
          value={count}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder="0"
          className="
            h-8
            w-full
            rounded-lg
            border
            border-[#DED4C7]
            bg-[#FBF9F5]
            px-2
            text-center
            text-[11px]
            font-bold
            text-[#302A24]
            outline-none
            transition
            placeholder:text-[#C1B8AE]
            focus:border-[#C57B20]
            focus:bg-white
            focus:ring-2
            focus:ring-[#C57B20]/10
          "
        />


        <div className="mt-1.5 flex items-center justify-between">

          <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-[#A09588]">
            Total
          </span>


          <span className="font-mono text-[9px] font-bold text-[#287D68]">
            {formatINR(
              subtotal
            )}
          </span>

        </div>

      </div>

    );
  }


  /* ============================================================
    POSITION ROW
  ============================================================ */

  function PositionRow({
    label,
    value,
    icon: Icon,
    highlight,
    tone,
  }) {

    const valueColor =
      tone === "balanced"
        ? "text-[#59B99D]"
        : tone === "excess"
        ? "text-[#E1A84F]"
        : tone === "short"
        ? "text-[#DD7770]"
        : highlight
        ? "text-[#F0B44F]"
        : "text-[#E5DED5]";


    return (

      <div className="flex items-center gap-2.5 border-b border-white/[0.07] py-2.5 last:border-0">

        <Icon
          size={12}
          className={
            highlight
              ? "text-[#E6A23C]"
              : "text-[#777069]"
          }
        />


        <span className="text-[10px] text-[#A39B92]">
          {label}
        </span>


        <span
          className={`ml-auto text-[11px] font-bold ${valueColor}`}
        >
          {value}
        </span>

      </div>

    );
  }


  /* ============================================================
    POSITION MINI
  ============================================================ */

  function PositionMini({
    label,
    value,
  }) {

    return (

      <div className="flex items-center justify-between border-b border-white/[0.06] py-2 last:border-0">

        <span className="text-[9px] text-[#858079]">
          {label}
        </span>


        <span className="font-mono text-[9px] font-bold text-[#D8D1C8]">
          {value}
        </span>

      </div>

    );
  }


  export default CashReconciliationPage;