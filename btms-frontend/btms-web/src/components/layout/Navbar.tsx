import { Bell, Search } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Left */}

      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-slate-800">
          Dashboard
        </h2>
      </div>

      {/* Center */}

      <div className="hidden w-96 items-center rounded-lg border bg-slate-50 px-3 lg:flex">
        <Search
          size={18}
          className="text-slate-500"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent px-3 py-2 outline-none"
        />
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">
        <button className="relative">
          <Bell
            size={22}
            className="text-slate-700"
          />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              SA
            </AvatarFallback>
          </Avatar>

          <div className="hidden lg:block">
            <p className="font-medium">
              Super Admin
            </p>

            <p className="text-sm text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;