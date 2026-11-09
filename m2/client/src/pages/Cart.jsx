import { Link, useNavigate } from "react-router-dom";
import {
  Utensils,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    cartLoading,
    cartError,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = useCart();
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const deliveryFee = cart.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;
  const navigate = useNavigate();
  if (cartLoading) {
    return <p className="p-6">Loading your cart...</p>;
  }
  {
    cartError && <p className="mb-4 text-sm text-red-600">{cartError}</p>;
  }
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Navbar */}
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <span className="rounded-xl bg-orange-500 p-2 text-white">
              <Utensils size={23} />
            </span>
            <span className="text-xl font-extrabold text-gray-900">
              Foo<span className="text-orange-500">die</span>
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Your Cart</h1>
          <p className="mt-2 text-gray-500">
            Review your delicious choices before checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <ShoppingCart size={38} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Looks like you haven't added any food yet.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex rounded-lg bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
            >
              Explore Food
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <section className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >
                  {/* Food Icon */}
                  <div className="flex h-24 w-full items-center justify-center rounded-xl bg-orange-100 text-orange-500 sm:w-24 sm:shrink-0">
                    <Utensils size={34} />
                  </div>

                  {/* Food Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      ₹{Number(item.price).toFixed(2)} per item
                    </p>

                    <p className="mt-2 font-bold text-orange-600">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item._id)}
                      aria-label="Decrease quantity"
                      className="rounded-lg border border-gray-300 p-2 hover:bg-orange-50"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-5 text-center font-bold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      aria-label="Increase quantity"
                      className="rounded-lg border border-gray-300 p-2 hover:bg-orange-50"
                    >
                      <Plus size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      aria-label="Remove item"
                      className="ml-1 rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </section>

            {/* Order Summary */}
            <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-base font-extrabold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-lg bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="mt-4 block text-center text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
