import React, { useContext, useEffect, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Label,
  Input,
  Text,
  Button,
  Grid,
  Flex,
} from "theme-ui";
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
      <Container>
        <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
          I tuoi indirizzi
        </Heading>
        <Grid columns={["repeat(4,minmax(290px,1fr))"]}>
          <Box
            sx={{
              minWidth: "290px",
              minHeight: "360px",
              a: {
                display: "inline-block",
                height: "100%",
                width: "100%",
                textDecoration: "none",
              },
            }}
          >
            <InboundLink to={"add"}>
              <Flex
                sx={{
                  height: "100%",
                  width: "100%",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid",
                  flexDirection: "column",
                  borderColor: "lightPrimary",
                }}
              >
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "primary",
                    display: "flex",
                    color: "light",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: [3],
                  }}
                >
                  +
                </Box>
                <Box sx={{ alignItems: "center" , textAlign:"center" }}>
                  <Text sx={{ fontWeight: "600", textAlign: "center" }}>
                    Aggiungi indirizzo <br /> di spedizione
                  </Text>
                </Box>
              </Flex>
            </InboundLink>
          </Box>
          {addresses &&
            addresses.meta.recordCount > 0 &&
            addresses.map((customer_address, index) => (
              <>
                <Box
                  sx={{
                    minWidth: "290px",
                    minHeight: "360px",
                  }}
                >
                  <CustomerAddress
                    updateAddresses={handleUpdateAddresses}
                    address={customer_address}
                  />
                </Box>
              </>
            ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Addresses;
