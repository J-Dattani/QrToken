import { useState } from "react";
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
} from "lucide-react";

const initialTables = [
  {
    id: 1,
    name: "Table 1",
    seats: 4,
    section: "Indoor Main",
    status: "Available",
  },
  {
    id: 2,
    name: "Table 2",
    seats: 2,
    section: "Indoor Main",
    status: "Available",
  },
  {
    id: 3,
    name: "Table 3",
    seats: 4,
    section: "Indoor Main",
    status: "Cash Pending",
    token: "#A-001",
    bill: 43,
    duration: "34 mins",
    items: [
      { name: "Vada Pav", quantity: 1 },
      { name: "Bun Maska", quantity: 1 },
      { name: "Filter Coffee", quantity: 1 },
    ],
  },
  {
    id: 4,
    name: "Table 4",
    seats: 2,
    section: "Indoor Main",
    status: "Available",
  },
  {
    id: 5,
    name: "Table 5",
    seats: 4,
    section: "Indoor Main",
    status: "Available",
  },
  {
    id: 6,
    name: "Table 6",
    seats: 2,
    section: "Indoor Main",
    status: "Available",
  },
  {
    id: 7,
    name: "Table 7",
    seats: 4,
    section: "Outdoor Terrace",
    status: "Available",
  },
  {
    id: 8,
    name: "Table 8",
    seats: 2,
    section: "Outdoor Terrace",
    status: "Available",
  },
  {
    id: 9,
    name: "Table 9",
    seats: 4,
    section: "Outdoor Terrace",
    status: "Available",
  },
  {
    id: 10,
    name: "Table 10",
    seats: 2,
    section: "Outdoor Terrace",
    status: "Available",
  },
];

