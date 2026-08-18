import { useMemo, useRef, useState } from "react";
import {
  Plus,
  X,
  Camera,
  Package,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  AlertTriangle,
  ChevronRight,
  UtensilsCrossed,
  Boxes,
  CircleDollarSign,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Sweet Lassi",
    description: "Chilled, thick, topped with malai",
    price: 30,
    category: "Cold Drinks",
    stock: 8,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
  {
    id: 2,
    name: "Iced Coffee",
    description: "Cold-brewed, served over ice",
    price: 25,
    category: "Cold Drinks",
    stock: 86,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
  {
    id: 3,
    name: "Samosa",
    description: "Crisp, served with tamarind chutney",
    price: 15,
    category: "Snacks",
    stock: 8,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
  {
    id: 4,
    name: "Bun Maska",
    description: "Soft bun, generous butter",
    price: 8,
    category: "Snacks",
    stock: 65,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
  {
    id: 5,
    name: "Vada Pav",
    description: "Spiced potato fritter, garlic chutney",
    price: 20,
    category: "Snacks",
    stock: 72,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
  {
    id: 6,
    name: "Jalebi",
    description: "Crispy jalebi soaked in sugar syrup",
    price: 35,
    category: "Sweets",
    stock: 30,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
  {
    id: 7,
    name: "Cutting Chai",
    description: "Strong ginger and cardamom tea",
    price: 8,
    category: "Tea & Coffee",
    stock: 100,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
  {
    id: 8,
    name: "Masala Tea",
    description: "Indian spiced tea",
    price: 10,
    category: "Tea & Coffee",
    stock: 100,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
  {
    id: 9,
    name: "Filter Coffee",
    description: "South Indian filter coffee",
    price: 15,
    category: "Tea & Coffee",
    stock: 60,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
  {
    id: 10,
    name: "Diet Coke",
    description: "Chilled soft drink",
    price: 55,
    category: "Drink",
    stock: 50,
    unlimited: false,
    vegetarian: true,
    active: true,
    image:
      "https://qrcode-ac0d.onrender.com/uploads/item-1786620336483-8213466444.jpg",
  },
];

const CATEGORIES = [
  "All",
  "Tea & Coffee",
  "Snacks",
  "Cold Drinks",
  "Sweets",
  "Drink",
];

const INPUT_CLASS = `
  h-10.5
  w-full
  rounded-[10px]
  border
  border-[#DDD2C6]
  bg-white
  px-3
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
`;

const LABEL_CLASS = `
  mb-1.5
  block
  text-[9px]
  font-bold
  uppercase
  tracking-[0.1em]
  text-[#756A60]
`;

function MenuManagerPage() {
  const [items, setItems] =
    useState(INITIAL_ITEMS);

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState(null);

  const [showOnlyActive, setShowOnlyActive] =
    useState(false);

  const filteredItems = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.name
          .toLowerCase()
          .includes(query) ||
        item.description
          .toLowerCase()
          .includes(query) ||
        item.category
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        item.category ===
          selectedCategory;

      const matchesActive =
        !showOnlyActive ||
        item.active;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesActive
      );
    });
  }, [
    items,
    search,
    selectedCategory,
    showOnlyActive,
  ]);

  const activeItems =
    items.filter(
      (item) => item.active
    );

  const lowStockItems =
    items.filter(
      (item) =>
        !item.unlimited &&
        item.stock <= 10
    );

  const totalValue =
    items.reduce(
      (sum, item) =>
        sum +
        (item.unlimited
          ? 0
          : item.price * item.stock),
      0
    );

  const openAddModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const saveItem = (itemData) => {
    if (editingItem) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...itemData,
              }
            : item
        )
      );
    } else {
      setItems((current) => [
        ...current,
        {
          ...itemData,
          id: Date.now(),
        },
      ]);
    }

    closeModal();
  };

  const deleteItem = (id) => {
    const item = items.find(
      (entry) => entry.id === id
    );

    if (!item) return;

    const confirmed =
      window.confirm(
        `Delete "${item.name}" from the menu?`
      );

    if (!confirmed) return;

    setItems((current) =>
      current.filter(
        (entry) => entry.id !== id
      )
    );
  };

  const toggleActive = (id) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              active: !item.active,
            }
          : item
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
            <UtensilsCrossed
              size={17}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h1 className="truncate text-[19px] font-bold tracking-[-0.03em] text-[#29251F]">
                Menu
              </h1>

              <span className="rounded-full bg-[#E8F5F0] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#237762]">
                {activeItems.length} live
              </span>

            </div>

            <p className="mt-0.5 truncate text-[11px] text-[#81766B]">
              Control what customers can order
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="
            inline-flex
            h-9
            items-center
            gap-1.5
            rounded-lg
            bg-[#292621]
            px-3.5
            text-[11px]
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
          Add item
        </button>

      </div>


      {/* =====================================================
          OPERATIONAL STRIP
      ===================================================== */}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">

        <MiniStat
          icon={UtensilsCrossed}
          label="Menu items"
          value={items.length}
          sub={`${activeItems.length} available`}
          iconClass="bg-[#F4E7D1] text-[#C67B16]"
        />

        <MiniStat
          icon={Boxes}
          label="Low stock"
          value={lowStockItems.length}
          sub={
            lowStockItems.length
              ? "Needs attention"
              : "Everything healthy"
          }
          iconClass={
            lowStockItems.length
              ? "bg-[#FFF0D7] text-[#D58914]"
              : "bg-[#E5F4EE] text-[#23836D]"
          }
        />

        <MiniStat
          icon={Eye}
          label="Customer visible"
          value={activeItems.length}
          sub={`of ${items.length} items`}
          iconClass="bg-[#E7F4EF] text-[#24856E]"
        />

        <MiniStat
          icon={CircleDollarSign}
          label="Stock value"
          value={`₹${totalValue}`}
          sub="Current inventory"
          iconClass="bg-[#EEE9E2] text-[#5D554D]"
        />

      </div>


      {/* =====================================================
          SEARCH / FILTERS
      ===================================================== */}

      <div className="mb-3 flex flex-col gap-2.5 lg:flex-row">

        <div className="relative flex-1">

          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8F84]"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search items, categories..."
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
              text-[#29251F]
              outline-none
              transition
              placeholder:text-[#A59A8E]
              focus:border-[#D89A3D]
              focus:ring-2
              focus:ring-[#E6A23C]/10
            "
          />

        </div>


        <button
          type="button"
          onClick={() =>
            setShowOnlyActive(
              (current) => !current
            )
          }
          className={`inline-flex h-10.5 items-center justify-center gap-1.5 rounded-[10px] border px-3.5 text-[11px] font-semibold transition ${
            showOnlyActive
              ? "border-[#292621] bg-[#292621] text-white"
              : "border-[#DDD2C6] bg-white text-[#5E554C] hover:bg-[#FCF8F2]"
          }`}
        >
          {showOnlyActive ? (
            <Eye size={14} />
          ) : (
            <EyeOff size={14} />
          )}

          {showOnlyActive
            ? "Available only"
            : "All availability"}
        </button>


        <button
          type="button"
          className="inline-flex h-10.5 items-center justify-center gap-1.5 rounded-[10px] border border-[#DDD2C6] bg-white px-3.5 text-[11px] font-semibold text-[#5E554C] transition hover:bg-[#FCF8F2]"
        >
          <SlidersHorizontal
            size={14}
          />

          Filters
        </button>

      </div>


      {/* =====================================================
          CATEGORY RAIL
      ===================================================== */}

      <div className="mb-4 overflow-x-auto pb-1">

        <div className="flex min-w-max gap-1.5">

          {CATEGORIES.map(
            (category) => {

              const count =
                category === "All"
                  ? items.length
                  : items.filter(
                      (item) =>
                        item.category ===
                        category
                    ).length;

              const selected =
                selectedCategory ===
                category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                    selected
                      ? "border-[#292621] bg-[#292621] text-white shadow-sm"
                      : "border-[#DDD2C6] bg-white text-[#6D6257] hover:border-[#CFC1B2] hover:bg-[#FCF8F2]"
                  }`}
                >
                  {category}

                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      selected
                        ? "bg-white/10 text-[#F0B348]"
                        : "bg-[#F3EEE8] text-[#8B7F73]"
                    }`}
                  >
                    {count}
                  </span>

                </button>
              );
            }
          )}

        </div>

      </div>


      {/* =====================================================
          WORKSPACE
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">

        <div className="min-w-0">

          {filteredItems.length >
          0 ? (

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">

              {filteredItems.map(
                (item) => (

                  <MenuCard
                    key={item.id}
                    item={item}
                    onEdit={() =>
                      openEditModal(item)
                    }
                    onDelete={() =>
                      deleteItem(item.id)
                    }
                    onToggle={() =>
                      toggleActive(
                        item.id
                      )
                    }
                  />

                )
              )}

            </div>

          ) : (

            <EmptyMenu
              search={search}
              onAdd={openAddModal}
            />

          )}

        </div>


        {/* ===================================================
            MENU PULSE
        =================================================== */}

        <aside className="h-fit overflow-hidden rounded-[16px] bg-[#292621] text-white shadow-[0_10px_28px_rgba(31,27,22,0.13)]">

          <div className="border-b border-white/[0.08] px-4 py-3.5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2.5">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6A23C] text-[#292015]">
                  <Sparkles size={14} />
                </div>

                <div>

                  <h2 className="text-[12px] font-bold">
                    Menu pulse
                  </h2>

                  <p className="mt-0.5 text-[9px] text-[#AFA69C]">
                    Quick operational view
                  </p>

                </div>

              </div>

              <ArrowUpRight
                size={14}
                className="text-[#E6A23C]"
              />

            </div>

          </div>


          <div className="p-3">

            <div
              className={`rounded-[12px] border p-3 ${
                lowStockItems.length
                  ? "border-[#6D512A] bg-[#352C20]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >

              <div className="flex items-start gap-2.5">

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    lowStockItems.length
                      ? "bg-[#F5B447] text-[#382610]"
                      : "bg-[#214D43] text-[#55D0B0]"
                  }`}
                >
                  {lowStockItems.length ? (
                    <AlertTriangle
                      size={15}
                    />
                  ) : (
                    <Check size={15} />
                  )}
                </div>

                <div>

                  <p className="text-[11px] font-bold">
                    {lowStockItems.length
                      ? `${lowStockItems.length} item${
                          lowStockItems.length >
                          1
                            ? "s"
                            : ""
                        } need attention`
                      : "Menu looks healthy"}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-[#9B9289]">
                    {lowStockItems.length
                      ? "Review low-stock items before the next rush."
                      : "No immediate stock issues detected."}
                  </p>

                </div>

              </div>

            </div>

          </div>


          <div className="border-t border-white/10">

            <div className="px-4 py-2.5">

              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#938A81]">
                Menu structure
              </p>

            </div>


            {CATEGORIES.filter(
              (category) =>
                category !== "All"
            ).map((category) => {

              const count =
                items.filter(
                  (item) =>
                    item.category ===
                    category
                ).length;

              if (!count) return null;

              return (
                <div
                  key={category}
                  className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5"
                >

                  <span className="text-[10px] text-[#B1A9A0]">
                    {category}
                  </span>

                  <span className="text-[10px] font-bold text-white">
                    {count}
                  </span>

                </div>
              );
            })}

          </div>


          <div className="border-t border-white/10 p-3">

            <div className="rounded-[10px] bg-white/[0.035] p-2.5">

              <div className="flex gap-2">

                <Sparkles
                  size={12}
                  className="mt-0.5 shrink-0 text-[#E6A23C]"
                />

                <p className="text-[9px] leading-4 text-[#938B83]">
                  Keep unavailable items hidden instead of deleting them. You can bring them back instantly when stock returns.
                </p>

              </div>

            </div>

          </div>

        </aside>

      </div>


      {modalOpen && (
        <MenuItemDrawer
          item={editingItem}
          onClose={closeModal}
          onSave={saveItem}
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

          <p className="text-[16px] font-bold tracking-[-0.02em] text-[#29251F]">
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
   MENU CARD
============================================================= */

function MenuCard({
  item,
  onEdit,
  onDelete,
  onToggle,
}) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const stockState =
    getStockState(item);

  return (
    <div
      className={`group relative overflow-visible rounded-[14px] border bg-white shadow-[0_4px_16px_rgba(54,43,30,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(54,43,30,0.075)] ${
        item.active
          ? "border-[#E0D5C8]"
          : "border-[#E8DDD2] opacity-75"
      }`}
    >

      {/* Image */}

      <div className="relative h-[135px] overflow-hidden rounded-t-[14px] bg-[#EEE8E0]">

        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.025] ${
              item.active
                ? ""
                : "grayscale"
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#A49A8F]">
            <Package size={28} />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />


        {/* Availability */}

        <div className="absolute left-2.5 top-2.5">

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold backdrop-blur-md ${
              item.active
                ? "bg-[#E9F8F1]/95 text-[#1C765F]"
                : "bg-[#292621]/85 text-white"
            }`}
          >

            <span
              className={`h-1.5 w-1.5 rounded-full ${
                item.active
                  ? "bg-[#2DA983]"
                  : "bg-[#B5ACA2]"
              }`}
            />

            {item.active
              ? "Available"
              : "Hidden"}

          </span>

        </div>


        {/* More */}

        <div className="absolute right-2.5 top-2.5">

          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current
              )
            }
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-[#3C362F] shadow-sm backdrop-blur-md transition hover:bg-white"
          >
            <MoreHorizontal
              size={15}
            />
          </button>


          {menuOpen && (

            <div className="absolute right-0 top-9 z-30 w-32 overflow-hidden rounded-lg border border-[#E3D7C9] bg-white py-1 shadow-xl">

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[10px] font-semibold text-[#4B443D] hover:bg-[#F7F3ED]"
              >
                <Pencil size={12} />
                Edit item
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[10px] font-semibold text-[#C94B43] hover:bg-[#FFF1EF]"
              >
                <Trash2 size={12} />
                Delete
              </button>

            </div>

          )}

        </div>

      </div>


      {/* Content */}

      <div className="p-3">

        <div className="flex items-start justify-between gap-2.5">

          <div className="min-w-0">

            <div className="flex items-center gap-1.5">

              <h3 className="truncate text-[13px] font-bold text-[#29251F]">
                {item.name}
              </h3>

              {item.vegetarian && (
                <span
                  title="Vegetarian"
                  className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-[#23836D] text-[#23836D]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#23836D]" />
                </span>
              )}

            </div>

            <p className="mt-0.5 truncate text-[10px] text-[#85796D]">
              {item.description}
            </p>

          </div>

          <p className="shrink-0 text-[15px] font-bold tracking-[-0.02em] text-[#29251F]">
            ₹{item.price}
          </p>

        </div>


        <div className="mt-3 flex items-center justify-between gap-2">

          <div className="flex min-w-0 items-center gap-1.5">

            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[8px] font-bold ${stockState.className}`}
            >
              <Package size={10} />
              {stockState.label}
            </span>

            <span className="truncate text-[8px] font-semibold text-[#A0968B]">
              {item.category}
            </span>

          </div>


          <button
            type="button"
            onClick={onToggle}
            title={
              item.active
                ? "Hide item"
                : "Make available"
            }
            className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition ${
              item.active
                ? "bg-[#278B74]"
                : "bg-[#C8C0B6]"
            }`}
          >
            <span
              className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition ${
                item.active
                  ? "left-[19px]"
                  : "left-[3px]"
              }`}
            />
          </button>

        </div>


        <button
          type="button"
          onClick={onEdit}
          className="mt-2.5 flex h-8 w-full items-center justify-between rounded-lg border border-[#E8DED3] bg-[#FCFAF7] px-2.5 text-[10px] font-semibold text-[#5C544C] transition hover:border-[#D9C9B8] hover:bg-[#F7F1E9]"
        >
          <span>
            Manage item
          </span>

          <ChevronRight
            size={13}
          />
        </button>

      </div>

    </div>
  );
}


/* =============================================================
   STOCK STATE
============================================================= */

function getStockState(item) {

  if (item.unlimited) {
    return {
      label: "Unlimited",
      className:
        "bg-[#E9F4EF] text-[#277762]",
    };
  }

  if (item.stock === 0) {
    return {
      label: "Out of stock",
      className:
        "bg-[#FBE7E4] text-[#C84D45]",
    };
  }

  if (item.stock <= 10) {
    return {
      label: `${item.stock} left`,
      className:
        "bg-[#FFF0D6] text-[#C77A0D]",
    };
  }

  return {
    label: `${item.stock} in stock`,
    className:
      "bg-[#F1ECE5] text-[#6D6257]",
  };
}


/* =============================================================
   EMPTY
============================================================= */

function EmptyMenu({
  search,
  onAdd,
}) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[16px] border border-dashed border-[#DCCFC0] bg-white px-6 text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5EBDD] text-[#C77C1F]">
        {search ? (
          <Search size={20} />
        ) : (
          <UtensilsCrossed
            size={20}
          />
        )}
      </div>

      <h3 className="mt-3 text-[14px] font-bold text-[#302B26]">
        {search
          ? "No matching items"
          : "Your menu is empty"}
      </h3>

      <p className="mt-1 max-w-sm text-[11px] leading-4 text-[#8B7F73]">
        {search
          ? "Try another item name or category."
          : "Add your first menu item and make it available to customers."}
      </p>

      {!search && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#292621] px-3.5 py-2 text-[11px] font-semibold text-white"
        >
          <Plus size={13} />
          Add first item
        </button>
      )}

    </div>
  );
}


