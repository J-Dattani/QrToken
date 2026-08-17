import {
  ShoppingBag,
  ChefHat,
  ClipboardList,
  Utensils,
  TicketPercent,
  BarChart3,
  Settings,
  LogOut,
  Clock3,
  Wallet,
  RotateCcw,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    section: "TODAY",
    items: [
      {
        label: "Live Orders",
        icon: ShoppingBag,
        path: "/owner/orders",
        badge: "Live",
      },
      {
        label: "Kitchen Queue",
        icon: ChefHat,
        path: "/owner/kitchen",
      },
      {
        label: "Manual Entry",
        icon: ClipboardList,
        path: "/owner/manual",
      },
      {
        label: "Table Sessions",
        icon: Utensils,
        path: "/owner/tables",
      },
    ],
  },

  {
    section: "MONEY",
    items: [
      {
        label: "Cash Management",
        icon: Wallet,
        path: "/owner/cash",
      },
      {
        label: "Cash Reconciliation",
        icon: Clock3,
        path: "/owner/reconciliation",
      },
      {
        label: "Refunds",
        icon: RotateCcw,
        path: "/owner/refunds",
      },
    ],
  },

  {
    section: "SHOP",
    items: [
      {
        label: "Menu Manager",
        icon: Utensils,
        path: "/owner/menu",
      },
      {
        label: "Coupons",
        icon: TicketPercent,
        path: "/owner/coupons",
      },
      {
        label: "Analytics",
        icon: BarChart3,
        path: "/owner/analytics",
      },
      {
        label: "Settings",
        icon: Settings,
        path: "/owner/settings",
      },
    ],
  },
];

function OwnerSidebar() {

  return (
    <aside className="hidden h-screen w-[238px] shrink-0 overflow-hidden bg-[#1D1B18] text-white lg:flex">

      {/* EVERYTHING INSIDE THIS SCROLLS */}
      <div className="sidebar-scroll h-full w-full overflow-y-auto">

        {/* Brand */}
        <div className="px-4 pt-5">

          <div className="flex items-center gap-3 border-b border-white/10 pb-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6A23C] text-xl font-bold text-[#211B14]">
              Q
            </div>

            <div>
              <h1 className="text-sm font-bold">
                QRToken.in
              </h1>

              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Owner Dashboard
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}
        <nav className="mt-5 px-4">

          {navigation.map((group) => (

            <div
              key={group.section}
              className="mb-6"
            >

              <p className="mb-2 px-2 text-[10px] font-medium tracking-widest text-gray-500">
                {group.section}
              </p>

              <div className="space-y-1">

                {group.items.map((item) => {

                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      className={({ isActive }) =>
                        `
                        group
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        transition
                        ${
                          isActive
                            ? "bg-[#3A3733] text-white"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }
                        `
                      }
                    >

                      <Icon
                        size={17}
                        strokeWidth={1.8}
                        className="shrink-0"
                      />

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {item.badge && (
                        <span className="rounded-full bg-[#E6A23C] px-2 py-0.5 text-[10px] font-bold text-[#241B10]">
                          {item.badge}
                        </span>
                      )}

                    </NavLink>
                  );

                })}

              </div>

            </div>

          ))}

        </nav>

        {/* Merchant */}
        <div className="px-4">

          <div className="border-t border-white/10 pt-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6A23C] text-xs font-bold text-[#241B10]">
                SK
              </div>

              <div className="min-w-0">

                <p className="truncate text-xs font-semibold text-white">
                  Shree Krishna Tea Stall
                </p>

                <p className="text-[10px] text-gray-500">
                  Rajkot, Gujarat · starter plan
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => {
            // Logout logic later
          }}
          className="
            mx-4
            mb-5
            mt-4
            flex
            items-center
            gap-3
            rounded-xl
            px-2
            py-2
            text-sm
            text-gray-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >

          <LogOut size={17} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}

export default OwnerSidebar;