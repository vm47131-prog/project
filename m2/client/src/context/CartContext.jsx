import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const API_URL = "http://localhost:8080/api/cart";

// Backend cart ko frontend ke existing format mein convert karo
function formatCart(cartData) {
  return (cartData?.items || [])
    .filter((item) => item.food)
    .map((item) => ({
      ...item.food,
      _id: item.food._id,
      quantity: item.quantity,
    }));
}

async function cartRequest(path = "", options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Cart request failed");
  }

  return data;
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  function clearCart() {
    setCart([]);
  }

  // Login ke baad MongoDB se cart load karo
  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      if (authLoading) return;

      if (!user) {
        setCart([]);
        setCartError("");
        setCartLoading(false);
        return;
      }

      setCartLoading(true);
      setCartError("");

      try {
        const data = await cartRequest();
        if (!cancelled) {
          setCart(formatCart(data.cart));
        }
      } catch (error) {
        if (!cancelled) {
          setCart([]);
          setCartError(error.message);
          console.error("Could not load cart:", error);
        }
      } finally {
        if (!cancelled) {
          setCartLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  // Food add karo ya existing quantity increase karo

  async function addToCart(food) {
    // Agar user logged in nahi hai
    if (!user) {
      navigate("/login", {
        state: { from: location },
      });
      return;
    }

    try {
      setCartError("");

      const data = await cartRequest("/items", {
        method: "POST",
        body: JSON.stringify({
          foodId: food._id,
          quantity: 1,
        }),
      });

      setCart(formatCart(data.cart));
    } catch (error) {
      setCartError(error.message);
      console.error("Could not add food:", error);
    }
  }
  // Quantity 1 hai to remove, otherwise quantity decrease
  async function decreaseQuantity(foodId) {
    const item = cart.find((food) => food._id === foodId);
    if (!item) return;

    if (item.quantity <= 1) {
      return removeFromCart(foodId);
    }

    try {
      setCartError("");

      const data = await cartRequest(`/items/${foodId}`, {
        method: "PATCH",
        body: JSON.stringify({
          quantity: item.quantity - 1,
        }),
      });

      setCart(formatCart(data.cart));
    } catch (error) {
      setCartError(error.message);
      console.error("Could not decrease quantity:", error);
    }
  }

  // Food ko cart se completely remove karo
  async function removeFromCart(foodId) {
    try {
      setCartError("");

      const data = await cartRequest(`/items/${foodId}`, {
        method: "DELETE",
      });

      setCart(formatCart(data.cart));
    } catch (error) {
      setCartError(error.message);
      console.error("Could not remove food:", error);
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        cartError,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
