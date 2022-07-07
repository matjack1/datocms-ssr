import React, { useContext, useEffect } from "react";
import { Box } from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";
import CustomerContext from "../hooks/customerContext";
import { useClSdk } from "../hooks/useClSdk";

const UserIcon = () => {
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  const { customer, setCustomer } = useContext(CustomerContext);
  const cl = useClSdk();
  console.log(customer);

  const getCostumer = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        // console.log("invalid token", e);
      }
    };

    const customer = await cl.customers
      .retrieve(customerToken.owner_id, { include: ["orders"] })
      .catch(handleError);

    if (customer) {
      console.log(customer);
      setCustomer(customer);
    }
  };

  useEffect(() => {
    if (customerToken) {
      getCostumer(customerToken.owner_id);
    }
  }, [customerToken]);

  return (
    <>
      {customer && (
        <Box>
          <Box>{customer.email}</Box>
        </Box>
      )}
    </>
  );
};

export default UserIcon;
