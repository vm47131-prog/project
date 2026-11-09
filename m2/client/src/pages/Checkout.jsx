import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Banknote, ShoppingBag } from "lucide-react";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
export default function Checkout() {
  const { user } = useAuth();
  const { cart, cartLoading, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: user?.username || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
  });

  const [error, setError] = useState("");

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const deliveryFee = cart.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;
  const navigate = useNavigate();
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deliveryAddress: formData,
          paymentMethod: "COD",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not place order.");
      }

      // Clear React cart after successful order
      clearCart();
      alert("Order placed successfully!");

      // Navigate to order confirmation page later
      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error("Order error:", error);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  if (cartLoading) {
    return <p className="p-6 text-center">Loading checkout...</p>;
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-3xl p-10 text-center">
          <ShoppingBag
            className="mx-auto mb-4 text-gray-400"
            size={48}
          />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <Link
            to="/"
            className="mt-4 inline-block font-semibold text-orange-600"
          >
            Browse food
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Delivery Details */}
            <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center gap-3">
                <MapPin className="text-orange-500" />
                <h2 className="text-xl font-bold">Delivery Address</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <input
                  name="phone"
                  type="tel"
                  placeholder="10-digit Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                  required
                />

                <textarea
                  name="address"
                  placeholder="House No., Street, Area"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                  rows={3}
                  required
                />

                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <input
                  name="pincode"
                  inputMode="numeric"
                  placeholder="6-digit PIN Code"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <input
                  name="landmark"
                  placeholder="Landmark (Optional)"
                  value={formData.landmark}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />
              </div>

              <div className="border-t pt-5">
                <div className="mb-3 flex items-center gap-3">
                  <Banknote className="text-orange-500" />
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-400 bg-orange-50 p-4">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked
                    readOnly
                  />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* Order Summary */}
            <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">Order Summary</h2>

              <div className="mb-5 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total}</span>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Place Order · ₹{total}
              </button>
            </aside>
          </div>
        </form>
      </main>
    </>
  );
}
