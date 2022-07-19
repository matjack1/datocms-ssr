import React, { useContext, useEffect, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import { Box, Container, Heading, Label, Input, Text, Flex } from "theme-ui";
import CustomerTokenContext from "../../../hooks/customerTokenContext";
import Nav from "../../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../link";
import CustomerContext from "../../../hooks/customerContext";

const CustomerOrders = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (customer && customer.orders.length > 0) setOrders(customer.orders);
  }, [customer]);

  return (
    <Box>
      <Heading as="h1">I tuoi ordini</Heading>
      <Box sx={{ margin: "0 auto", width: "80%" }}>
        {orders.length > 0 ? (
          orders.map(
            (order) =>
              (order.status !== "draft" && order.status !== "pending") && (
                <InboundLink
                  sx={{
                    borderTop: "1px solid",
                    display: "inline-block",
                    textDecoration: "none",
                    borderColor: "dark",
                    width: "100%",
                  }}
                  to={`/account/orders/${order.id}`}
                >
                  <Flex sx={{ justifyContent: "space-between" }}>
                    <Box>
                      <Box>Ordine # {order.number}</Box>
                      <Box>
                        {new Date(order.placed_at).toLocaleDateString("it-IT", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Box>
                      <Box>{order.status}</Box>
                    </Box>
                    <Box>
                      <Box>{order.formatted_total_amount_with_taxes}</Box>
                    </Box>
                  </Flex>
                </InboundLink>
              )
          )
        ) : (
          <Box>Nessun ordine effettuato</Box>
        )}
      </Box>
    </Box>
  );
};

export default CustomerOrders;
