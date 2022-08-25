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
        <Grid columns={["1fr 1fr 1fr 1fr"]}>
          {addresses && addresses.meta.recordCount > 0 ? (
            addresses.map((customer_address, index) => (
              <>
                {index === 0 && (
                  <Box sx={{
                    minWidth:"290px",
                    minHeight:"360px",
                    a:{
                      display:"inline-block",
                      height:"100%",
                      width:"100%"
                    }
                  }}>
                    <InboundLink to={"add"}> 
                      Aggiungi indirizzo </InboundLink>
                  </Box>
                )}
                <Box>
                  <CustomerAddress
                    updateAddresses={handleUpdateAddresses}
                    address={customer_address}
                  />
                </Box>
              </>
            ))
          ) : (
            <>
              <Box>
                <Text>Nessun indirizzo salvato</Text>
              </Box>
            </>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Addresses;