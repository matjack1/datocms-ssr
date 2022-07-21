import React, { useContext, useEffect } from "react";
import { Box } from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";
import CustomerContext from "../hooks/customerContext";
import { useClSdk } from "../hooks/useClSdk";
import { InboundLink } from "./link";

const UserIcon = () => {
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  const { customer, setCustomer } = useContext(CustomerContext);
  const cl = useClSdk();

  const getCostumer = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        // console.log("invalid token", e);
      }
    };

    const customer = await cl.customers
      .retrieve(customerToken.owner_id, { include: ["orders","orders.shipping_address"] })
      .catch(handleError);

    console.log("customer",customer)

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
          <InboundLink to={"/account"}>
            <Box>{customer.email}</Box>
          </InboundLink>
        </Box>
      )}
    </>
  );
};

export default UserIcon;
