import { useCart } from "../context/CartContext";

export default function FoodCard({ food }) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(food);
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Food details */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              food.isVeg
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {food.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
          </span>

          <span className="text-sm text-gray-500">⭐ {food.rating ?? 0}</span>
        </div>

        <h2 className="mb-1 text-xl font-bold text-gray-800">{food.name}</h2>

        <p className="mb-3 text-sm text-gray-500">{food.description}</p>

        <p className="mb-1 text-sm text-gray-600">🍴 {food.restaurant}</p>

        <p className="mb-4 text-sm text-gray-600">⏱️ {food.deliveryTime}</p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-gray-900">₹{food.price}</span>

          <button
            onClick={handleAddToCart}
            className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 active:scale-95"
          >
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
