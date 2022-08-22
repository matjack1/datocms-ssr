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
  };

  return (
    <>
      {customerToken && (
        <Box>
          <Button onClick={logoutCustomer}>Esci</Button>
        </Box>
      )}
    </>
  );
};

export default LogoutButton;
