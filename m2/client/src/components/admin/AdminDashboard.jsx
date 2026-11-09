import { useAuth } from "../../context/AuthContext";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export function DashboardHome() {
  const { user } = useAuth();

  return (
    <main className="p-6 md:p-10">
      <h2 className="mb-2 text-3xl font-bold text-gray-800">
        Welcome to{" "}
        <span>
          Foo<span className="text-orange-500">die</span>
        </span>{" "}
        Admin
      </h2>

      <p className="mb-8 text-gray-500">
        Manage your Foodie platform from one place.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-gray-500">Total Owners</h3>
          <p className="mt-3 text-3xl font-bold text-blue-600">0</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-gray-500">Pending Owner Requests</h3>
          <p className="mt-3 text-3xl font-bold text-yellow-500">0</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-gray-500">Total Admins</h3>
          <p className="mt-3 text-3xl font-bold text-green-600">0</p>
        </div>
      </div>
    </main>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white pl-20 pr-6 py-4 shadow md:px-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Foo<span className="text-orange-500">die</span> Admin
          </h1>

          <div className="text-right">
            <p className="font-semibold text-gray-800">{user?.username}</p>

            <p className="text-sm text-gray-500">{user?.role}</p>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
