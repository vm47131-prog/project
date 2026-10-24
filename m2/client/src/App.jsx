import FoodList from "./components/FoodList";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-gray-50 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Foodie</h1>

          <p className="mt-1 text-gray-500">Discover your favourite food</p>
        </header>

        <h2 className="mb-5 text-2xl font-bold">Popular Food Items</h2>

        <FoodList />
      </main>
    </CartProvider>
  );
}
