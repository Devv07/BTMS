import { Card } from "@/components/ui/card";

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Super Admin Dashboard
        </h1>

        <p className="text-slate-500">
          Welcome to Bus Ticket Management System
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">
          Dashboard Loaded Successfully 🎉
        </h2>

        <p className="mt-2 text-slate-500">
          Your frontend architecture is ready.
        </p>
      </Card>
    </div>
  );
}

export default DashboardPage;