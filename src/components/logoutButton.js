import { navigate } from "gatsby";
import React, { useContext } from "react";
import { Box, Button } from "theme-ui";
import CustomerContext from "../hooks/customerContext";
import CustomerTokenContext from "../hooks/customerTokenContext";

const LogoutButton = () => {
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  const { customer, setCustomer } = useContext(CustomerContext);

  const logoutCustomer = () => {
    setCustomerToken(null);
    setCustomer(null);
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");
    localStorage.removeItem("favourites");
    navigate("/login");
  };

  return (
    <>
      {customerToken && (
        <Button
          sx={{
            backgroundColor: "transparent",
            color: "dark",
            p: [0],
            fontSize: [3],
            "&:hover": {
              backgroundColor: "transparent",
              color: "primary",
            },
          }}
          onClick={logoutCustomer}
        >
          Esci
        </Button>
      )}
    </>
  );
};

export default LogoutButton;
