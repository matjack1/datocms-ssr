import React, { createContext, useEffect, useState } from "react";

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState();
  const value = { cart, setCart };

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
