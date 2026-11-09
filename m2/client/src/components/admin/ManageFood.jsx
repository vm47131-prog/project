import { useEffect, useMemo, useState } from "react";
import {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../../services/foodService";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  restaurant: "",
  deliveryTime: "30-40 min",
  isVeg: true,
};

export default function ManageFood() {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadFoods() {
    try {
      setLoading(true);
      setError("");

      const data = await getFoods();
      setFoods(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(foods.map((food) => food.category).filter(Boolean)),
    ];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();

    return foods.filter((food) => {
      const matchesSearch =
        food.name?.toLowerCase().includes(query) ||
        food.category?.toLowerCase().includes(query) ||
        food.restaurant?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" || food.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [foods, search, categoryFilter]);

  const totalFoods = foods.length;
  const vegFoods = foods.filter((food) => food.isVeg).length;
  const nonVegFoods = foods.filter((food) => !food.isVeg).length;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        price: Number(form.price),
      };

      if (editingId) {
        const response = await updateFood(editingId, payload);
        setMessage(response.message);
      } else {
        const response = await createFood(payload);
        setMessage(response.message);
      }

      resetForm();
      await loadFoods();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(food) {
    setEditingId(food._id);

    setForm({
      name: food.name || "",
      description: food.description || "",
      price: food.price ?? "",
      category: food.category || "",
      restaurant: food.restaurant || "",
      deliveryTime: food.deliveryTime || "30-40 min",
      isVeg: food.isVeg ?? true,
    });

    setError("");
    setMessage("");

    document
      .getElementById("food-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleDelete(foodId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food item?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await deleteFood(foodId);

      setMessage(response.message);
      setFoods((prev) => prev.filter((food) => food._id !== foodId));

      if (editingId === foodId) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              Foo<span className="text-orange-600">die</span> Admin
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Manage Food
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your menu, prices and food categories.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              document
                .getElementById("food-form")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-2xl bg-orange-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 active:scale-95"
          >
            + Add New Food
          </button>
        </header>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              title: "Total Food Items",
              count: totalFoods,
              icon: "🍽️",
              color: "bg-orange-100",
            },
            {
              title: "Vegetarian Items",
              count: vegFoods,
              icon: "🥗",
              color: "bg-green-100",
            },
            {
              title: "Non-Vegetarian Items",
              count: nonVegFoods,
              icon: "🍗",
              color: "bg-red-100",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-orange-50 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
                    {item.count}
                  </h2>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} text-2xl`}
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {message && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            ⚠ {error}
          </div>
        )}

        {/* Add / Edit Form */}
        <section
          id="food-form"
          className="mb-10 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm"
        >
          <div className="border-b border-orange-50 bg-gradient-to-r from-orange-50 to-white px-6 py-5">
            <h2 className="text-xl font-extrabold text-gray-900">
              {editingId ? "✏️ Edit Food Item" : "🍴 Add Food Item"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Fill in the details of your delicious food item.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Food Name */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Food Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Paneer Tikka"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Price (₹) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="199"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Category *
                </label>

                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  placeholder="Fast Food, Indian..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Restaurant ID */}
              {!editingId && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Restaurant ID
                  </label>

                  <input
                    name="restaurant"
                    value={form.restaurant}
                    onChange={handleChange}
                    placeholder="Required for Admin / Super Admin"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Owner account ke liye backend automatically restaurant
                    select karega.
                  </p>
                </div>
              )}

              {/* Delivery Time */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Delivery Time
                </label>

                <input
                  name="deliveryTime"
                  value={form.deliveryTime}
                  onChange={handleChange}
                  placeholder="30-40 min"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              {/* Veg Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p className="font-bold text-gray-700">Vegetarian Food</p>

                  <p className="text-xs text-gray-500">
                    {form.isVeg ? "Pure Vegetarian" : "Non-Vegetarian"}
                  </p>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={form.isVeg}
                    onChange={handleChange}
                    className="peer sr-only"
                  />

                  <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-100" />

                  <div className="absolute left-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your delicious food item..."
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {/* Form Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-orange-500 px-7 py-3 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Food" : "Add Food"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-200 px-7 py-3 font-bold text-gray-600 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Food List */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Your Food Menu
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredFoods.length} items found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Search food..."
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-400"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

              <p className="mt-4 font-medium text-gray-500">
                Loading your food menu...
              </p>
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-orange-200 bg-white py-16 text-center">
              <div className="text-5xl">🍽️</div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">
                No Food Items Found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add a food item or change your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFoods.map((food) => (
                <article
                  key={food._id}
                  className="group overflow-hidden rounded-3xl border border-orange-50 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="bg-gradient-to-br from-orange-50 to-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold text-gray-900 transition group-hover:text-orange-500">
                          {food.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {food.category}
                        </p>
                      </div>

                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                          food.isVeg
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {food.isVeg ? "● Veg" : "● Non-Veg"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-500">
                      {food.description}
                    </p>

                    <div className="flex items-center justify-between rounded-2xl bg-orange-50 p-4">
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          Price
                        </p>

                        <p className="mt-1 text-2xl font-extrabold text-orange-500">
                          ₹{food.price}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-400">
                          Delivery
                        </p>

                        <p className="mt-1 font-bold text-gray-700">
                          ⏱ {food.deliveryTime || "30-40 min"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(food)}
                        className="flex-1 rounded-xl border border-orange-100 bg-orange-50 py-2.5 font-bold text-orange-600 transition hover:bg-orange-100"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(food._id)}
                        className="flex-1 rounded-xl border border-red-100 bg-red-50 py-2.5 font-bold text-red-600 transition hover:bg-red-100"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
