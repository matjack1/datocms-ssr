import React from "react";
import { CustomerTokenProvider } from "./src/hooks/customerTokenContext";

export const wrapRootElement = ({ element }) => (
  <CustomerTokenProvider>{element}</CustomerTokenProvider>
);
