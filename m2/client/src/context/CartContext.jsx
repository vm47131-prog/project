import { createContext, useContext, useState } from "react";
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
function addToCart(food) {
  setCart((previousCart) => {
    // Check: kya ye food pehle se cart mein hai?
    const existingItem = previousCart.find((item) => item._id === food._id);

    // Agar food pehle se hai, quantity increase karo
    if (existingItem) {
      return previousCart.map((item) =>
        item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    }
    // Agar food naya hai, quantity 1 se add karo
    return [...previousCart, { ...food, quantity: 1 }];
  });
}
