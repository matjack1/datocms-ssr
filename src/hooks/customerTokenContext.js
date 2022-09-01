import { navigate } from "gatsby";
import React, { createContext, useEffect, useState } from "react";

const CustomerTokenContext = createContext({});

export const CustomerTokenProvider = ({ children }) => {
  const localState = JSON.parse(localStorage.getItem("customerToken"));
  const [customerToken, setCustomerToken] = useState(localState || null);
  const value = { customerToken, setCustomerToken };

  useEffect(() => {
    // console.log(customerToken);
    const localStorageCustomerToken = localStorage.getItem("customerToken");

    if (customerToken)
      localStorage.setItem("customerToken", JSON.stringify(customerToken));

    if (!customerToken) {
      localStorage.removeItem("customerToken");
    }

    if (!localStorageCustomerToken && !customerToken) {
      console.log("customerToken", customerToken);
    }
  }, [customerToken]);

  return (
    <CustomerTokenContext.Provider value={value}>
      {children}
    </CustomerTokenContext.Provider>
  );
};

export default CustomerTokenContext;
