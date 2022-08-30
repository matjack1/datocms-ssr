import React, { useContext, useEffect, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import { Box, Container, Heading, Label, Input, Text } from "theme-ui";
import CustomerTokenContext from "../../hooks/customerTokenContext";
import Nav from "../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../link";
import { useClSdk } from "../../hooks/useClSdk";
import CustomerContext from "../../hooks/customerContext";
import CustomBreadcrumbs from "../customBreadcrumbs";

const Payments = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [paymentMethods, setPaymentMethods] = useState();
  const cl = useClSdk();

  const getPaymentMethods = async (id) => {
    const handleError = (e) => {
      console.log("e", e);
      if (e && e.errors && e.errors[0].code === "INVALID_TOKEN") {
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    const customerPaymentMethods = await cl.customer_payment_sources
      .list(customer.id)
      .catch(handleError);

    if (customerPaymentMethods) {
      setPaymentMethods(customerPaymentMethods);
    }
  };

  useEffect(() => {
    if (customer && cl) getPaymentMethods();
  }, [customer]);

  return (
    <Box>
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
              title: "Metodi di pagamento",
            },
          }}
        />
        <Box sx={{ pb: [8] }}>
          <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
            Metodi di pagamento
          </Heading>
        </Box>
      </Container>
    </Box>
  );
};

export default Payments;
