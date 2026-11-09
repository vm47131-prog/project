import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import {
  Utensils,
  House,
  Plus,
  UserRound,
  UserPlus,
  LogIn,
  LogOut,
  ShoppingCart,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";

import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const { user: currUser, setUser, loading } = useAuth();
  const { cart = [] } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      setLogoutError("");
      await logoutUser();
      setUser(null);
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      setLogoutError(error.message || "Logout failed. Please try again.");
    }
  }

  // Total quantity of food items in the cart
  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* Logout error message */}
      {logoutError && (
        <p
          role="alert"
          className="bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          {logoutError}
        </p>
      )}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-orange-50 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-extrabold text-gray-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={22} />
            </span>

            <span>
              Foo<span className="text-orange-500">die</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-5 md:flex">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 transition hover:text-orange-500"
            >
              <House size={18} />
              Home
            </Link>
            {currUser && (
              <Link
                to="/my-orders"
                className="flex items-center gap-2 text-gray-600 transition hover:text-orange-500"
              >
                <ClipboardList size={18} />
                My Orders
              </Link>
            )}

            <Link
              to="/add-food"
              className="flex items-center gap-2 text-gray-600 transition hover:text-orange-500"
            >
              <Plus size={18} />
              Add Food
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-gray-600 transition hover:text-orange-500"
            >
              <ShoppingCart size={21} />
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication links */}
            {!currUser ? (
              <>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-500"
                >
                  <UserPlus size={18} />
                  Sign up
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600"
                >
                  <LogIn size={18} />
                  Login
                </Link>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2 text-gray-600">
                  <UserRound size={18} />
                  {currUser.username}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-3 md:hidden">
            <Link
              to="/cart"
              aria-label={`Cart, ${cartCount} items`}
              className="relative rounded-lg p-2 text-gray-700 hover:bg-orange-50"
            >
              <ShoppingCart size={23} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            >
              {menuOpen ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sliding sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Dark background */}
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={closeMenu}
            className="absolute inset-0 h-full w-full bg-black/40"
          />

          {/* Sidebar panel */}
          <aside className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white p-5 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="flex items-center  text-lg font-extrabold">
                <Utensils className="text-orange-500" />
                Foo<span className="text-orange-500">die</span>
              </span>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <p className="mb-3 text-xs font-bold tracking-widest text-gray-400">
              MENU
            </p>

            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <House size={19} />
                Home
              </Link>
              {currUser && (
                <Link
                  to="/my-orders"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                >
                  <ClipboardList size={19} />
                  My Orders
                </Link>
              )}

              <Link
                to="/add-food"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <Plus size={19} />
                Add Food
              </Link>

              <Link
                to="/cart"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart size={19} />
                  Cart
                </span>
                <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600">
                  {cartCount}
                </span>
              </Link>

              <hr className="my-3 border-gray-200" />

              {!currUser ? (
                <>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-700 hover:bg-orange-50"
                  >
                    <UserPlus size={19} />
                    Sign up
                  </Link>

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-700 hover:bg-orange-50"
                  >
                    <LogIn size={19} />
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-3 text-gray-700">
                    <UserRound size={19} />
                    {currUser.username}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={19} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
