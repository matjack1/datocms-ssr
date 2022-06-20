import React, { createContext, useEffect, useState } from "react";

const CustomerContext = createContext({});

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState();
  const value = { customer, setCustomer };

  useEffect(() => {
    // console.log(customerToken);
  }, [customer]);

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerContext;
