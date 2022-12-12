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
import { InboundLink } from "../../../link";
import { useClSdk } from "../../../../hooks/useClSdk";
import { useParams } from "@reach/router";
import ProductThumb from "../../../productThumb";
import CustomerContext from "../../../../hooks/customerContext";
import CustomBreadcrumbs from "../../../customBreadcrumbs";
import CartSkeleton from "../../../skeleton/cart";
import { useBreakpointIndex } from "@theme-ui/match-media";
import { Helmet } from "react-helmet"

const CustomerOrder = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [customerMetadata, setCustomerMetadata] = useState();
  const [order, setOrder] = useState();
  const [orderId, setOrderId] = useState(useParams().orderId);
  const [itemQuantity, setItemQuantity] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState();
  const cl = useClSdk();

  const mediaIndex = useBreakpointIndex();

  const getOrder = async (id) => {
    const handleError = (e) => {
      console.log("invalid token", e);
    };

    const order = await cl.orders
      .retrieve(id, {
        include: [
          "line_items",
          "shipping_address",
          "attachments",
          "shipments",
          "shipments.shipping_method",
        ],
      })
      .catch(handleError);

    if (order) {
      console.log("order", order);
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
    setTimeout(() => {
      setShowSkeleton(false);
    }, 300);
  }, [orderId]);

  return (
    <Box>
      <Helmet>
        <title>{order && order.number ? `Ordine #${order.number}` : `Ordine`} | Socaf</title>
      </Helmet>
      <Container>
        {!showSkeleton && order ? (
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
            <Grid columns={["1fr", "1fr", ".7fr .3fr"]} gap={[1, 1, 12]}>
              <Box>
                <Box>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      flexDirection: ["row", "row", "column"],
                    }}
                  >
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
                            backgroundColor:
                              order.status === "placed"
                                ? "orange"
                                : "status.approved",
                            width: "7px",
                            height: "7px",
                          }}
                        />
                      </Flex>
                      {order.status === "placed"
                        ? "In approvazione"
                        : "Approvato"}
                    </Grid>
                  </Flex>
                </Box>
                {mediaIndex < 2 && (
                  <Box sx={{ pb: [0, 5, 6] }}>
                    <Flex
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "start",
                        pb: [4, 5, 6],
                      }}
                    >
                      <Text sx={{ fontSize: [1, 5] }}>Totale</Text>
                      <Box
                        sx={{
                          textAlign: "right",
                          fontSize: [1, 5],
                          fontWeight: "600",
                        }}
                      >
                        {order.formatted_total_taxable_amount}
                        <br />
                        {`(${itemQuantity} articolarticol${
                          itemQuantity > 0 ? "i" : "o"
                        })`}
                      </Box>
                    </Flex>
                    <Flex
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        pb: [4, 5, 6],
                      }}
                    >
                      <Text sx={{ fontSize: [1, 5] }}>Data ordine</Text>
                      <Box sx={{ fontSize: [1, 5], fontWeight: "600" }}>
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
                        pb: [4, 5, 6],
                      }}
                    >
                      <Text sx={{ fontSize: [1, 5] }}>Ordine #</Text>
                      <Box sx={{ fontSize: [1, 5], fontWeight: "600" }}>
                        {order.number}
                      </Box>
                    </Flex>
                    <Box
                      sx={{
                        a: {
                          width: "100%",
                          height: "100%",
                          textAlign: "center",
                          fontSize: [3],
                          fontWeight: "600",
                          borderRadius: "unset",
                          p: [3],
                          display: "inline-block",
                        },
                      }}
                    >
                      <InboundLink to={"order-again"} variant="buttons.primary">
                        Ordina di nuovo
                      </InboundLink>
                    </Box>
                    <Box
                      sx={{
                        a: {
                          width: "100%",
                          height: "100%",
                          textAlign: "center",
                          fontSize: [3],
                          fontWeight: "600",
                          borderRadius: "unset",
                          p: [3],
                          mt: [3],
                          display: "inline-block",
                        },
                      }}
                    >
                      <InboundLink
                        to={"order-again"}
                        variant="buttons.primaryEmpty"
                      >
                        Scarica fattura
                      </InboundLink>
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "lightBorder",
                    pt: [4, 5, 6],
                    mb: [4, 5, 6],
                  }}
                />

                <Box sx={{ my: [0, 3] }}>
                  <Heading as="h2" variant="h2" sx={{ color: "primary" }}>
                    Dettagli della spedizione
                  </Heading>
                  <Box>
                    <Box sx={{ pb: [8] }}>
                      Spedizioni {order.shipments_count} di{" "}
                      {order.shipments_count}
                    </Box>
                    <Grid sx={{ gridTemplateRows: ["auto"] }} gap={[6]}>
                      {order.line_items.map(
                        (item) =>
                          item.sku_code && (
                            <ProductThumb sku={item} horizontal={true} />
                          )
                      )}
                    </Grid>
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "lightBorder",
                    pt: [4, 5, 6],
                    mb: [4, 5, 6],
                  }}
                />
                <Box sx={{ my: [3] }}>
                  <Heading as="h2" variant="h2" sx={{ color: "primary" }}>
                    Informazioni sul pagamento
                  </Heading>
                  <Heading
                    as="h3"
                    variant="h5"
                    sx={{ fontWeight: "600", color: "dark" }}
                  >
                    Metodo di pagamento
                  </Heading>
                  <Flex>
                    {order.payment_source_details.type === "stripe_payment" ? (
                      <>
                        {
                          order.payment_source_details.payment_method_details
                            .brand
                        }
                        <br />
                        finisce con{" "}
                        {
                          order.payment_source_details.payment_method_details
                            .last4
                        }
                        <br />
                        scadenza:{" "}
                        {
                          order.payment_source_details.payment_method_details
                            .exp_month
                        }
                        {
                          order.payment_source_details.payment_method_details
                            .exp_year
                        }
                      </>
                    ) : (
                      customerMetadata &&
                      <>
                        <Box>
                          {customerMetadata.payment_method}
                        </Box>
                        <Box>{customerMetadata.payment_term}</Box>
                      </>
                    )}
                  </Flex>
                  <Heading
                    as="h3"
                    variant="h5"
                    sx={{ fontWeight: "600", color: "dark" }}
                  >
                    Indirizzo di fatturazione
                  </Heading>
                  {customerMetadata && (
                    <Box sx={{ fontSize: [1, 5] }}>
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
                  <Box
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "lightBorder",
                      pt: [4, 5, 6],
                      mb: [4, 5, 6],
                    }}
                  />
                  <Box sx={{ pb: [0, 3] }}>
                    <Heading as="h2" variant="h2" sx={{ color: "primary" }}>
                      Indirizzo di spedizione
                    </Heading>
                    {order && (
                      <>
                        <Box sx={{ fontSize: [1, 5] }}>
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

                        <Heading
                          as="h3"
                          variant="h5"
                          sx={{ fontWeight: "600", color: "dark" }}
                        >
                          Modalità di spedizione
                        </Heading>
                        <Box>
                          {order.shipments[0] &&
                            order.shipments[0].shipping_method.name}
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: ["block", "block", "none"],
                  borderBottom: "1px solid",
                  borderColor: "lightBorder",
                  pt: [4, 5, 6],
                  mb: [4, 5, 6],
                }}
              />
              <Box>
                <Box sx={{ pb: [0, 5, 6] }}>
                  <Heading
                    as="h2"
                    variant="h2"
                    sx={{ color: "primary", my: [0], pb: [4, 5, 6] }}
                  >
                    Riepilogo ordine
                  </Heading>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [4, 5, 6],
                    }}
                  >
                    <Box>
                      <Text sx={{ fontSize: [1, 5] }}>Articoli</Text>
                    </Box>
                    <Box sx={{ fontSize: [1, 5], fontWeight: "600" }}>
                      {order.formatted_subtotal_taxable_amount}
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [4, 5, 6],
                    }}
                  >
                    <Text sx={{ fontSize: [1, 5] }}>Spedizione</Text>
                    <Box sx={{ fontSize: [1, 5], fontWeight: "600" }}>
                      {order.formatted_shipping_taxable_amount}
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "start",
                      pb: [4, 5, 6],
                    }}
                  >
                    <Text sx={{ fontSize: [1, 5] }}>Totale</Text>
                    <Box
                      sx={{
                        textAlign: "right",
                        fontSize: [1, 5],
                        fontWeight: "600",
                      }}
                    >
                      {order.formatted_total_taxable_amount}
                      <br />
                      {`(${itemQuantity} articol${
                        itemQuantity > 0 ? "i" : "o"
                      })`}
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      display: ["none", "none", "flex"],
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [4, 5, 6],
                    }}
                  >
                    <Text sx={{ fontSize: [1, 5] }}>Data ordine</Text>
                    <Box sx={{ fontSize: [1, 5], fontWeight: "600" }}>
                      {new Date(order.placed_at).toLocaleDateString("it-IT", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      display: ["none", "none", "flex"],
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [4, 5, 6],
                    }}
                  >
                    <Text sx={{ fontSize: [1, 5] }}>Ordine #</Text>
                    <Box sx={{ fontSize: [1, 5], fontWeight: "600" }}>
                      {order.number}
                    </Box>
                  </Flex>
                  <Box
                    sx={{
                      display: ["none", "none", "block"],
                      a: {
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        fontSize: [3],
                        fontWeight: "600",
                        borderRadius: "unset",
                        p: [3],
                        display: "inline-block",
                      },
                    }}
                  >
                    <InboundLink to={"order-again"} variant="buttons.primary">
                      Ordina di nuovo
                    </InboundLink>
                  </Box>
                  <Box
                    sx={{
                      display: ["none", "none", "block"],
                      a: {
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        fontSize: [3],
                        fontWeight: "600",
                        borderRadius: "unset",
                        p: [3],
                        mt: [3],
                        display: "inline-block",
                      },
                    }}
                  >
                    <InboundLink
                      to={"order-again"}
                      variant="buttons.primaryEmpty"
                    >
                      Scarica fattura
                    </InboundLink>
                  </Box>
                </Box>
                <Box
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "lightBorder",
                    pt: [4, 5, 6],
                    mb: [4, 5, 6],
                  }}
                />
                <Box sx={{ py: [0, 3] }}>
                  <Heading
                    as="h2"
                    variant="h2"
                    sx={{ color: "primary", my: [3] }}
                  >
                    Hai bisogno di aiuto?
                  </Heading>
                  <Box>
                    <Box
                      sx={{
                        a: {
                          width: "100%",
                          height: "100%",
                          textAlign: "center",
                          fontSize: [3],
                          fontWeight: "600",
                          borderRadius: "unset",
                          p: [3],

                          display: "inline-block",
                        },
                      }}
                    >
                      <InboundLink
                        to="/account/support"
                        variant="buttons.primary"
                      >
                        Contattaci
                      </InboundLink>
                    </Box>
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        a: {
                          width: "100%",
                          height: "100%",
                          textAlign: "center",
                          fontSize: [3],
                          fontWeight: "600",
                          borderRadius: "unset",
                          p: [3],
                          mt: [3],
                          display: "inline-block",
                        },
                      }}
                    >
                      <InboundLink
                        to={`/account/orders/${order.id}/return`}
                        variant="buttons.primaryEmpty"
                      >
                        Richiedi un reso
                      </InboundLink>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </>
        ) : (
          <CartSkeleton />
        )}
      </Container>
    </Box>
  );
};

export default CustomerOrder;
