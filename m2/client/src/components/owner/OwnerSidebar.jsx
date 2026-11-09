import { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/owner/dashboard",
    icon: "🏠",
  },
  {
    name: "My Restaurant",
    path: "/owner/my-restaurant",
    icon: "🏪",
  },
  {
    name: "Manage Food",
    path: "/owner/manage-food",
    icon: "🍔",
  },
  {
    name: "Orders",
    path: "/owner/orders",
    icon: "🛍️",
  },
  {
    name: "Analytics",
    path: "/owner/analytics",
    icon: "📊",
  },
  {
    name: "Profile",
    path: "/owner/profile",
    icon: "👤",
  },
];

export default function OwnerSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-orange-500 p-3 text-white shadow-lg md:hidden"
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col
        border-r border-orange-100 bg-white shadow-xl
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-orange-100 px-6 py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Foo<span className="text-orange-500">die</span>
          </h1>

          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl text-gray-500 hover:text-orange-500 md:hidden"
          >
            ×
          </button>
        </div>

        {/* Owner Label */}
        <div className="mx-5 mt-6 rounded-2xl bg-orange-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Restaurant Panel
          </p>

          <p className="mt-1 text-lg font-bold text-gray-800">
            Owner Dashboard
          </p>

          <p className="mt-1 text-sm text-gray-500">Manage your restaurant</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3
                font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-orange-100 p-5">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">
              Foodie Partner
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Grow your restaurant with Foodie.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
