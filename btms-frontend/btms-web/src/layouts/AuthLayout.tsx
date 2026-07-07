import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="hidden w-1/2 bg-blue-600 lg:flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold">
            BTMS
          </h1>

          <p className="mt-5 text-xl">
            Bus Ticket Management System
          </p>
        </div>
      </div>

      {/* Right Side */}

      <div className="flex flex-1 items-center justify-center bg-slate-100 p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;