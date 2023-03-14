import React, { useContext, useEffect, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Label,
  Input,
  Text,
  Grid,
  Flex,
} from "theme-ui";
import CustomerTokenContext from "../../hooks/customerTokenContext";
import Nav from "../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../link";
import { useClSdk } from "../../hooks/useClSdk";
import CustomerContext from "../../hooks/customerContext";
import CustomBreadcrumbs from "../customBreadcrumbs";
import { Helmet } from "react-helmet";

const Payments = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [paymentMethods, setPaymentMethods] = useState();
  const cl = useClSdk();

  const getPaymentMethods = async (id) => {
    const handleError = (e) => {
      
      if (e && e.errors && e.errors[0].code === "INVALID_TOKEN") {
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    // const customerPaymentSource = await cl.customer_payment_sources
    //   .list({
    //     include: ["payment_source"],
    //   })
    //   .catch(handleError);

    // if (customerPaymentSource) {
    let tmpPaymentMethods = [];
    // customerPaymentSource.map((method) => {
    //   if (method) tmpPaymentMethods.push(method);
    // });
    if (customer.metadata.payment_method && customer.metadata.payment_term) {
      tmpPaymentMethods.push({
        type: "wire_transfer",
        payment_method: {
          title: customer.metadata.payment_method,
        },
        payment_term: {
          title: customer.metadata.payment_term,
        },
      });
    }

    

    setPaymentMethods(tmpPaymentMethods);
    // }
  };

  useEffect(() => {
    if (customer && cl) getPaymentMethods();
  }, [customer]);

  return (
    <Box>
      <Helmet>
        <title>Metodi di pagamento | Socaf</title>
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
              title: "Metodi di pagamento",
            },
          }}
        />
        <Box sx={{ pb: [8] }}>
          <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
            Metodi di pagamento
          </Heading>
        </Box>
        <Grid
          columns={[
            "1fr",
            "repeat(2,minmax(290px,1fr))",
            "repeat(auto-fill, minmax(290px, 1fr))",
          ]}
        >
          {/* <Box
            sx={{
              minWidth: ["auto"],
              minHeight: ["auto"],
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
                  px: [4],
                  py: [6],
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
                <Box sx={{ alignItems: "center", textAlign: "center" }}>
                  <Text sx={{ fontWeight: "600", textAlign: "center" }}>
                    Aggiungi indirizzo <br /> di spedizione
                  </Text>
                </Box>
              </Flex>
            </InboundLink>
          </Box> */}
          {paymentMethods &&
            paymentMethods.length > 0 &&
            paymentMethods.map((paymentMethod, index) => (
              <>
                <Box>
                  <Box
                    sx={{
                      border: "1px solid",
                      height: "100%",
                      borderColor: "dark",
                      px: [4],
                      py: [6],
                    }}
                  >
                    {paymentMethod.type === "wire_transfer" ? (
                      <Box>
                        <Box sx={{ pb: [5] }}>
                          <Heading as="h2" variant="h5" sx={{ my: [0] }}>
                            {paymentMethod.payment_method.title}
                          </Heading>
                          <Heading as="h2" variant="h6" sx={{ my: [0] }}>
                            {paymentMethod.payment_term.title}
                          </Heading>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Box sx={{ pb: [5] }}>
                          <Heading as="h2" variant="h5" sx={{ my: [0] }}>
                            {
                              paymentMethod.payment_source.payment_method.card
                                .brand
                            }
                            <br />
                            finisce con{" "}
                            {
                              paymentMethod.payment_source.payment_method.card
                                .last4
                            }
                            <br />
                            scadenza:{" "}
                            {
                              paymentMethod.payment_source.payment_method.card
                                .exp_month
                            }
                            {
                              paymentMethod.payment_source.payment_method.card
                                .exp_year
                            }
                          </Heading>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Payments;
