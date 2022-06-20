import React, { createContext, useEffect, useState } from "react";

const CustomerTokenContext = createContext({});

export const CustomerTokenProvider = ({ children }) => {
  const localState = JSON.parse(localStorage.getItem("customerToken"));
  const [customerToken, setCustomerToken] = useState(localState || null);
  const value = { customerToken, setCustomerToken };

  useEffect(() => {
    localStorage.setItem("customerToken", JSON.stringify(customerToken));
  }, [customerToken]);

  return (
    <CustomerTokenContext.Provider value={value}>
      {children}
    </CustomerTokenContext.Provider>
  );
};

export default CustomerTokenContext;
