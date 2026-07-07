import {
  LayoutDashboard,
  Users,
  Bus,
  Route,
  Ticket,
  CreditCard,
  BadgePercent,
  RotateCcw,
  MessageSquare,
  FileBarChart2,
  Settings,
} from "lucide-react";

import AppLogo from "./AppLogo";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    icon: Users,
  },
  {
    title: "Admins",
    icon: Users,
  },
  {
    title: "Buses",
    icon: Bus,
  },
  {
    title: "Routes",
    icon: Route,
  },
  {
    title: "Bookings",
    icon: Ticket,
  },
  {
    title: "Payments",
    icon: CreditCard,
  },
  {
    title: "Coupons",
    icon: BadgePercent,
  },
  {
    title: "Refunds",
    icon: RotateCcw,
  },
  {
    title: "Reviews",
    icon: MessageSquare,
  },
  {
    title: "Reports",
    icon: FileBarChart2,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="hidden w-72 flex-col bg-slate-900 lg:flex">
      <div className="border-b border-slate-800 p-6">
        <AppLogo />
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <button
              key={menu.title}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <Icon size={20} />

              <span>{menu.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;