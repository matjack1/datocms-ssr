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
} from "theme-ui";
import CustomerTokenContext from "../../../../hooks/customerTokenContext";
import Nav from "../../../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../../link";
import { useClSdk } from "../../../../hooks/useClSdk";
import { useParams } from "@reach/router";
import ProductThumb from "../../../productThumb";
import CustomerContext from "../../../../hooks/customerContext";

const CustomerOrder = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [customerMetadata, setCustomerMetadata] = useState();
  const [order, setOrder] = useState();
  const [orderId, setOrderId] = useState(useParams().orderId);
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
      console.log("order", order);
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
            <Box>
              <Box>
                <Flex sx={{ justifyContent: "space-between" }}>
                  <Heading as="h1">Dettagli ordine</Heading>
                  <Box>{order.status}</Box>
                </Flex>
                <Flex sx={{ justifyContent: "space-between" }}>
                  <Box>Totale ordine</Box>
                  <Box>{order.formatted_total_taxable_amount}</Box>
                </Flex>
                <Flex sx={{ justifyContent: "space-between" }}>
                  <Box>
                    {new Date(order.placed_at).toLocaleDateString("it-IT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Box>
                </Flex>
                <Flex sx={{ justifyContent: "space-between" }}>
                  <Box>Ordine #</Box>
                  <Box>{order.number}</Box>
                </Flex>
                <Box>
                  <Button>Scarica fattura</Button>
                </Box>
                <Box>
                  <InboundLink to={"order-again"}>Ordina di nuovo</InboundLink>
                </Box>
              </Box>
            </Box>
            <Box sx={{ my: [3] }}>
              <Heading as="h2">Dettagli della spedizione</Heading>
              <Box>
                Spedizioni {order.shipments_count} di {order.shipments_count}
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
              <Heading as="h2">Informazioni sul pagamento</Heading>
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
                    {customerMetadata.state_code && customerMetadata.state_code}{" "}
                    {customerMetadata.country_code &&
                      `(${customerMetadata.country_code})`}{" "}
                  </Box>
                  <Box>{customerMetadata.phone && customerMetadata.phone}</Box>
                  <Box>{customerMetadata.vat && customerMetadata.vat}</Box>
                  <Box>{customerMetadata.sdi && customerMetadata.sdi}</Box>
                </Box>
              )}
              <Box sx={{ my: [3] }}>
                <Heading as="h2">Riepilogo</Heading>
                <Flex sx={{ justifyContent: "space-between" }}>
                  <Box>Prodotti</Box>
                  <Box>{order.formatted_subtotal_taxable_amount}</Box>
                </Flex>
                <Flex sx={{ justifyContent: "space-between" }}>
                  <Box>Spedizioni</Box>
                  <Box>{order.formatted_shipping_taxable_amount}</Box>
                </Flex>
                <Flex sx={{ justifyContent: "space-between" }}>
                  <Box>Totale</Box>
                  <Box>{order.formatted_total_taxable_amount}</Box>
                </Flex>
              </Box>
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
                      {order.shipping_address.vat && order.shipping_address.vat}
                    </Box>
                    <Box>
                      {order.shipping_address.sdi && order.shipping_address.sdi}
                    </Box>
                  </Box>
                )}
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
          </>
        )}
      </Container>
    </Box>
  );
};

export default CustomerOrder;
