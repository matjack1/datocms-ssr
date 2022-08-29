import { navigate } from "gatsby";
import React, { createContext, useEffect, useState } from "react";

const CustomerContext = createContext({});

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState();
  const value = { customer, setCustomer };

  useEffect(() => {
    const localStorageCustomer = localStorage.getItem("customer");

    if (customer) localStorage.setItem("customer", JSON.stringify(customer));
    
    if(customer && customer.metadata && customer.metadata.favourites)
    localStorage.setItem("favourites", JSON.stringify(customer.metadata.favourites));
    

    if (!localStorageCustomer) navigate("/login");
  }, [customer]);

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerContext;
