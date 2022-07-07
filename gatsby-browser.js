import React from "react";
import { CartProvider } from "./src/hooks/cartContext";
import { CustomerProvider } from "./src/hooks/customerContext";
import { CustomerTokenProvider } from "./src/hooks/customerTokenContext";

export const wrapRootElement = ({ element }) => (
  <CustomerTokenProvider>
    <CustomerProvider>
      <CartProvider>{element}</CartProvider>
    </CustomerProvider>
  </CustomerTokenProvider>
);
