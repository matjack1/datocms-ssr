import React, { useEffect, useContext, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import { Box, Container, Heading, Label, Input, Text } from "theme-ui";
import CustomerTokenContext from "../../hooks/customerTokenContext";
import Nav from "../../components/nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../components/link";
import CustomerContext from "../../hooks/customerContext";
import CustomBreadcrumbs from "../customBreadcrumbs";
import { Helmet } from "react-helmet"

const BillingInfo = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [customerMetadata, setCustomerMetadata] = useState();

  useEffect(() => {
    if (customer && customer.metadata) setCustomerMetadata(customer.metadata);
  }, [customer]);

  return (
    <Box>
      <Helmet>
        <title>Dati aziendali | SOCAF</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          data={{
            pages: [
              {
                slug: "/",
                title: "Home",
              },
            ],
            current: {
              title: "Dati fatturazione",
            },
          }}
        />
        <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
          Dati fatturazione
        </Heading>
        <Box sx={{py:[8]}}>
          {customerMetadata && customerMetadata.vat ? (
            <Box sx={{ fontSize: [5] }}>
              {customerMetadata.company && (
                <Box>
                  <strong>{customerMetadata.company}</strong>
                </Box>
              )}
              {customerMetadata.line_1 && <Box>{customerMetadata.line_1}</Box>}
              {customerMetadata.line_2 && <Box>{customerMetadata.line_2}</Box>}
              <Box>
                {customerMetadata.zip_code && customerMetadata.zip_code}{" "}
                {customerMetadata.city && customerMetadata.city}{" "}
                {customerMetadata.state_code && customerMetadata.state_code}{" "}
                {customerMetadata.country_code &&
                  `(${customerMetadata.country_code})`}{" "}
              </Box>
              <Box>{customerMetadata.phone && customerMetadata.phone}</Box>
              <Box>{customerMetadata.vat && customerMetadata.vat}</Box>
              <Box>{customerMetadata.sdi && customerMetadata.sdi}</Box>
            </Box>
          ) : (
            <Box>Non ci sono dati di fatturazione</Box>
          )}
        </Box>
        <Box>
          <Text>Hai bisogno di cambiare i dati di fatturazione?</Text>
          <br />
          <InboundLink to={"/account/support"}>Contatta Socaf</InboundLink>
        </Box>
      </Container>
    </Box>
  );
};

export default BillingInfo;
