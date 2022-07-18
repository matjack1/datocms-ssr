import React, { useContext, useEffect, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import { Box, Container, Heading, Label, Input, Text, Button } from "theme-ui";
import CustomerTokenContext from "../../../hooks/customerTokenContext";
import Nav from "../../../components/nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../../components/link";
import CustomerContext from "../../../hooks/customerContext";
import getAddresses from "../../../hooks/getAddresses";
import { useClSdk } from "../../../hooks/useClSdk";
import CustomerAddress from "../../../components/customerAddress";

const Addresses = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken } = useContext(CustomerTokenContext);
  const [addresses, setAddresses] = useState();
  const cl = useClSdk();

  useEffect(() => {
    handleUpdateAddresses();
  }, []);

  const handleUpdateAddresses = () => {
    getAddresses(cl)
      .then((value) => {
        setAddresses(value);
        console.log("getAddresses then", value);
      })
      .catch((err) => {
        console.log("getAddresses err", err);
      });
  };

  return (
    <Box>
      <Heading as="h1">I tui indirizzi</Heading>
      <Container sx={{ width: "80%" }}>
        {addresses && addresses.meta.recordCount > 0 ? (
          addresses.map((customer_address) => (
            <CustomerAddress
              updateAddresses={handleUpdateAddresses}
              address={customer_address}
            />
          ))
        ) : (
          <>
            <Box>
              <Text>Nessun indirizzo salvato</Text>
            </Box>
          </>
        )}
        <Box>
          <InboundLink to={"add"}> Aggiungi indirizzo </InboundLink>
        </Box>
      </Container>
    </Box>
  );
};

export default Addresses;
