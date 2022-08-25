import React, { useContext, useEffect, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Label,
  Input,
  Text,
  Flex,
  Button,
  Grid,
} from "theme-ui";
import CustomerTokenContext from "../../../../hooks/customerTokenContext";
import Nav from "../../../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../../link";
import { useClSdk } from "../../../../hooks/useClSdk";
import { useParams } from "@reach/router";
import ProductThumb from "../../../productThumb";
import CustomerContext from "../../../../hooks/customerContext";
import CustomBreadcrumbs from "../../../customBreadcrumbs";

const CustomerOrder = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [customerMetadata, setCustomerMetadata] = useState();
  const [order, setOrder] = useState();
  const [orderId, setOrderId] = useState(useParams().orderId);
  const [itemQuantity, setItemQuantity] = useState(null);
  const cl = useClSdk();

  const getOrder = async (id) => {
    const handleError = (e) => {
      console.log("invalid token", e);
    };

    const order = await cl.orders
      .retrieve(id, {
        include: ["line_items", "shipping_address"],
        filters: { status: "draft" },
      })
      .catch(handleError);

    if (order) {
      let tmp = 0;
      order.line_items.map((item, a) => (tmp += item.quantity), 0);
      setItemQuantity(tmp);
      setOrder(order);
    }
  };

  useEffect(() => {
    console.log("customer", customer);
    if (customer && customer.metadata) setCustomerMetadata(customer.metadata);
  }, [customer]);

  useEffect(() => {
    getOrder(orderId);
  }, [orderId]);

  return (
    <Box>
      <Container>
        {order && (
          <>
            <CustomBreadcrumbs
              data={{
                pages: [
                  {
                    slug: "/",
                    title: "Home",
                  },
                  {
                    slug: "/account/orders",
                    title: "Ordini",
                  },
                ],
                current: {
                  title: "Dettaglio ordine",
                },
              }}
            />
            <Grid columns={[".7fr .3fr"]} gap={[12]}>
              <Box>
                <Box>
                  <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
                    Dettaglio ordine
                  </Heading>
                  <Grid
                    columns={["20px auto"]}
                    gap={[0]}
                    sx={{
                      fontSize: [2],
                      alignItems: "center",
                      color: "lightBorder",
                    }}
                  >
                    <Flex
                      sx={{ alignItems: "center", justifyContent: "start" }}
                    >
                      <Box
                        sx={{
                          borderRadius: "50%",
                          backgroundColor: "green",
                          width: "7px",
                          height: "7px",
                        }}
                      />
                    </Flex>
                    {order.status}
                  </Grid>
                </Box>
                <Box
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "lightBorder",
                    pt: [6],
                    mb: [6],
                  }}
                />

                <Box sx={{ my: [3] }}>
                  <Heading as="h2" variant="h2" sx={{ color: "primary" }}>
                    Dettagli della spedizione
                  </Heading>
                  <Box>
                    Spedizioni {order.shipments_count} di{" "}
                    {order.shipments_count}
                    {order.line_items.map(
                      (item) =>
                        item.sku_code && (
                          <Box sx={{ border: "1px solid" }}>
                            <Box>{item.sku_code}</Box>
                            <Box>{item.name}</Box>
                          </Box>
                        )
                    )}
                  </Box>
                </Box>
                <Box sx={{ my: [3] }}>
                  <Heading as="h2" variant="h2" sx={{ color: "primary" }}>
                    Informazioni sul pagamento
                  </Heading>
                  <Heading as="h4">Metodi di pagamento</Heading>
                  {order.payment_source_details.type}
                  <Heading as="h4">Indirizzo di fatturazione</Heading>
                  {customerMetadata && (
                    <Box>
                      {customerMetadata.company && (
                        <Box>
                          <strong>{customerMetadata.company}</strong>
                        </Box>
                      )}
                      {customerMetadata.line_1 && (
                        <Box>{customerMetadata.line_1}</Box>
                      )}
                      {customerMetadata.line_2 && (
                        <Box>{customerMetadata.line_2}</Box>
                      )}
                      <Box>
                        {customerMetadata.zip_code && customerMetadata.zip_code}{" "}
                        {customerMetadata.city && customerMetadata.city}{" "}
                        {customerMetadata.state_code &&
                          customerMetadata.state_code}{" "}
                        {customerMetadata.country_code &&
                          `(${customerMetadata.country_code})`}{" "}
                      </Box>
                      <Box>
                        {customerMetadata.phone && customerMetadata.phone}
                      </Box>
                      <Box>{customerMetadata.vat && customerMetadata.vat}</Box>
                      <Box>{customerMetadata.sdi && customerMetadata.sdi}</Box>
                    </Box>
                  )}
                  <Box sx={{ py: 3 }}>
                    <Heading as="h4">Indirizzo di spedizione</Heading>
                    {order && (
                      <Box>
                        {order.shipping_address.company && (
                          <Box>
                            <strong>{order.shipping_address.company}</strong>
                          </Box>
                        )}
                        {order.shipping_address.line_1 && (
                          <Box>{order.shipping_address.line_1}</Box>
                        )}
                        {order.shipping_address.line_2 && (
                          <Box>{order.shipping_address.line_2}</Box>
                        )}
                        <Box>
                          {order.shipping_address.zip_code &&
                            order.shipping_address.zip_code}{" "}
                          {order.shipping_address.city &&
                            order.shipping_address.city}{" "}
                          {order.shipping_address.state_code &&
                            order.shipping_address.state_code}{" "}
                          {order.shipping_address.country_code &&
                            `(${order.shipping_address.country_code})`}{" "}
                        </Box>
                        <Box>
                          {order.shipping_address.phone &&
                            order.shipping_address.phone}
                        </Box>
                        <Box>
                          {order.shipping_address.vat &&
                            order.shipping_address.vat}
                        </Box>
                        <Box>
                          {order.shipping_address.sdi &&
                            order.shipping_address.sdi}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box>
                  <Heading
                    as="h2"
                    variant="h5"
                    sx={{ color: "primary", pb: [6] }}
                  >
                    Riepilogo ordine
                  </Heading>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [6],
                    }}
                  >
                    <Box>
                      <Text sx={{ fontSize: [5] }}>Prodotti</Text>
                    </Box>
                    <Box sx={{ fontSize: [5], fontWeight: "600" }}>
                      {order.formatted_subtotal_taxable_amount}
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [6],
                    }}
                  >
                    <Text sx={{ fontSize: [5] }}>Spedizioni</Text>
                    <Box sx={{ fontSize: [5], fontWeight: "600" }}>
                      {order.formatted_shipping_taxable_amount}
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "start",
                      pb: [6],
                    }}
                  >
                    <Text sx={{ fontSize: [5] }}>Totale</Text>
                    <Box
                      sx={{
                        textAlign: "right",
                        fontSize: [5],
                        fontWeight: "600",
                      }}
                    >
                      {order.formatted_total_taxable_amount}
                      <br />
                      {`(${itemQuantity} articoli)`}
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [6],
                    }}
                  >
                    <Text sx={{ fontSize: [5] }}>Data ordine</Text>
                    <Box sx={{ fontSize: [5], fontWeight: "600" }}>
                      {new Date(order.placed_at).toLocaleDateString("it-IT", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [6],
                    }}
                  >
                    <Text sx={{ fontSize: [5] }}>Ordine #</Text>
                    <Box sx={{ fontSize: [5], fontWeight: "600" }}>
                      {order.number}
                    </Box>
                  </Flex>
                  <Box>
                    <InboundLink to={"order-again"}>
                      Ordina di nuovo
                    </InboundLink>
                  </Box>
                  <Box>
                    <Button >Scarica fattura</Button>
                  </Box>
                </Box>
                <Box sx={{ my: [3] }}>
                  <Box>
                    <InboundLink to="/account/support">Contattaci</InboundLink>
                  </Box>
                  <Box>
                    <InboundLink to={`/account/orders/${order.id}/return`}>
                      Richiedi un reso
                    </InboundLink>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CustomerOrder;
