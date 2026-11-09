import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/orders/my-orders",
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch orders.");
        }

        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  function formatDate(date) {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function formatPrice(price) {
    return `₹${price.toFixed(2)}`;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 pb-10 pt-2">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-3">
            <Package
              size={30}
              className="text-orange-500"
            />
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          </div>

          {loading && (
            <p className="text-center text-gray-600">Loading your orders...</p>
          )}

          {error && (
            <p className="rounded-lg bg-red-100 p-4 text-red-600">{error}</p>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <ShoppingBag
                size={50}
                className="mx-auto mb-4 text-gray-400"
              />

              <h2 className="mb-2 text-xl font-semibold">No orders yet!</h2>

              <p className="mb-5 text-gray-500">
                You haven't placed any orders.
              </p>

              <Link
                to="/"
                className="inline-block rounded-lg bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
              >
                Explore Food
              </Link>
            </div>
          )}

          {!loading &&
            !error &&
            orders.map((order) => (
              <div
                key={order._id}
                className="mb-5 rounded-xl bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="text-sm font-medium">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                    {order.orderStatus}
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="font-medium text-gray-700">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between border-t pt-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Payment: {order.paymentMethod}
                    </p>
                    <p className="text-sm text-gray-500">
                      Payment Status: {order.paymentStatus}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-orange-600">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4 text-right">
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-block rounded-lg bg-orange-500 px-5 py-2 text-white hover:bg-orange-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
