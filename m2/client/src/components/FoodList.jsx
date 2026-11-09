import { useEffect, useState } from "react";
import FoodCard from "./FoodCard";

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getFoods() {
      try {
        const response = await fetch("http://localhost:8080/api/foods");
        if (!response.ok) {
          throw new Error("Failed to fetch food items");
        }
        const data = await response.json();
        setFoods(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getFoods();
  }, []);

  if (loading) {
    return <p className="p-5">Loading food items...</p>;
  }

  if (error) {
    return <p className="p-5 text-red-600">Error: {error}</p>;
  }

  if (foods.length === 0) {
    return <p className="p-5">No food items found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
      {foods.map((food) => (
        <FoodCard
          key={food._id}
          food={food}
        />
      ))}
    </div>
  );
}
