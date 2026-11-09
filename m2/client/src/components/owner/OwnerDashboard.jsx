import { useAuth } from "../../context/AuthContext";
import { Outlet } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";

export function OwnerDashboardHome() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#fffaf6] p-6 md:p-10">
      {/* Welcome Section */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-orange-500">
          RESTAURANT OVERVIEW
        </p>

        <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
          Welcome back,{" "}
          <span className="text-orange-500">{user?.username || "Owner"}</span>!
        </h2>

        <p className="mt-3 max-w-2xl text-gray-500">
          Manage your restaurant, delicious food menu, and customer orders from
          one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value="0"
          icon="🛍️"
          color="orange"
          description="Orders received"
        />

        <StatCard
          title="Total Revenue"
          value="₹0"
          icon="💰"
          color="green"
          description="Your restaurant earnings"
        />

        <StatCard
          title="Food Items"
          value="0"
          icon="🍔"
          color="blue"
          description="Items in your menu"
        />

        <StatCard
          title="Pending Orders"
          value="0"
          icon="⏳"
          color="purple"
          description="Orders awaiting action"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h3 className="mb-5 text-xl font-bold text-gray-900">Quick Actions</h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              🍔
            </div>

            <h4 className="text-lg font-bold text-gray-900">
              Manage Food Menu
            </h4>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Add new dishes, update food prices, and manage your restaurant's
              menu.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              📦
            </div>

            <h4 className="text-lg font-bold text-gray-900">Manage Orders</h4>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Keep track of incoming orders and serve your customers
              efficiently.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Placeholder */}
      <div className="mt-10 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>

            <p className="mt-1 text-sm text-gray-500">
              Your latest restaurant orders will appear here.
            </p>
          </div>

          <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-500">
            Coming Soon
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center">
          <span className="text-5xl">🛍️</span>

          <p className="mt-4 font-semibold text-gray-700">No recent orders</p>

          <p className="mt-2 text-sm text-gray-400">
            Orders will be displayed here once customers start ordering.
          </p>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, color, description }) {
  const colors = {
    orange: "bg-orange-50 text-orange-500",
    green: "bg-green-50 text-green-500",
    blue: "bg-blue-50 text-blue-500",
    purple: "bg-purple-50 text-purple-500",
  };

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-3 text-3xl font-extrabold text-gray-900">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">{description}</p>
    </div>
  );
}

export default function OwnerDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#fffaf6]">
      <OwnerSidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-orange-100 bg-white/95 px-6 py-4 pl-20 shadow-sm backdrop-blur md:px-8">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 md:text-2xl">
              Foo<span className="text-orange-500">die</span>
              <span className="ml-2 text-gray-400">Owner</span>
            </h1>

            <p className="hidden text-xs text-gray-400 sm:block">
              Restaurant Management Panel
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-semibold text-gray-800">{user?.username}</p>

              <p className="text-xs capitalize text-orange-500">
                {user?.role?.replace("_", " ")}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
              {user?.username?.charAt(0)?.toUpperCase() || "O"}
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
