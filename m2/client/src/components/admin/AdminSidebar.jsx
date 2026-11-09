import { useState } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    name: "Owner Requests",
    path: "/admin/owner-requests",
  },
  {
    name: "Manage Admins",
    path: "/admin/manage-admins",
  },
  {
    name: "Manage Food",
    path: "/admin/manage-food",
  },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-gray-900 p-3 text-white md:hidden"
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
        className={`fixed inset-y-0 left-0 z-50 w-64 min-h-screen
        bg-gray-900 p-5 text-white transition-transform duration-300
        md:static md:z-auto md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo and Close Button */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            <span>
              Foo<span className="text-orange-500">die</span>
            </span>
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl text-white md:hidden"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
