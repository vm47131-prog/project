import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import Navbar from "../components/Navbar";

export default function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/orders/${orderId}`,
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch order.");
        }

        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price) => `₹${Number(price).toFixed(2)}`;

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 pb-10 pt-2">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/my-orders"
            className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft size={18} />
            Back to My Orders
          </Link>

          <h1 className="mb-8 text-3xl font-bold text-gray-800">
            Order Details
          </h1>

          {loading && (
            <p className="text-center text-gray-600">
              Loading order details...
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-red-100 p-4 text-red-600">{error}</p>
          )}

          {!loading && !error && order && (
            <div className="space-y-6">
              {/* Order Information */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <h2 className="font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </h2>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>

                  <span className="h-fit rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Ordered Food */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <Package className="text-orange-500" />
                  <h2 className="text-xl font-bold">Ordered Items</h2>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex justify-between border-b pb-4"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="text-orange-500" />
                  <h2 className="text-xl font-bold">Delivery Address</h2>
                </div>

                <p className="font-semibold">{order.deliveryAddress.name}</p>
                <p className="text-gray-600">{order.deliveryAddress.phone}</p>
                <p className="text-gray-600">{order.deliveryAddress.email}</p>
                <p className="mt-2 text-gray-600">
                  {order.deliveryAddress.address}, {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.pincode}
                </p>

                {order.deliveryAddress.landmark && (
                  <p className="text-gray-600">
                    Landmark: {order.deliveryAddress.landmark}
                  </p>
                )}
              </div>

              {/* Payment Summary */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="text-orange-500" />
                  <h2 className="text-xl font-bold">Payment Summary</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>

                  <div className="flex justify-between border-t pt-3 text-xl font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Payment Method</span>
                    <span>{order.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Payment Status</span>
                    <span>{order.paymentStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