/* =============================================================
   DRAWER
============================================================= */

function MenuItemDrawer({
  item,
  onClose,
  onSave,
}) {

  const fileInputRef =
    useRef(null);

  const isEditing =
    Boolean(item);

  const [form, setForm] =
    useState({
      name: item?.name || "",
      description:
        item?.description || "",
      price:
        item?.price ?? "",
      category:
        item?.category || "",
      stock:
        item?.stock ?? "",
      unlimited:
        item?.unlimited ?? true,
      vegetarian:
        item?.vegetarian ?? true,
      active:
        item?.active ?? true,
      image:
        item?.image || "",
    });

  const [imageName, setImageName] =
    useState("");

  const updateField = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImage = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    setImageName(file.name);

    const previewUrl =
      URL.createObjectURL(file);

    updateField(
      "image",
      previewUrl
    );
  };

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();

    if (!form.name.trim()) {
      alert(
        "Please enter item name."
      );
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      alert(
        "Please enter a valid item price."
      );
      return;
    }

    if (!form.category.trim()) {
      alert(
        "Please select a category."
      );
      return;
    }

    if (
      !form.unlimited &&
      form.stock === ""
    ) {
      alert(
        "Please enter stock quantity."
      );
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      description:
        form.description.trim(),
      price: Number(form.price),
      stock: form.unlimited
        ? 0
        : Math.max(
            0,
            Number(form.stock)
          ),
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


        {/* Drawer header */}

        <div className="flex shrink-0 items-center justify-between border-b border-[#E7DDD2] bg-[#FCFAF7] px-5 py-4">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <h2 className="text-[17px] font-bold tracking-[-0.025em] text-[#29251F]">
                {isEditing
                  ? "Edit item"
                  : "New menu item"}
              </h2>

              <span className="rounded-full bg-[#F2E7D7] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#A96C16]">
                {isEditing
                  ? "Editing"
                  : "Menu"}
              </span>

            </div>

            <p className="mt-0.5 text-[10px] text-[#8B7F73]">
              Keep your customer menu accurate and ready.
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#DED3C8] bg-white text-[#645B53] transition hover:border-[#CFC1B4] hover:bg-[#F7F3ED]"
          >
            <X size={15} />
          </button>

        </div>


        {/* Drawer body */}

        <form
          id="menu-item-form"
          onSubmit={
            handleSubmit
          }
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
        >


          {/* IMAGE */}

          <section className="mb-6">

            <div className="mb-3">

              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#B17A30]">
                Visual
              </p>

              <h3 className="mt-0.5 text-[14px] font-bold text-[#37312B]">
                Item image
              </h3>

              <p className="mt-0.5 text-[10px] leading-4 text-[#93887D]">
                Give customers a clear picture of what they are ordering.
              </p>

            </div>


            <input
              ref={
                fileInputRef
              }
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={
                handleImage
              }
              className="hidden"
            />


            {form.image ? (

              <div className="group relative overflow-hidden rounded-[14px] border border-[#DCCFC1] bg-[#EEE8E0] shadow-[0_5px_16px_rgba(54,43,30,0.05)]">

                <img
                  src={form.image}
                  alt="Current item"
                  className="h-[165px] w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3.5 pb-3.5 pt-10">

                  <div className="min-w-0">

                    <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-white/65">
                      Current item image
                    </p>

                    <p className="mt-0.5 max-w-[250px] truncate text-[10px] font-semibold text-white">
                      {imageName ||
                        "Image preview"}
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() => {

                      updateField(
                        "image",
                        ""
                      );

                      setImageName("");

                      if (
                        fileInputRef.current
                      ) {
                        fileInputRef.current.value =
                          "";
                      }

                    }}
                    className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-[9px] font-bold text-[#C64C43] shadow-sm transition hover:bg-[#FFF7F5]"
                  >
                    Remove
                  </button>

                </div>

              </div>

            ) : (

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex min-h-[165px] w-full flex-col items-center justify-center rounded-[14px] border border-dashed border-[#D8CABC] bg-[#F8F4EE] px-5 py-7 transition hover:border-[#D0B99B] hover:bg-[#F5EFE7]"
              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E5D4] text-[#C47A18]">
                  <Camera size={17} />
                </div>

                <span className="mt-2.5 text-[11px] font-bold text-[#B97012]">
                  Upload food image
                </span>

                <span className="mt-1 text-[9px] text-[#91867A]">
                  PNG, JPG or WEBP · up to 5MB
                </span>

              </button>

            )}

          </section>


          {/* DETAILS */}

          <section className="mb-6">

            <div className="mb-3">

              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#B17A30]">
                Details
              </p>

              <h3 className="mt-0.5 text-[14px] font-bold text-[#37312B]">
                Item information
              </h3>

              <p className="mt-0.5 text-[10px] leading-4 text-[#93887D]">
                These details appear throughout the customer ordering experience.
              </p>

            </div>


            <div className="space-y-3.5">

              <div>

                <label className={LABEL_CLASS}>
                  Item name
                  <span className="ml-1 text-[#C57A17]">
                    *
                  </span>
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Masala Chai"
                  className={INPUT_CLASS}
                />

              </div>


              <div>

                <label className={LABEL_CLASS}>
                  Description
                </label>

                <textarea
                  value={
                    form.description
                  }
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Short description customers will see"
                  rows={3}
                  className={`${INPUT_CLASS} h-auto resize-none py-2.5 leading-5`}
                />

              </div>


              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">

                <div>

                  <label className={LABEL_CLASS}>
                    Price
                    <span className="ml-1 text-[#C57A17]">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#756A60]">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) =>
                        updateField(
                          "price",
                          event.target.value
                        )
                      }
                      placeholder="15"
                      className={`${INPUT_CLASS} pl-7`}
                    />

                  </div>

                </div>


                <div>

                  <label className={LABEL_CLASS}>
                    Category
                    <span className="ml-1 text-[#C57A17]">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <select
                      value={
                        form.category
                      }
                      onChange={(event) =>
                        updateField(
                          "category",
                          event.target.value
                        )
                      }
                      className={`${INPUT_CLASS} appearance-none pr-9`}
                    >

                      <option value="">
                        Select category
                      </option>

                      {CATEGORIES.filter(
                        (category) =>
                          category !==
                          "All"
                      ).map(
                        (category) => (
                          <option
                            key={category}
                            value={
                              category
                            }
                          >
                            {category}
                          </option>
                        )
                      )}

                    </select>

                    <ChevronRight
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#766B61]"
                    />

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* INVENTORY */}

          <section className="mb-6">

            <div className="mb-3">

              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#B17A30]">
                Operations
              </p>

              <h3 className="mt-0.5 text-[14px] font-bold text-[#37312B]">
                Inventory
              </h3>

              <p className="mt-0.5 text-[10px] leading-4 text-[#93887D]">
                Decide how stock should be tracked for this item.
              </p>

            </div>


            <div className="overflow-hidden rounded-[14px] border border-[#E2D7CB] bg-white shadow-[0_3px_12px_rgba(54,43,30,0.025)]">

              <div className="flex items-center justify-between gap-4 px-3.5 py-3.5">

                <div className="flex min-w-0 items-center gap-2.5">

                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      form.unlimited
                        ? "bg-[#F5EAD8] text-[#C47A18]"
                        : "bg-[#E9F4EF] text-[#27846D]"
                    }`}
                  >
                    <Boxes size={14} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[11px] font-bold text-[#3B342D]">
                      Unlimited inventory
                    </p>

                    <p className="mt-0.5 text-[9px] leading-4 text-[#93887D]">
                      Treat this item as always available.
                    </p>

                  </div>

                </div>


                <PremiumToggle
                  checked={
                    form.unlimited
                  }
                  onChange={() =>
                    updateField(
                      "unlimited",
                      !form.unlimited
                    )
                  }
                  color="gold"
                />

              </div>


              {!form.unlimited && (

                <div className="border-t border-[#EEE5DC] bg-[#FAF7F2] px-3.5 py-3.5">

                  <label className={LABEL_CLASS}>
                    Available quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.stock
                    }
                    onChange={(event) =>
                      updateField(
                        "stock",
                        event.target.value
                      )
                    }
                    placeholder="e.g. 60"
                    className={INPUT_CLASS}
                  />

                </div>

              )}

            </div>

          </section>


          {/* VISIBILITY */}

          <section>

            <div className="mb-3">

              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#B17A30]">
                Customer experience
              </p>

              <h3 className="mt-0.5 text-[14px] font-bold text-[#37312B]">
                Visibility & labels
              </h3>

            </div>


            <div className="overflow-hidden rounded-[14px] border border-[#E2D7CB] bg-white shadow-[0_3px_12px_rgba(54,43,30,0.025)]">

              <PremiumToggleRow
                icon={Eye}
                title="Available to customers"
                description="Customers can order this item."
                checked={
                  form.active
                }
                onChange={() =>
                  updateField(
                    "active",
                    !form.active
                  )
                }
              />

              <PremiumToggleRow
                icon={Check}
                title="Vegetarian"
                description="Show the vegetarian indicator."
                checked={
                  form.vegetarian
                }
                onChange={() =>
                  updateField(
                    "vegetarian",
                    !form.vegetarian
                  )
                }
                last
              />

            </div>

          </section>


          <div className="h-20" />

        </form>


        {/* STICKY FOOTER */}

        <div className="shrink-0 border-t border-[#E7DDD2] bg-[#FCFAF7]/95 px-5 py-3.5 backdrop-blur-md">

          <div className="flex gap-2.5">

            <button
              type="button"
              onClick={onClose}
              className="h-9 flex-1 rounded-lg border border-[#DED3C7] bg-white px-3 text-[10px] font-bold text-[#554C44] transition hover:border-[#CFC1B4] hover:bg-[#F7F3ED]"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="menu-item-form"
              className="h-9 flex-[1.35] rounded-lg bg-[#292621] px-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#1F1D1A]"
            >
              {isEditing
                ? "Save changes"
                : "Add to menu"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =============================================================
   TOGGLE
============================================================= */

function PremiumToggle({
  checked,
  onChange,
  color = "green",
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`relative h-[24px] w-[41px] shrink-0 rounded-full outline-none transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-[#D49A48]/20 ${
        checked
          ? color === "gold"
            ? "bg-[#D99831]"
            : "bg-[#278F77]"
          : "bg-[#C9C1B8]"
      }`}
    >

      <span
        className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.20)] transition-all duration-200 ${
          checked
            ? "left-[20px]"
            : "left-[3px]"
        }`}
      />

    </button>
  );
}


/* =============================================================
   TOGGLE ROW
============================================================= */

function PremiumToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  last = false,
}) {
  return (
    <div
      className={`flex min-h-[64px] items-center justify-between gap-4 px-3.5 py-3 ${
        !last
          ? "border-b border-[#EEE5DC]"
          : ""
      }`}
    >

      <div className="flex min-w-0 items-center gap-2.5">

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            checked
              ? "bg-[#E5F3EE] text-[#25836D]"
              : "bg-[#F1ECE6] text-[#92877C]"
          }`}
        >
          <Icon size={14} />
        </div>

        <div className="min-w-0">

          <p className="text-[11px] font-bold leading-4 text-[#3B342D]">
            {title}
          </p>

          <p className="mt-0.5 truncate text-[9px] leading-4 text-[#93887D]">
            {description}
          </p>

        </div>

      </div>


      <PremiumToggle
        checked={checked}
        onChange={onChange}
      />

    </div>
  );
}


export default MenuManagerPage;