import React, { useContext } from "react";
import { Box, Button } from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";

const LogoutButton = () => {
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  return (
    <>
      {customerToken && (
        <Box>
          <Button onClick={() => setCustomerToken(null)}>Esci</Button>
        </Box>
      )}
    </>
  );
};

export default LogoutButton;