function TableSessionsPage() {
  const [tables, setTables] =
    useState(initialTables);

  const [view, setView] = useState("grid");
  const [section, setSection] = useState("All");
  const [status, setStatus] = useState("All Tables");

  const [modal, setModal] = useState(null);
  const [selectedTable, setSelectedTable] =
    useState(null);

  const [newTable, setNewTable] = useState({
    name: "",
    seats: "4",
    section: "Indoor Main",
  });

  const filteredTables = tables.filter((table) => {
    const sectionMatch =
      section === "All" ||
      table.section === section;

    const statusMatch =
      status === "All Tables" ||
      table.status === status;

    return sectionMatch && statusMatch;
  });

  const occupiedCount = tables.filter(
    (table) => table.status !== "Available"
  ).length;

  const availableCount = tables.filter(
    (table) => table.status === "Available"
  ).length;

  const totalSeats = tables.reduce(
    (sum, table) => sum + table.seats,
    0
  );

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

  const createTable = () => {
    if (!newTable.name.trim()) return;

    const nextId =
      tables.length > 0
        ? Math.max(
            ...tables.map(
              (table) => table.id
            )
          ) + 1
        : 1;

    setTables((current) => [
      ...current,
      {
        id: nextId,
        name: newTable.name.trim(),
        seats: Number(newTable.seats),
        section: newTable.section,
        status: "Available",
      },
    ]);

    setNewTable({
      name: "",
      seats: "4",
      section: "Indoor Main",
    });

    closeModal();
  };

  const deleteTable = (tableId) => {
    const table = tables.find(
      (item) => item.id === tableId
    );

    if (!table) return;

    if (table.status !== "Available") {
      alert(
        "Occupied table cannot be deleted."
      );
      return;
    }

    if (
      window.confirm(
        `Delete ${table.name}? This action cannot be undone.`
      )
    ) {
      setTables((current) =>
        current.filter(
          (item) => item.id !== tableId
        )
      );
    }
  };

  const closeAndVacate = (table) => {
    if (!table) return;

    setTables((current) =>
      current.map((item) =>
        item.id === table.id
          ? {
              ...item,
              status: "Available",
              token: undefined,
              bill: undefined,
              duration: undefined,
              items: undefined,
            }
          : item
      )
    );

    closeModal();
  };

  const getQrUrl = (table) => {
    const url = `https://qrcode-bytsol.vercel.app/demo?table=${table.id}`;

    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      url
    )}`;
  };

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
          value={`₹${tables
            .filter(
              (table) =>
                table.status ===
                "Cash Pending"
            )
            .reduce(
              (sum, table) =>
                sum + (table.bill || 0),
              0
            )}`}
          detail="Collect at table"
          warning
        />

      </div>

      {/* =====================================================
          FLOOR CONTROLS
      ===================================================== */}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">

        <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-xl border border-[#DED3C5] bg-[#EAE4DA] p-1 scrollbar-none">

          {[
            {
              label: "All",
              count: tables.length,
            },
            {
              label: "Indoor Main",
              count: tables.filter(
                (table) =>
                  table.section ===
                  "Indoor Main"
              ).length,
            },
            {
              label: "Outdoor Terrace",
              count: tables.filter(
                (table) =>
                  table.section ===
                  "Outdoor Terrace"
              ).length,
            },
          ].map((item) => {

            const active =
              section === item.label;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  setSection(item.label)
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
          })}

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
            <option>All Tables</option>
            <option>Available</option>
            <option>Cash Pending</option>
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
                              table.status ===
                              "Available"
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
                          {table.bill
                            ? `₹${table.bill}`
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

                          {table.status !==
                          "Available" ? (
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
                                className="h-7 rounded-lg border border-[#DED3C5] bg-white px-2.5 text-[10px] font-bold text-[#554C43] hover:bg-[#F8F2E9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
                              >
                                Close
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

      {/* EMPTY */}

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
                    name: event.target.value,
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
                    seats: event.target.value,
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
            onPrimary={createTable}
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
              subtitle={`${selectedTable.section} · ${selectedTable.duration}`}
              onClose={closeModal}
            />

            <div className="mt-5 rounded-[16px] border border-[#E0D4C5] bg-[#F5F0E8] p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#96897A]">
                    Current bill
                  </p>

                  <p className="mt-1 text-[27px] font-black tracking-[-0.04em] text-[#2B261F]">
                    ₹{selectedTable.bill}
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
                  {selectedTable.token}
                </p>

              </div>

              <div className="text-right">

                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#95897B]">
                  Session
                </p>

                <p className="mt-1 text-[11px] font-bold text-[#51483B]">
                  {selectedTable.duration}
                </p>

              </div>

            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-[#E1D6C8] bg-white">

              <div className="border-b border-[#E9E0D6] bg-[#FAF7F2] px-3 py-2">

                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8E8173]">
                  Current order
                </p>

              </div>

              <div>

                {selectedTable.items?.map(
                  (item, index) => (

                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center justify-between border-b border-[#EEE6DC] px-3 py-2.5 last:border-0"
                    >

                      <span className="text-[10px] font-bold text-[#40382F]">
                        {item.name}
                      </span>

                      <span className="font-mono text-[10px] font-bold text-[#9A8D7E]">
                        ×{item.quantity}
                      </span>

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
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#282521] py-3 text-[10px] font-black text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/25"
              >
                <Check size={13} />
                Close Session
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
            onSave={(updatedTable) => {

              setTables((current) =>
                current.map(
                  (table) =>
                    table.id ===
                    selectedTable.id
                      ? {
                          ...table,
                          ...updatedTable,
                        }
                      : table
                )
              );

              closeModal();

            }}
          />

        )}

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
}) {
  const occupied =
    table.status !== "Available";

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

          <StatusDot occupied={occupied} />

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
                  {table.token}
                </p>

              </div>

              <div className="text-right">

                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9A8D7F]">
                  Bill
                </p>

                <p className="mt-0.5 text-[15px] font-black text-[#C0710A]">
                  ₹{table.bill}
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
                  {table.duration}
                </span>

              </div>

              <p className="mt-1.5 truncate text-[10px] font-semibold text-[#554B41]">
                {table.items
                  ?.map(
                    (item) =>
                      `${item.name} ×${item.quantity}`
                  )
                  .join(" · ")}
              </p>

            </div>

            <div className="mt-2 flex gap-1.5">

              <button
                type="button"
                onClick={onDetails}
                className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-[#282521] text-[10px] font-black text-white transition hover:bg-[#1D1B18] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/25"
              >
                Open session
                <ArrowUpRight size={11} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDD2C4] bg-white text-[#6C6257] transition hover:border-[#CDBDA8] hover:bg-[#F8F1E6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D49A48]/20"
                title="Close session"
              >
                <Check size={13} />
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

function StatusDot({ occupied }) {
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

function StatusBadge({ status }) {
  const occupied =
    status !== "Available";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${
        occupied
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

function Legend({ dot, label }) {
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
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211D18]/55 p-4 backdrop-blur-[2px]">

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
    useState(String(table.seats));

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