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
  const [tables, setTables] = useState(initialTables);

  const [view, setView] = useState("grid");
  const [section, setSection] = useState("All");
  const [status, setStatus] = useState("All Tables");

  const [modal, setModal] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const [newTable, setNewTable] = useState({
    name: "",
    seats: "4",
    section: "Indoor Main",
  });

  const filteredTables = tables.filter((table) => {
    const sectionMatch =
      section === "All" || table.section === section;

    const statusMatch =
      status === "All Tables" || table.status === status;

    return sectionMatch && statusMatch;
  });

  const occupiedCount = tables.filter(
    (table) => table.status !== "Available"
  ).length;

  const openModal = (type, table = null) => {
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
        ? Math.max(...tables.map((table) => table.id)) + 1
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
    const table = tables.find((item) => item.id === tableId);

    if (!table) return;

    if (table.status !== "Available") {
      alert("Occupied table cannot be deleted.");
      return;
    }

    if (
      window.confirm(
        `Delete ${table.name}? This action cannot be undone.`
      )
    ) {
      setTables((current) =>
        current.filter((item) => item.id !== tableId)
      );
    }
  };

  const closeAndVacate = () => {
    if (!selectedTable) return;

    setTables((current) =>
      current.map((table) =>
        table.id === selectedTable.id
          ? {
              ...table,
              status: "Available",
              token: undefined,
              bill: undefined,
              duration: undefined,
              items: undefined,
            }
          : table
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
    <section className="min-h-screen bg-[#F7F3ED] px-6 py-6 lg:px-8">

      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

        <div>
          <h1 className="text-[25px] font-semibold text-[#241F1A]">
            Table Sessions & Floor Plan
          </h1>

          <p className="mt-1 text-sm text-[#766A5D]">
            {occupiedCount} of {tables.length} tables occupied · Add,
            edit & manage outlet floor plan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() => openModal("add")}
            className="flex items-center gap-2 rounded-xl bg-[#292621] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1D1B18]"
          >
            <Plus size={16} />
            Add New Table
          </button>

          <div className="flex overflow-hidden rounded-xl border border-[#E5D8C8] bg-white">

            <button
              type="button"
              onClick={() => setView("grid")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                view === "grid"
                  ? "bg-[#292621] text-white"
                  : "text-[#5F554B]"
              }`}
            >
              <Grid2X2 size={15} />
              Visual Grid
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
                view === "list"
                  ? "bg-[#292621] text-white"
                  : "text-[#5F554B]"
              }`}
            >
              <List size={15} />
              List View
            </button>

          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#E5D8C8] bg-white px-4 py-3 text-sm font-semibold text-[#3E372F] hover:bg-[#FFF9F0]"
          >
            <QrCode size={15} />
            Table QR Studio
          </button>

        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

        <div className="flex flex-wrap items-center gap-2">

          <span className="mr-1 text-sm font-medium text-[#4F463D]">
            Section:
          </span>

          {["All", "Indoor Main", "Outdoor Terrace"].map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSection(item)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  section === item
                    ? "border-[#292621] bg-[#292621] text-white"
                    : "border-[#E5D8C8] bg-white text-[#5F554B] hover:bg-[#FFF8EE]"
                }`}
              >
                {item}
              </button>
            )
          )}

        </div>

        <div className="flex items-center gap-2">

          <span className="text-sm font-medium text-[#4F463D]">
            Status:
          </span>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-[#E5D8C8] bg-white px-4 py-2.5 text-sm font-medium text-[#332D27] outline-none focus:border-[#D88A22]"
          >
            <option>All Tables</option>
            <option>Available</option>
            <option>Cash Pending</option>
          </select>

        </div>

      </div>

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          {filteredTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onQr={() => openModal("qr", table)}
              onEdit={() => openModal("edit", table)}
              onDelete={() => deleteTable(table.id)}
              onDetails={() => openModal("details", table)}
              onClose={() => {
                setSelectedTable(table);
                closeAndVacate();
              }}
            />
          ))}

        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="overflow-hidden rounded-2xl border border-[#E5D8C8] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-sm">

              <thead>
                <tr className="border-b border-[#E5D8C8] text-left text-xs uppercase tracking-wide text-[#766A5D]">
                  <th className="px-4 py-3">Table Name</th>
                  <th className="px-4 py-3">Capacity & Section</th>
                  <th className="px-4 py-3">Active Orders</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Total Bill</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredTables.map((table) => (
                  <tr
                    key={table.id}
                    className="border-b border-[#EEE5D9] last:border-0"
                  >

                    <td className="px-4 py-4 font-semibold text-[#2B241E]">
                      {table.name}
                    </td>

                    <td className="px-4 py-4 text-[#665D53]">
                      {table.seats} Seats · {table.section}
                    </td>

                    <td className="px-4 py-4 text-[#665D53]">
                      {table.token || "—"}
                      {table.bill
                        ? ` (₹${table.bill})`
                        : ""}
                    </td>

                    <td className="px-4 py-4 font-mono text-[#332D27]">
                      {table.duration || "—"}
                    </td>

                    <td className="px-4 py-4 font-semibold text-[#C87810]">
                      ₹{table.bill || 0}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={table.status} />
                    </td>

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3 whitespace-nowrap">

                        {table.status !== "Available" ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                openModal("details", table)
                              }
                              className="font-medium text-[#C87810] hover:underline"
                            >
                              Details →
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTable(table);
                                closeAndVacate();
                              }}
                              className="font-medium text-[#292621] hover:underline"
                            >
                              Close
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openModal("qr", table)}
                            className="font-medium text-[#C87810] hover:underline"
                          >
                            View QR
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openModal("edit", table)}
                          className="flex items-center gap-1 text-[#62584E] hover:text-[#C87810]"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteTable(table.id)}
                          className="flex items-center gap-1 text-[#C86A5D] hover:text-red-600"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* EMPTY */}
      {filteredTables.length === 0 && (
        <div className="rounded-2xl border border-[#E5D8C8] bg-white p-12 text-center">
          <h2 className="font-semibold text-[#2B241E]">
            No tables found
          </h2>

          <p className="mt-1 text-sm text-[#766A5D]">
            Try changing the section or status filter.
          </p>
        </div>
      )}

      {/* ADD MODAL */}
      {modal === "add" && (
        <Modal onClose={closeModal}>

          <ModalHeader
            title="+ Add New Table"
            onClose={closeModal}
          />

          <div className="space-y-5">

            <FormField label="Table Name / Number">
              <input
                value={newTable.name}
                onChange={(event) =>
                  setNewTable({
                    ...newTable,
                    name: event.target.value,
                  })
                }
                placeholder="e.g. Table 11 or VIP-1"
                className="input-style"
              />
            </FormField>

            <FormField label="Seating Capacity">
              <select
                value={newTable.seats}
                onChange={(event) =>
                  setNewTable({
                    ...newTable,
                    seats: event.target.value,
                  })
                }
                className="input-style"
              >
                <option value="2">2 Seats</option>
                <option value="4">4 Seats (Standard)</option>
                <option value="6">6 Seats</option>
                <option value="8">8 Seats</option>
              </select>
            </FormField>

            <FormField label="Restaurant Section">
              <select
                value={newTable.section}
                onChange={(event) =>
                  setNewTable({
                    ...newTable,
                    section: event.target.value,
                  })
                }
                className="input-style"
              >
                <option>Indoor Main</option>
                <option>Outdoor Terrace</option>
              </select>
            </FormField>

          </div>

          <div className="mt-7 flex gap-3">

            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-xl border border-[#E5D8C8] px-4 py-3 font-semibold text-[#332D27]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={createTable}
              className="flex-1 rounded-xl bg-[#292621] px-4 py-3 font-semibold text-white"
            >
              Create Table
            </button>

          </div>

        </Modal>
      )}

      {/* QR MODAL */}
      {modal === "qr" && selectedTable && (
        <Modal onClose={closeModal}>

          <ModalHeader
            title={`${selectedTable.name} QR Code`}
            onClose={closeModal}
          />

          <p className="text-center text-sm text-[#766A5D]">
            Scan with phone camera to order & pay
          </p>

          <div className="mx-auto mt-5 flex w-fit rounded-xl border border-[#E5D8C8] bg-white p-5">
            <img
              src={getQrUrl(selectedTable)}
              alt={`${selectedTable.name} QR`}
              className="h-[220px] w-[220px]"
            />
          </div>

          <p className="mt-5 break-all text-center text-xs text-[#766A5D]">
            https://qrcode-bytsol.vercel.app/demo?table=
            {selectedTable.id}
          </p>

          <button
            type="button"
            onClick={closeModal}
            className="mt-5 w-full rounded-xl bg-[#292621] px-4 py-3 font-semibold text-white"
          >
            Done
          </button>

        </Modal>
      )}

      {/* SESSION DETAILS */}
      {modal === "details" && selectedTable && (
        <Modal onClose={closeModal} wide>

          <ModalHeader
            title={`${selectedTable.name} Session Details`}
            onClose={closeModal}
          />

          <p className="text-sm text-[#766A5D]">
            {selectedTable.section} · Occupied for{" "}
            {selectedTable.duration}
          </p>

          <div className="mt-5 rounded-xl bg-[#EEE9DE] p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase text-[#8A8074]">
                  Total Accumulated Bill
                </p>

                <p className="mt-1 text-2xl font-bold text-[#C87810]">
                  ₹{selectedTable.bill}
                </p>
              </div>

              <div className="text-right">

                <p className="text-xs uppercase text-[#8A8074]">
                  Payment Status
                </p>

                <StatusBadge status={selectedTable.status} />

              </div>

            </div>

          </div>

          <h3 className="mt-5 text-sm font-bold uppercase text-[#5F554B]">
            Active Orders at {selectedTable.name}
          </h3>

          <div className="mt-3 rounded-xl border border-[#E5D8C8] p-4">

            <div className="flex items-start justify-between">

              <div>

                <p className="font-mono font-bold text-[#2B241E]">
                  Token {selectedTable.token}
                </p>

                <p className="mt-2 text-sm text-[#766A5D]">
                  {selectedTable.items
                    .map(
                      (item) =>
                        `${item.name} ×${item.quantity}`
                    )
                    .join(", ")}
                </p>

                <p className="mt-3 font-bold text-[#2B241E]">
                  ₹{selectedTable.bill}
                </p>

              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-sm font-semibold text-[#C87810]"
              >
                <Receipt size={14} />
                Receipt
              </button>

            </div>

          </div>

          <div className="mt-5 flex gap-3">

            <button
              type="button"
              onClick={() => openModal("qr", selectedTable)}
              className="flex-1 rounded-xl border border-[#E5D8C8] bg-white px-4 py-3 font-semibold text-[#332D27]"
            >
              📱 View Table QR
            </button>

            <button
              type="button"
              onClick={closeAndVacate}
              className="flex-1 rounded-xl bg-[#292621] px-4 py-3 font-semibold text-white"
            >
              ✓ Close & Vacate Session
            </button>

          </div>

        </Modal>
      )}

      {/* EDIT MODAL */}
      {modal === "edit" && selectedTable && (
        <EditTableModal
          table={selectedTable}
          onClose={closeModal}
          onSave={(updatedTable) => {
            setTables((current) =>
              current.map((table) =>
                table.id === selectedTable.id
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

/* -------------------------------------------------- */
/* TABLE CARD */
/* -------------------------------------------------- */

function TableCard({
  table,
  onQr,
  onEdit,
  onDelete,
  onDetails,
  onClose,
}) {
  const occupied = table.status !== "Available";

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
        occupied
          ? "border-t-4 border-t-[#D88620]"
          : "border-[#E5D8C8]"
      }`}
    >

      <div className="p-5">

        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-lg font-bold text-[#2B241E]">
              {table.name}
            </h2>

            <p className="mt-1 text-xs text-[#766A5D]">
              {table.seats} Seats · {table.section}
            </p>

          </div>

          <StatusBadge status={table.status} />

        </div>

        <div className="mt-2 flex items-center justify-end gap-3 text-xs">

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-[#665D53] hover:text-[#C87810]"
          >
            <Pencil size={12} />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 text-[#C86A5D]"
          >
            <Trash2 size={12} />
            Delete
          </button>

        </div>

        {occupied ? (
          <>
            <p className="mt-3 text-xs text-[#766A5D]">
              Tokens: {table.token}
            </p>

            <div className="mt-3 flex items-center justify-between rounded-lg bg-[#EEE9DE] p-3">

              <div>
                <p className="text-[11px] uppercase text-[#8A8074]">
                  Accumulated Bill
                </p>

                <p className="font-semibold text-[#C87810]">
                  ₹{table.bill}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-[#8A8074]">
                  Session
                </p>

                <p className="font-semibold text-[#332D27]">
                  {table.duration}
                </p>
              </div>

            </div>

            <div className="mt-3 flex gap-2">

              <button
                type="button"
                onClick={onDetails}
                className="flex-1 rounded-lg bg-[#292621] px-3 py-2 text-xs font-bold text-white"
              >
                Session Details
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-[#E5D8C8] px-3 py-2 text-xs font-semibold text-[#332D27]"
              >
                Close
              </button>

            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-sm text-[#766A5D]">
              Table clear & ready for next guests.
            </p>

            <button
              type="button"
              onClick={onQr}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5D8C8] px-3 py-2.5 text-sm font-semibold text-[#332D27] hover:bg-[#FFF8EE]"
            >
              <QrCode size={14} />
              View Table QR
            </button>
          </>
        )}

      </div>

    </div>
  );
}

/* -------------------------------------------------- */
/* STATUS */
/* -------------------------------------------------- */

function StatusBadge({ status }) {
  const occupied = status !== "Available";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
        occupied
          ? "bg-[#FFF0C9] text-[#C87810]"
          : "bg-[#EEEAE0] text-[#665D53]"
      }`}
    >
      {status}
    </span>
  );
}

/* -------------------------------------------------- */
/* MODAL */
/* -------------------------------------------------- */

function Modal({ children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">

      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ${
          wide ? "max-w-[600px]" : "max-w-[470px]"
        }`}
      >
        {children}
      </div>

    </div>
  );
}

function ModalHeader({ title, onClose }) {
  return (
    <div className="mb-2 flex items-center justify-between">

      <h2 className="text-xl font-bold text-[#2B241E]">
        {title}
      </h2>

      <button
        type="button"
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5D8C8] text-[#4F463D] hover:bg-[#F7F3ED]"
      >
        <X size={18} />
      </button>

    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">

      <span className="mb-2 block text-sm font-semibold text-[#5F554B]">
        {label}
      </span>

      {children}

    </label>
  );
}

/* -------------------------------------------------- */
/* EDIT MODAL */
/* -------------------------------------------------- */

function EditTableModal({ table, onClose, onSave }) {
  const [name, setName] = useState(table.name);
  const [seats, setSeats] = useState(String(table.seats));
  const [section, setSection] = useState(table.section);

  return (
    <Modal onClose={onClose}>

      <ModalHeader
        title={`Edit ${table.name}`}
        onClose={onClose}
      />

      <div className="mt-5 space-y-5">

        <FormField label="Table Name / Number">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-style"
          />
        </FormField>

        <FormField label="Seating Capacity">
          <select
            value={seats}
            onChange={(event) => setSeats(event.target.value)}
            className="input-style"
          >
            <option value="2">2 Seats</option>
            <option value="4">4 Seats (Standard)</option>
            <option value="6">6 Seats</option>
            <option value="8">8 Seats</option>
          </select>
        </FormField>

        <FormField label="Restaurant Section">
          <select
            value={section}
            onChange={(event) => setSection(event.target.value)}
            className="input-style"
          >
            <option>Indoor Main</option>
            <option>Outdoor Terrace</option>
          </select>
        </FormField>

      </div>

      <div className="mt-7 flex gap-3">

        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-[#E5D8C8] px-4 py-3 font-semibold text-[#332D27]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() =>
            onSave({
              name,
              seats: Number(seats),
              section,
            })
          }
          className="flex-1 rounded-xl bg-[#292621] px-4 py-3 font-semibold text-white"
        >
          Save Changes
        </button>

      </div>

    </Modal>
  );
}

export default TableSessionsPage;