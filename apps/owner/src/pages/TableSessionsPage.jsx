import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../api/client";

import {
  Plus,
  Grid2X2,
  List,
  QrCode,
  Pencil,
  Trash2,
  X,
  Receipt,
  Armchair,
  ArrowUpRight,
  Check,
  MoreHorizontal,
  Utensils,
  Banknote,
  LayoutGrid,
  RefreshCw,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

/* ============================================================
   LEGACY DISPLAY META
   ------------------------------------------------------------
   The current table API does not return seats/section.
   We preserve your existing UI values where they already exist.
   Backend occupancy/order data remains authoritative.
============================================================ */

const legacyTableMeta = {
  1: {
    seats: 4,
    section: "Indoor Main",
  },
  2: {
    seats: 2,
    section: "Indoor Main",
  },
  3: {
    seats: 4,
    section: "Indoor Main",
  },
  4: {
    seats: 2,
    section: "Indoor Main",
  },
  5: {
    seats: 4,
    section: "Indoor Main",
  },
  6: {
    seats: 2,
    section: "Indoor Main",
  },
  7: {
    seats: 4,
    section: "Outdoor Terrace",
  },
  8: {
    seats: 2,
    section: "Outdoor Terrace",
  },
  9: {
    seats: 4,
    section: "Outdoor Terrace",
  },
  10: {
    seats: 2,
    section: "Outdoor Terrace",
  },
};

/*
 * IMPORTANT:
 * The GET response you supplied confirms the table/session API.
 *
 * The close URL is:
 * /orders/tables/close/:merchantId/:tableId
 *
 * If your mentor's curl specifies PUT instead of POST,
 * change only this constant.
 */
const CLOSE_TABLE_METHOD = "POST";

/* ============================================================
   HELPERS
============================================================ */

function getErrorMessage(error, fallback) {
  return (
    error?.message ||
    error?.response?.message ||
    error?.data?.message ||
    fallback
  );
}

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function calculateDuration(startedAt) {
  if (!startedAt) return "";

  const start = new Date(startedAt);

  if (Number.isNaN(start.getTime())) {
    return "";
  }

  const diffMs = Math.max(0, Date.now() - start.getTime());
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} mins`;
  }

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return minutes
    ? `${hours}h ${minutes}m`
    : `${hours}h`;
}

/* ============================================================
   NORMALIZE LIVE API RESPONSE
============================================================ */

function normalizeTables(response) {
  let rawTables = [];

  if (Array.isArray(response)) {
    rawTables = response;
  } else if (Array.isArray(response?.tables)) {
    rawTables = response.tables;
  } else if (Array.isArray(response?.data)) {
    rawTables = response.data;
  } else if (Array.isArray(response?.data?.tables)) {
    rawTables = response.data.tables;
  }

  return rawTables
    .map((table, index) => {
      const numericId = Number(table?.tableId);

      const fallbackMeta =
        legacyTableMeta[numericId] || {};

      const orders = Array.isArray(table?.orders)
        ? table.orders
        : [];

      const firstOrder = orders[0] || null;

      /*
       * Keep the existing Floor Board data shape so the
       * existing JSX/design does not need to be rebuilt.
       */
      return {
        id: Number.isFinite(numericId)
          ? numericId
          : index + 1,

        name:
          table?.tableName ||
          `Table ${numericId || index + 1}`,

        seats:
          table?.seats ??
          fallbackMeta.seats ??
          4,

        section:
          table?.section ||
          fallbackMeta.section ||
          "Indoor Main",

        /* BACKEND SOURCE OF TRUTH */
        isOccupied: Boolean(table?.isOccupied),

        /*
         * Keep status because your existing design uses it.
         * It is DERIVED from backend fields.
         */
        status: !table?.isOccupied
          ? "Available"
          : table?.hasCashPending
          ? "Cash Pending"
          : "Occupied",

        ordersCount: Number(
          table?.ordersCount || 0
        ),

        totalBill: Number(
          table?.totalBill || 0
        ),

        hasCashPending: Boolean(
          table?.hasCashPending
        ),

        orders,

        sessionStartedAt:
          table?.sessionStartedAt || null,

        /*
         * Existing card expects these fields.
         */
        token:
          firstOrder?.tokenNumber ||
          undefined,

        bill:
          Number(table?.totalBill || 0) ||
          undefined,

        duration:
          calculateDuration(
            table?.sessionStartedAt
          ) || undefined,

        /*
         * Flatten all current-session order items.
         * Table 3, for example, has TWO orders in the
         * supplied response.
         */
        items: orders.flatMap(
          (order) =>
            Array.isArray(order?.items)
              ? order.items
              : []
        ),
      };
    })
    .sort((a, b) => a.id - b.id);
}

/* ============================================================
   TOAST
============================================================ */

function Toast({
  toast,
  onClose,
}) {
  if (!toast.open) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-[min(360px,calc(100vw-2rem))]">
      <div
        className={`flex items-start gap-3 rounded-[12px] border px-3.5 py-3 shadow-[0_12px_32px_rgba(41,37,31,0.18)] ${
          toast.type === "error"
            ? "border-[#E7C5C0] bg-[#FFF8F7] text-[#8E3D34]"
            : "border-[#C9E2D8] bg-[#F5FCF9] text-[#287A66]"
        }`}
      >
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            toast.type === "error"
              ? "bg-[#F6E1DE]"
              : "bg-[#DDF1E9]"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={15} />
          ) : (
            <CheckCircle2 size={15} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold">
            {toast.type === "error"
              ? "Action failed"
              : "Success"}
          </p>

          <p className="mt-0.5 text-[10px] leading-4 opacity-80">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 opacity-50 hover:bg-black/5 hover:opacity-100"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

function TableSessionsPage() {
  const merchant = useSelector(
    (state) => state.merchant?.merchant
  );

  const merchantId =
    merchant?._id ||
    merchant?.id ||
    "";

  const [tables, setTables] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [view, setView] =
    useState("grid");

  const [section, setSection] =
    useState("All");

  const [status, setStatus] =
    useState("All Tables");

  const [modal, setModal] =
    useState(null);

  const [selectedTable, setSelectedTable] =
    useState(null);

  const [newTable, setNewTable] =
    useState({
      name: "",
      seats: "4",
      section: "Indoor Main",
    });

  const [closingTableId, setClosingTableId] =
    useState(null);

  const [toast, setToast] =
    useState({
      open: false,
      type: "success",
      message: "",
    });

  const toastTimerRef =
    useRef(null);

  /* ==========================================================
     TOAST
  ========================================================== */

  const showToast = useCallback(
    (
      message,
      type = "success"
    ) => {
      if (toastTimerRef.current) {
        window.clearTimeout(
          toastTimerRef.current
        );
      }

      setToast({
        open: true,
        type,
        message,
      });

      toastTimerRef.current =
        window.setTimeout(() => {
          setToast({
            open: false,
            type: "success",
            message: "",
          });
        }, 3000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(
          toastTimerRef.current
        );
      }
    };
  }, []);

  /* ==========================================================
     LOAD LIVE TABLES
  ========================================================== */

  const loadTables = useCallback(
    async ({
      silent = false,
    } = {}) => {
      if (!merchantId) {
        setTables([]);
        setLoading(false);
        setError(
          "Merchant information is not available."
        );
        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response =
          await apiRequest(
            `/orders/tables/${merchantId}`,
            {
              method: "GET",
            }
          );

        const normalizedTables =
          normalizeTables(response);

        setTables(normalizedTables);
      } catch (requestError) {
        console.error(
          "Failed to load table sessions:",
          requestError
        );

        setError(
          getErrorMessage(
            requestError,
            "Unable to load table sessions."
          )
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [merchantId]
  );

  /* ==========================================================
     INITIAL LOAD
  ========================================================== */

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        loadTables();
      }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [loadTables]);

  /* ==========================================================
     DYNAMIC SECTION LIST
     ----------------------------------------------------------
     Your existing design only had these two sections.
     We preserve those tabs, but only show a section if
     relevant metadata exists.
  ========================================================== */

  const sectionTabs = useMemo(() => {
    const knownSections = [
      "Indoor Main",
      "Outdoor Terrace",
    ];

    const availableSections =
      knownSections.filter((sectionName) =>
        tables.some(
          (table) =>
            table.section === sectionName
        )
      );

    return [
      {
        label: "All",
        count: tables.length,
      },
      ...availableSections.map(
        (sectionName) => ({
          label: sectionName,
          count: tables.filter(
            (table) =>
              table.section ===
              sectionName
          ).length,
        })
      ),
    ];
  }, [tables]);

  /* ==========================================================
     FILTER
  ========================================================== */

  const filteredTables =
    tables.filter((table) => {
      const sectionMatch =
        section === "All" ||
        table.section === section;

      const statusMatch =
        status === "All Tables" ||
        (status === "Available" &&
          !table.isOccupied) ||
        (status === "Occupied" &&
          table.isOccupied) ||
        (status === "Cash Pending" &&
          table.hasCashPending);

      return (
        sectionMatch &&
        statusMatch
      );
    });

  /* ==========================================================
     LIVE KPIs
  ========================================================== */

  const occupiedCount =
    tables.filter(
      (table) => table.isOccupied
    ).length;

  const availableCount =
    tables.filter(
      (table) => !table.isOccupied
    ).length;

  const totalSeats =
    tables.reduce(
      (sum, table) =>
        sum + Number(table.seats || 0),
      0
    );

  const cashPendingTotal =
    tables
      .filter(
        (table) =>
          table.hasCashPending
      )
      .reduce(
        (sum, table) =>
          sum +
          Number(
            table.totalBill || 0
          ),
        0
      );

  /* ==========================================================
     MODALS
  ========================================================== */

  const openModal = (
    type,
    table = null
  ) => {
    setSelectedTable(table);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedTable(null);
  };

  /* ==========================================================
     CLOSE TABLE
     ----------------------------------------------------------
     This is the important new live operation.
  ========================================================== */

  const closeAndVacate =
    async (table) => {
      if (!table || !merchantId) {
        return;
      }

      if (!table.isOccupied) {
        closeModal();
        return;
      }

      setClosingTableId(
        table.id
      );

      try {
        await apiRequest(
          `/orders/tables/close/${merchantId}/${table.id}`,
          {
            method:
              CLOSE_TABLE_METHOD,
          }
        );

        showToast(
          `${table.name} closed successfully.`
        );

        closeModal();

        /*
         * IMPORTANT:
         * Do not locally set isOccupied=false.
         *
         * Re-fetch the backend response and let
         * the backend decide the final table state.
         */
        await loadTables({
          silent: true,
        });
      } catch (requestError) {
        console.error(
          "Failed to close table:",
          requestError
        );

        showToast(
          getErrorMessage(
            requestError,
            `Unable to close ${table.name}.`
          ),
          "error"
        );
      } finally {
        setClosingTableId(null);
      }
    };

  /* ==========================================================
     CREATE TABLE
     ----------------------------------------------------------
     No table-create endpoint has been provided.
     Therefore do NOT fake persistence.
  ========================================================== */

const createTable = async () => {
  if (!merchantId) {
    showToast(
      "Merchant information is not available.",
      "error"
    );
    return;
  }

  try {
    await apiRequest("/orders/tables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchantId,
      }),
    });

    showToast("Table created successfully.");

    setNewTable({
      name: "",
      seats: "4",
      section: "Indoor Main",
    });

    closeModal();

    await loadTables({
      silent: true,
    });
  } catch (requestError) {
    console.error(
      "Failed to create table:",
      requestError
    );

    showToast(
      getErrorMessage(
        requestError,
        "Unable to create table."
      ),
      "error"
    );
  }
};
  /* ==========================================================
     DELETE TABLE
     ----------------------------------------------------------
     No table-delete endpoint has been provided.
  ========================================================== */

const deleteTable = async (tableId) => {
  const table = tables.find(
    (item) => item.id === tableId
  );

  if (!table) {
    return;
  }

  if (table.isOccupied) {
    showToast(
      "Occupied table cannot be deleted.",
      "error"
    );
    return;
  }

  if (!merchantId) {
    showToast(
      "Merchant information is not available.",
      "error"
    );
    return;
  }

  try {
    await apiRequest("/orders/tables", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchantId,
        tableId,
      }),
    });

    showToast(
      `${table.name} deleted successfully.`
    );

    await loadTables({
      silent: true,
    });
  } catch (requestError) {
    console.error(
      "Failed to delete table:",
      requestError
    );

    showToast(
      getErrorMessage(
        requestError,
        `Unable to delete ${table.name}.`
      ),
      "error"
    );
  }
};
  /* ==========================================================
     EDIT TABLE
     ----------------------------------------------------------
     No table-update endpoint has been provided.
  ========================================================== */

const saveEditedTable = async (updatedData) => {
  if (!merchantId || !selectedTable) {
    showToast(
      "Table information is not available.",
      "error"
    );
    return;
  }

  try {
    await apiRequest("/orders/tables", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchantId,
        tableId: selectedTable.id,
        name: updatedData.name,
        seats: Number(updatedData.seats),
        section: updatedData.section,
      }),
    });

    showToast(
      `${selectedTable.name} updated successfully.`
    );

    closeModal();

    await loadTables({
      silent: true,
    });
  } catch (requestError) {
    console.error(
      "Failed to update table:",
      requestError
    );

    showToast(
      getErrorMessage(
        requestError,
        "Unable to update table."
      ),
      "error"
    );
  }
};

  /* ==========================================================
     QR
  ========================================================== */

  const getQrUrl = (
    table
  ) => {
    const url =
      `https://qrcode-bytsol.vercel.app/demo?table=${table.id}`;

    return (
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=` +
      encodeURIComponent(url)
    );
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <section className="min-h-screen bg-[#F5F1EA] px-4 py-4 lg:px-6">
        <div className="flex min-h-[400px] items-center justify-center rounded-[18px] border border-[#DED3C5] bg-[#FFFDF9]">
          <div className="text-center">
            <LoaderCircle
              size={26}
              className="mx-auto animate-spin text-[#D48A20]"
            />

            <p className="mt-3 text-[12px] font-bold text-[#51483B]">
              Loading table sessions...
            </p>

            <p className="mt-1 text-[10px] text-[#9C9082]">
              Fetching live table occupancy.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F1EA] px-4 py-4 lg:px-6">

      {/* =====================================================
          COMMAND HEADER
      ===================================================== */}

      <div className="mb-4">

        <div className="flex flex-wrap items-end justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#282521] text-[#E6A23C] shadow-[0_5px_14px_rgba(35,30,23,0.12)]">
              <LayoutGrid size={18} />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-[20px] font-bold tracking-[-0.025em] text-[#25211D]">
                  Floor Board
                </h1>

                <span className="rounded-full bg-[#EAF4EE] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.11em] text-[#188067]">
                  Table Control
                </span>

              </div>

              <p className="mt-0.5 text-[10px] text-[#8C8072]">
                See every table. Open sessions. Close in one tap.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                loadTables({
                  silent: true,
                })
              }
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl border border-[#DED3C5] bg-[#FFFDF9] px-3 py-2 text-[10px] font-bold text-[#5F554B] shadow-[0_2px_7px_rgba(40,30,20,0.035)] transition hover:border-[#D7A05A] hover:bg-white disabled:opacity-60"
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
              onClick={() =>
                openModal("qrStudio")
              }
              className="hidden items-center gap-1.5 rounded-xl border border-[#DED3C5] bg-[#FFFDF9] px-3 py-2 text-[10px] font-bold text-[#5F554B] shadow-[0_2px_7px_rgba(40,30,20,0.035)] transition hover:border-[#D7A05A] hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20 sm:flex"
            >
              <QrCode size={13} />
              QR Studio
            </button>

            <button
              type="button"
              onClick={() =>
                openModal("add")
              }
              className="flex items-center gap-1.5 rounded-xl bg-[#282521] px-3.5 py-2.5 text-[11px] font-black text-white shadow-[0_5px_14px_rgba(35,30,23,0.16)] transition hover:bg-[#1D1B18] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/25"
            >
              <Plus size={14} />
              Add Table
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-[#E7C5C0] bg-[#FFF8F7] px-3.5 py-2.5 text-[#8E3D34]">

          <div className="flex items-center gap-2">
            <AlertCircle size={14} />

            <p className="text-[10px] font-semibold">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadTables()
            }
            className="text-[9px] font-black underline"
          >
            Retry
          </button>

        </div>
      )}

      {/* =====================================================
          QUICK SNAPSHOT
      ===================================================== */}

      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">

        <MiniStat
          icon={Armchair}
          label="Tables"
          value={tables.length}
          detail={`${totalSeats} seats`}
        />

        <MiniStat
          icon={Check}
          label="Available"
          value={availableCount}
          detail="Ready now"
          positive
        />

        <MiniStat
          icon={Utensils}
          label="Occupied"
          value={occupiedCount}
          detail={
            tables.length
              ? `${Math.round(
                  (occupiedCount /
                    tables.length) *
                    100
                )}% of floor`
              : "0%"
          }
        />

        <MiniStat
          icon={Banknote}
          label="Cash pending"
          value={formatINR(
            cashPendingTotal
          )}
          detail="Collect at table"
          warning
        />

      </div>

      {/* =====================================================
          FLOOR CONTROLS
      ===================================================== */}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">

        <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-xl border border-[#DED3C5] bg-[#EAE4DA] p-1 scrollbar-none">

          {sectionTabs.map(
            (item) => {

              const active =
                section === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setSection(
                      item.label
                    )
                  }
                  className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[10px] font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20 ${
                    active
                      ? "bg-[#282521] text-white shadow-sm"
                      : "text-[#6F6458] hover:bg-white/70"
                  }`}
                >
                  {item.label}

                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                      active
                        ? "bg-white/10 text-[#E9B85B]"
                        : "bg-black/5 text-[#9A8D7E]"
                    }`}
                  >
                    {item.count}
                  </span>

                </button>
              );
            }
          )}

        </div>

        <div className="flex items-center gap-2">

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value
              )
            }
            className="h-9 rounded-xl border border-[#DED3C5] bg-[#FFFDF9] px-3 text-[10px] font-bold text-[#4E463D] outline-none transition focus:border-[#D49A48] focus:ring-2 focus:ring-[#D49A48]/10"
          >
            <option>
              All Tables
            </option>

            <option>
              Available
            </option>

            <option>
              Occupied
            </option>

            <option>
              Cash Pending
            </option>
          </select>

          <div className="flex overflow-hidden rounded-xl border border-[#DED3C5] bg-[#FFFDF9]">

            <button
              type="button"
              onClick={() =>
                setView("grid")
              }
              className={`flex h-9 w-9 items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20 ${
                view === "grid"
                  ? "bg-[#282521] text-white"
                  : "text-[#786C5E] hover:bg-[#F5EFE7]"
              }`}
              title="Floor board"
            >
              <Grid2X2 size={14} />
            </button>

            <button
              type="button"
              onClick={() =>
                setView("list")
              }
              className={`flex h-9 w-9 items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20 ${
                view === "list"
                  ? "bg-[#282521] text-white"
                  : "text-[#786C5E] hover:bg-[#F5EFE7]"
              }`}
              title="List view"
            >
              <List size={14} />
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          FLOOR LEGEND
      ===================================================== */}

      <div className="mb-3 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#887B6D]">
            {section === "All"
              ? "Entire floor"
              : section}
          </span>

          <span className="h-1 w-1 rounded-full bg-[#CFC3B4]" />

          <span className="text-[10px] text-[#9C9082]">
            {filteredTables.length} tables shown
          </span>

        </div>

        <div className="flex items-center gap-3">

          <Legend
            dot="bg-[#D8D0C4]"
            label="Available"
          />

          <Legend
            dot="bg-[#E2A33E]"
            label="Active"
          />

        </div>

      </div>

      {/* =====================================================
          FLOOR BOARD
      ===================================================== */}

      {view === "grid" && (

        <div className="rounded-[18px] border border-[#DED3C5] bg-[#EAE4DA]/65 p-2.5 shadow-[0_4px_18px_rgba(43,33,22,0.035)]">

          <div
            className="
              grid
              grid-cols-2
              gap-2.5
              sm:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-6
            "
          >

            {filteredTables.map(
              (table) => (

                <FloorTable
                  key={table.id}
                  table={table}
                  onQr={() =>
                    openModal(
                      "qr",
                      table
                    )
                  }
                  onEdit={() =>
                    openModal(
                      "edit",
                      table
                    )
                  }
                  onDelete={() =>
                    deleteTable(
                      table.id
                    )
                  }
                  onDetails={() =>
                    openModal(
                      "details",
                      table
                    )
                  }
                  onClose={() =>
                    closeAndVacate(
                      table
                    )
                  }
                  closing={
                    closingTableId ===
                    table.id
                  }
                />

              )
            )}

          </div>

        </div>

      )}

      {/* =====================================================
          LIST VIEW
      ===================================================== */}

      {view === "list" && (

        <div className="overflow-hidden rounded-[18px] border border-[#DED3C5] bg-[#FFFDF9] shadow-[0_5px_18px_rgba(43,33,22,0.05)]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>

                <tr className="border-b border-[#E8DED1] bg-[#F6F1E9] text-left">

                  {[
                    "Table",
                    "Section",
                    "Session",
                    "Bill",
                    "Status",
                    "",
                  ].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#958879]"
                      >
                        {heading}
                      </th>
                    )
                  )}

                </tr>

              </thead>

              <tbody>

                {filteredTables.map(
                  (table) => (

                    <tr
                      key={table.id}
                      className="group border-b border-[#EEE6DC] last:border-0 hover:bg-[#FFFBF5]"
                    >

                      <td className="px-4 py-3">

                        <div className="flex items-center gap-2.5">

                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[10px] font-black ${
                              !table.isOccupied
                                ? "bg-[#F0ECE5] text-[#71665A]"
                                : "bg-[#FFF0D2] text-[#C67608]"
                            }`}
                          >
                            {table.id}
                          </div>

                          <div>

                            <p className="text-[11px] font-black text-[#302A24]">
                              {table.name}
                            </p>

                            <p className="text-[10px] text-[#9A8E81]">
                              {table.seats} seats
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-4 py-3 text-[10px] font-medium text-[#71665A]">
                        {table.section}
                      </td>

                      <td className="px-4 py-3">

                        {table.token ? (
                          <div>

                            <p className="font-mono text-[10px] font-bold text-[#302A24]">
                              {table.token}
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#9A8E81]">
                              {table.duration}
                            </p>

                          </div>
                        ) : (
                          <span className="text-[10px] text-[#AAA095]">
                            No active session
                          </span>
                        )}

                      </td>

                      <td className="px-4 py-3">

                        <span className="text-[11px] font-black text-[#BE710B]">
                          {table.totalBill
                            ? formatINR(
                                table.totalBill
                              )
                            : "—"}
                        </span>

                      </td>

                      <td className="px-4 py-3">

                        <StatusBadge
                          status={
                            table.status
                          }
                        />

                      </td>

                      <td className="px-4 py-3">

                        <div className="flex items-center justify-end gap-1">

                          {table.isOccupied ? (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  openModal(
                                    "details",
                                    table
                                  )
                                }
                                className="flex h-7 items-center gap-1 rounded-lg bg-[#282521] px-2.5 text-[10px] font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
                              >
                                Open
                                <ArrowUpRight
                                  size={11}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  closeAndVacate(
                                    table
                                  )
                                }
                                disabled={
                                  closingTableId ===
                                  table.id
                                }
                                className="h-7 rounded-lg border border-[#DED3C5] bg-white px-2.5 text-[10px] font-bold text-[#554C43] hover:bg-[#F8F2E9] disabled:opacity-50"
                              >
                                {closingTableId ===
                                table.id
                                  ? "Closing..."
                                  : "Close"}
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                openModal(
                                  "qr",
                                  table
                                )
                              }
                              className="flex h-7 items-center gap-1 rounded-lg border border-[#DED3C5] bg-white px-2.5 text-[10px] font-bold text-[#655B50] hover:bg-[#FFF6E8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
                            >
                              <QrCode
                                size={11}
                              />
                              QR
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              openModal(
                                "edit",
                                table
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8B7D6E] hover:bg-[#F3ECE2] hover:text-[#BD710C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
                          >
                            <MoreHorizontal
                              size={15}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {filteredTables.length === 0 && (

        <div className="mt-2 flex min-h-[280px] items-center justify-center rounded-[18px] border border-dashed border-[#D8CCBC] bg-[#FFFDF9]">

          <div className="text-center">

            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE8DE] text-[#918476]">
              <Armchair size={20} />
            </div>

            <p className="text-sm font-bold text-[#51483B]">
              No tables here
            </p>

            <p className="mt-1 text-[10px] text-[#9C9082]">
              Try another section or status filter.
            </p>

          </div>

        </div>

      )}

      {/* =====================================================
          ADD MODAL
      ===================================================== */}

      {modal === "add" && (

        <Modal onClose={closeModal}>

          <ModalHeader
            title="Add Table"
            subtitle="Create a new place on the floor."
            onClose={closeModal}
          />

          <div className="mt-5 space-y-4">

            <FormField label="Table name">

              <input
                value={newTable.name}
                onChange={(event) =>
                  setNewTable({
                    ...newTable,
                    name:
                      event.target.value,
                  })
                }
                placeholder="e.g. Table 11"
                className="input-style focus:outline-none focus:border-[#D49A48] focus:ring-2 focus:ring-[#D49A48]/10"
              />

            </FormField>

            <FormField label="Capacity">

              <select
                value={newTable.seats}
                onChange={(event) =>
                  setNewTable({
                    ...newTable,
                    seats:
                      event.target.value,
                  })
                }
                className="input-style focus:outline-none focus:border-[#D49A48] focus:ring-2 focus:ring-[#D49A48]/10"
              >
                <option value="2">
                  2 seats
                </option>

                <option value="4">
                  4 seats
                </option>

                <option value="6">
                  6 seats
                </option>

                <option value="8">
                  8 seats
                </option>
              </select>

            </FormField>

            <FormField label="Section">

              <select
                value={newTable.section}
                onChange={(event) =>
                  setNewTable({
                    ...newTable,
                    section:
                      event.target.value,
                  })
                }
                className="input-style focus:outline-none focus:border-[#D49A48] focus:ring-2 focus:ring-[#D49A48]/10"
              >
                <option>
                  Indoor Main
                </option>

                <option>
                  Outdoor Terrace
                </option>
              </select>

            </FormField>

          </div>

          <ModalActions
            onCancel={closeModal}
            primary="Create Table"
            onPrimary={
              createTable
            }
          />

        </Modal>

      )}

      {/* =====================================================
          QR MODAL
      ===================================================== */}

      {modal === "qr" &&
        selectedTable && (

          <Modal onClose={closeModal}>

            <ModalHeader
              title={`${selectedTable.name} QR`}
              subtitle="Customer ordering point"
              onClose={closeModal}
            />

            <div className="mt-5 rounded-2xl bg-[#F5F0E8] p-5 text-center">

              <div className="mx-auto flex w-fit rounded-2xl border border-[#DDD1C1] bg-white p-4 shadow-[0_5px_15px_rgba(40,30,20,0.06)]">

                <img
                  src={getQrUrl(
                    selectedTable
                  )}
                  alt={`${selectedTable.name} QR`}
                  className="h-[190px] w-[190px]"
                />

              </div>

              <p className="mt-4 text-[10px] font-bold text-[#51483B]">
                Scan to open ordering
              </p>

              <p className="mt-1 break-all text-[10px] text-[#9B8F82]">
                qrcode-bytsol.vercel.app/demo?table=
                {selectedTable.id}
              </p>

            </div>

            <button
              type="button"
              onClick={closeModal}
              className="mt-4 w-full rounded-xl bg-[#282521] py-3 text-[11px] font-black text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/25"
            >
              Done
            </button>

          </Modal>

        )}

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {modal === "details" &&
        selectedTable && (

          <Modal
            onClose={closeModal}
            wide
          >

            <ModalHeader
              title={`${selectedTable.name} Session`}
              subtitle={`${selectedTable.section} · ${
                selectedTable.duration ||
                "Active"
              }`}
              onClose={closeModal}
            />

            <div className="mt-5 rounded-[16px] border border-[#E0D4C5] bg-[#F5F0E8] p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#96897A]">
                    Current bill
                  </p>

                  <p className="mt-1 text-[27px] font-black tracking-[-0.04em] text-[#2B261F]">
                    {formatINR(
                      selectedTable.totalBill
                    )}
                  </p>

                </div>

                <StatusBadge
                  status={
                    selectedTable.status
                  }
                />

              </div>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#95897B]">
                  Active token
                </p>

                <p className="mt-1 font-mono text-sm font-black text-[#302A24]">
                  {selectedTable.token ||
                    "Multiple orders"}
                </p>

              </div>

              <div className="text-right">

                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#95897B]">
                  Orders
                </p>

                <p className="mt-1 text-[11px] font-bold text-[#51483B]">
                  {selectedTable.ordersCount}
                </p>

              </div>

            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-[#E1D6C8] bg-white">

              <div className="border-b border-[#E9E0D6] bg-[#FAF7F2] px-3 py-2">

                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8E8173]">
                  Current orders
                </p>

              </div>

              <div className="max-h-[280px] overflow-y-auto">

                {selectedTable.orders?.map(
                  (order) => (

                    <div
                      key={
                        order._id ||
                        order.tokenNumber
                      }
                      className="border-b border-[#EEE6DC] last:border-0"
                    >

                      <div className="flex items-center justify-between px-3 py-2.5">

                        <div>

                          <p className="font-mono text-[10px] font-black text-[#302A24]">
                            {order.tokenNumber ||
                              "Order"}
                          </p>

                          <p className="mt-0.5 text-[9px] text-[#9A8E81]">
                            {order.customerName ||
                              "Guest"}{" "}
                            ·{" "}
                            {order.status ||
                              "received"}
                          </p>

                        </div>

                        <p className="text-[10px] font-black text-[#BE710B]">
                          {formatINR(
                            order.total
                          )}
                        </p>

                      </div>

                      <div className="px-3 pb-2.5">

                        {order.items?.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={
                                item._id ||
                                `${item.name}-${index}`
                              }
                              className="flex items-center justify-between py-1"
                            >

                              <span className="text-[10px] font-bold text-[#40382F]">
                                {item.name}
                              </span>

                              <span className="font-mono text-[10px] font-bold text-[#9A8D7E]">
                                ×
                                {
                                  item.quantity
                                }
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

            <div className="mt-4 flex gap-2">

              <button
                type="button"
                onClick={() =>
                  openModal(
                    "qr",
                    selectedTable
                  )
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#DED3C5] bg-white py-3 text-[10px] font-bold text-[#5C5248] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
              >
                <QrCode size={13} />
                Table QR
              </button>

              <button
                type="button"
                onClick={() =>
                  closeAndVacate(
                    selectedTable
                  )
                }
                disabled={
                  closingTableId ===
                  selectedTable.id
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#282521] py-3 text-[10px] font-black text-white disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/25"
              >
                {closingTableId ===
                selectedTable.id ? (
                  <LoaderCircle
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={13} />
                )}

                {closingTableId ===
                selectedTable.id
                  ? "Closing..."
                  : "Close Session"}
              </button>

            </div>

          </Modal>

        )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {modal === "edit" &&
        selectedTable && (

          <EditTableModal
            table={selectedTable}
            onClose={closeModal}
            onSave={
              saveEditedTable
            }
          />

        )}

      {/* =====================================================
          QR STUDIO
          ----------------------------------------------------
          Existing design entry point preserved.
      ===================================================== */}

      {modal === "qrStudio" && (

        <Modal onClose={closeModal}>

          <ModalHeader
            title="QR Studio"
            subtitle="Select a table to view its QR."
            onClose={closeModal}
          />

          <div className="mt-5 grid grid-cols-2 gap-2">

            {tables.map(
              (table) => (

                <button
                  key={table.id}
                  type="button"
                  onClick={() =>
                    openModal(
                      "qr",
                      table
                    )
                  }
                  className="flex items-center justify-between rounded-xl border border-[#DED3C5] bg-white px-3 py-2.5 text-left hover:bg-[#FFF7E9]"
                >

                  <span>

                    <span className="block text-[10px] font-black text-[#302A24]">
                      {table.name}
                    </span>

                    <span className="text-[8px] text-[#9A8E81]">
                      {table.isOccupied
                        ? "Occupied"
                        : "Available"}
                    </span>

                  </span>

                  <QrCode
                    size={13}
                    className="text-[#B96D0B]"
                  />

                </button>

              )
            )}

          </div>

        </Modal>

      )}

      <Toast
        toast={toast}
        onClose={() =>
          setToast({
            open: false,
            type: "success",
            message: "",
          })
        }
      />

    </section>
  );
}

/* ============================================================
   FLOOR TABLE
============================================================ */

function FloorTable({
  table,
  onQr,
  onEdit,
  onDelete,
  onDetails,
  onClose,
  closing,
}) {
  const occupied =
    table.isOccupied;

  return (
    <div
      className={`group relative min-h-[190px] overflow-hidden rounded-[15px] border transition-all duration-200 ${
        occupied
          ? "border-[#D9C6AA] bg-[#FFFDF8] shadow-[0_8px_22px_rgba(48,37,23,0.09)] hover:-translate-y-0.5 hover:shadow-[0_12px_27px_rgba(48,37,23,0.13)]"
          : "border-[#DCD2C5] bg-[#FDFBF7] shadow-[0_3px_9px_rgba(45,35,20,0.035)] hover:-translate-y-0.5 hover:border-[#D2B58C] hover:shadow-[0_9px_20px_rgba(45,35,20,0.08)]"
      }`}
    >

      <div
        className={`absolute left-0 right-0 top-0 h-[3px] ${
          occupied
            ? "bg-[#E0A13A]"
            : "bg-[#D8D0C4]"
        }`}
      />

      <div className="p-3">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-2">

            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                occupied
                  ? "bg-[#FFF0D2] text-[#C8790F]"
                  : "bg-[#EEE9E0] text-[#817568]"
              }`}
            >
              <Armchair size={15} />
            </div>

            <div>

              <p className="text-[11px] font-black text-[#302A24]">
                {table.name}
              </p>

              <p className="text-[10px] text-[#9A8D7F]">
                {table.seats} seats
              </p>

            </div>

          </div>

          <StatusDot
            occupied={occupied}
          />

        </div>

        {!occupied && (

          <div className="mt-5">

            <div className="flex items-center gap-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-[#BDB5A9]" />

              <span className="text-[10px] font-bold text-[#82776B]">
                Ready for guests
              </span>

            </div>

            <p className="mt-1 text-[10px] text-[#AAA095]">
              {table.section}
            </p>

            <button
              type="button"
              onClick={onQr}
              className="mt-4 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-[#DDD2C3] bg-white text-[10px] font-bold text-[#665C51] transition hover:border-[#D8A35C] hover:bg-[#FFF7E9] hover:text-[#B76D0A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
            >
              <QrCode size={12} />
              View table QR
            </button>

          </div>

        )}

        {occupied && (

          <div className="mt-3">

            <div className="flex items-end justify-between">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9A8D7F]">
                  Active token
                </p>

                <p className="mt-0.5 font-mono text-[15px] font-black text-[#2C2721]">
                  {table.token ||
                    `${table.ordersCount} orders`}
                </p>

              </div>

              <div className="text-right">

                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9A8D7F]">
                  Bill
                </p>

                <p className="mt-0.5 text-[15px] font-black text-[#C0710A]">
                  {formatINR(
                    table.totalBill
                  )}
                </p>

              </div>

            </div>

            <div className="relative mt-2.5 rounded-lg border border-[#E6DCCE] bg-[#FAF6EF] px-2.5 py-2">

              <div className="flex items-center gap-1.5">

                <Receipt
                  size={11}
                  className="text-[#A28F7A]"
                />

                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#95897B]">
                  Order
                </span>

                <span className="ml-auto text-[10px] font-bold text-[#95897B]">
                  {table.duration ||
                    "Active"}
                </span>

              </div>

              <p className="mt-1.5 truncate text-[10px] font-semibold text-[#554B41]">
                {table.items
                  ?.map(
                    (item) =>
                      `${item.name} ×${item.quantity}`
                  )
                  .join(" · ") ||
                  "Active session"}
              </p>

            </div>

            <div className="mt-2 flex gap-1.5">

              <button
                type="button"
                onClick={onDetails}
                className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-[#282521] text-[10px] font-black text-white transition hover:bg-[#1D1B18] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/25"
              >
                Open session
                <ArrowUpRight
                  size={11}
                />
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={closing}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDD2C4] bg-white text-[#6C6257] transition hover:border-[#CDBDA8] hover:bg-[#F8F1E6] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
                title="Close session"
              >
                {closing ? (
                  <LoaderCircle
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={13} />
                )}
              </button>

            </div>

          </div>

        )}

        <div className="mt-2 flex items-center justify-end gap-0.5 opacity-0 transition group-hover:opacity-100">

          <button
            type="button"
            onClick={onEdit}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#9B8E80] hover:bg-[#F1EBE2] hover:text-[#B96D0B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
            title="Edit table"
          >
            <Pencil size={11} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#B19F8D] hover:bg-[#FFF0ED] hover:text-[#A74C40] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
            title="Delete table"
          >
            <Trash2 size={11} />
          </button>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   MINI STAT
============================================================ */

function MiniStat({
  icon: Icon,
  label,
  value,
  detail,
  positive,
  warning,
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[#DED3C5] bg-[#FFFDF9] px-3 py-2.5 shadow-[0_2px_8px_rgba(40,30,20,0.035)]">

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          warning
            ? "bg-[#FFF0D2] text-[#C8790F]"
            : positive
            ? "bg-[#E8F4EE] text-[#218069]"
            : "bg-[#F0EBE3] text-[#796D60]"
        }`}
      >
        <Icon size={14} />
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-black uppercase tracking-[0.11em] text-[#9A8D7F]">
          {label}
        </p>

        <div className="flex items-baseline gap-1.5">

          <p className="text-[16px] font-black tracking-[-0.02em] text-[#2C2721]">
            {value}
          </p>

          <span className="truncate text-[10px] text-[#9D9183]">
            {detail}
          </span>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   STATUS DOT
============================================================ */

function StatusDot({
  occupied,
}) {
  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full ${
        occupied
          ? "bg-[#FFF0D2]"
          : "bg-[#EEEAE2]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          occupied
            ? "bg-[#E0A03A]"
            : "bg-[#AAA195]"
        }`}
      />
    </span>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}) {
  const occupied =
    status !== "Available";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${
        status === "Cash Pending"
          ? "bg-[#FFF0D2] text-[#BC700B]"
          : occupied
          ? "bg-[#FFF0D2] text-[#BC700B]"
          : "bg-[#EEEAE2] text-[#74695E]"
      }`}
    >

      <span
        className={`h-1.5 w-1.5 rounded-full ${
          occupied
            ? "bg-[#D9962D]"
            : "bg-[#AAA195]"
        }`}
      />

      {status}

    </span>
  );
}

/* ============================================================
   LEGEND
============================================================ */

function Legend({
  dot,
  label,
}) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#918477]">

      <span
        className={`h-1.5 w-1.5 rounded-full ${dot}`}
      />

      {label}

    </span>
  );
}

/* ============================================================
   MODAL
============================================================ */

function Modal({
  children,
  wide = false,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#211D18]/55 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose?.();
        }
      }}
    >

      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-[18px] border border-[#DED3C5] bg-[#FFFDF9] p-5 shadow-[0_25px_70px_rgba(30,24,17,0.24)] ${
          wide
            ? "max-w-[580px]"
            : "max-w-[440px]"
        }`}
      >
        {children}
      </div>

    </div>
  );
}

/* ============================================================
   MODAL HEADER
============================================================ */

function ModalHeader({
  title,
  subtitle,
  onClose,
}) {
  return (
    <div className="flex items-start justify-between gap-4">

      <div>

        <h2 className="text-[17px] font-black tracking-[-0.02em] text-[#29241F]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-0.5 text-[10px] text-[#978B7D]">
            {subtitle}
          </p>
        )}

      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#DED3C5] text-[#73685C] transition hover:bg-[#F3ECE3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
      >
        <X size={15} />
      </button>

    </div>
  );
}

/* ============================================================
   FORM
============================================================ */

function FormField({
  label,
  children,
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.11em] text-[#75695C]">
        {label}
      </span>

      {children}

    </label>
  );
}

/* ============================================================
   MODAL ACTIONS
============================================================ */

function ModalActions({
  onCancel,
  primary,
  onPrimary,
}) {
  return (
    <div className="mt-6 flex gap-2">

      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-xl border border-[#DED3C5] bg-white py-2.5 text-[10px] font-bold text-[#574D43] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onPrimary}
        className="flex-1 rounded-xl bg-[#282521] py-2.5 text-[10px] font-black text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/25"
      >
        {primary}
      </button>

    </div>
  );
}

/* ============================================================
   EDIT MODAL
============================================================ */

function EditTableModal({
  table,
  onClose,
  onSave,
}) {
  const [name, setName] =
    useState(table.name);

  const [seats, setSeats] =
    useState(
      String(table.seats)
    );

  const [section, setSection] =
    useState(table.section);

  return (
    <Modal onClose={onClose}>

      <ModalHeader
        title={`Edit ${table.name}`}
        subtitle="Update the floor position details."
        onClose={onClose}
      />

      <div className="mt-5 space-y-4">

        <FormField label="Table name">

          <input
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            className="input-style focus:outline-none focus:border-[#D49A48] focus:ring-2 focus:ring-[#D49A48]/10"
          />

        </FormField>

        <FormField label="Capacity">

          <select
            value={seats}
            onChange={(event) =>
              setSeats(
                event.target.value
              )
            }
            className="input-style focus:outline-none focus:border-[#D49A48] focus:ring-2 focus:ring-[#D49A48]/10"
          >

            <option value="2">
              2 seats
            </option>

            <option value="4">
              4 seats
            </option>

            <option value="6">
              6 seats
            </option>

            <option value="8">
              8 seats
            </option>

          </select>

        </FormField>

        <FormField label="Section">

          <select
            value={section}
            onChange={(event) =>
              setSection(
                event.target.value
              )
            }
            className="input-style focus:outline-none focus:border-[#D49A48] focus:ring-2 focus:ring-[#D49A48]/10"
          >

            <option>
              Indoor Main
            </option>

            <option>
              Outdoor Terrace
            </option>

          </select>

        </FormField>

      </div>

      <ModalActions
        onCancel={onClose}
        primary="Save Changes"
        onPrimary={() =>
          onSave({
            name,
            seats: Number(seats),
            section,
          })
        }
      />

    </Modal>
  );
}

export default TableSessionsPage;