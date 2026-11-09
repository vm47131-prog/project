import { Routes, Route, Navigate } from "react-router-dom";

import FoodList from "../components/FoodList";
import Navbar from "../components/Navbar";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Cart from "../pages/Cart";
import RequireAuth from "../components/RequireAuth";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderDetails";
import OwnerRegister from "../pages/OwnerRegister";

import RequireRole from "../components/RequireRole";

import AdminDashboard, {
  DashboardHome,
} from "../components/admin/AdminDashboard";

import OwnerRequests from "../components/admin/OwnerRequests";
import ManageAdmins from "../components/admin/ManageAdmins";
import ManageFood from "../components/admin/ManageFood";

import OwnerDashboard, {
  OwnerDashboardHome,
} from "../components/owner/OwnerDashboard";

function Home() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl p-6 md:p-10">
        <h1 className="mb-5 text-3xl font-bold">Popular Food Items</h1>

        <FoodList />
      </main>
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/owner-register"
        element={<OwnerRegister />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      {/* User Protected Routes */}
      <Route
        path="/cart"
        element={
          <RequireAuth>
            <Cart />
          </RequireAuth>
        }
      />

      <Route
        path="/checkout"
        element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        }
      />

      <Route
        path="/my-orders"
        element={
          <RequireAuth>
            <MyOrders />
          </RequireAuth>
        }
      />

      <Route
        path="/orders/:orderId"
        element={
          <RequireAuth>
            <OrderDetails />
          </RequireAuth>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <RequireRole allowedRoles={["admin", "super_admin"]}>
            <AdminDashboard />
          </RequireRole>
        }
      >
        {/* Default Admin Route */}
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        {/* Dashboard */}
        <Route
          path="dashboard"
          element={<DashboardHome />}
        />

        {/* Owner Requests */}
        <Route
          path="owner-requests"
          element={<OwnerRequests />}
        />

        {/* Manage Admins */}
        <Route
          path="manage-admins"
          element={<ManageAdmins />}
        />

        {/* Manage Food */}
        <Route
          path="manage-food"
          element={<ManageFood />}
        />
      </Route>
      {/* Owner Routes */}
      <Route
        path="/owner"
        element={
          <RequireRole allowedRoles={["owner"]}>
            <OwnerDashboard />
          </RequireRole>
        }
      >
        {/* Default Owner Route */}
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        {/* Owner Dashboard */}
        <Route
          path="dashboard"
          element={<OwnerDashboardHome />}
        />

        {/* Manage Food */}
        <Route
          path="manage-food"
          element={<ManageFood />}
        />
      </Route>
    </Routes>
  );
}
