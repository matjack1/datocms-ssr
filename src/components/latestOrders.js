import React, { useContext, useEffect, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Grid,
  Label,
  Input,
  Text,
  Flex,
  Radio,
  Button,
  Checkbox,
} from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";
import { InboundLink } from "./link";
import CustomerContext from "../hooks/customerContext";
import { HiOutlineLocationMarker } from "react-icons/hi";

const LatestOrders = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    orderByDate: "desc",
    orderByTime: "180",
    orderByAddress: [],
  });

  const handleOrder = () => {
    var today = new Date();
    var priorDate = new Date(
      new Date().setDate(today.getDate() - filters.orderByTime)
    );

    const filteredOrdersTMP = orders.filter((order) => {
      return (
        order.status !== "draft" &&
        order.status !== "pending" &&
        new Date(order.created_at).getTime() >= priorDate.getTime() &&
        new Date(order.created_at).getTime() <= today.getTime() &&
        (filters.orderByAddress.length > 0
          ? filters.orderByAddress.filter(
              (id) => order.shipping_address.id === id
            ).length > 0
          : true)
      );
    });

    filteredOrdersTMP.sort(function (a, b) {
      if (filters.orderByDate === "desc")
        return new Date(b.placed_at) - new Date(a.placed_at);
      else return new Date(a.placed_at) - new Date(b.placed_at);
    });
    setFilteredOrders(filteredOrdersTMP);
  };

  useEffect(() => {
    if (customer && customer.orders.length > 0) setOrders(customer.orders);
  }, [customer]);

  useEffect(() => {
    if (orders.length > 0) {
      handleOrder();
    }
  }, [orders]);

  useEffect(() => {
    if (orders.length > 0) handleOrder();
    console.log(filters);
  }, [filters]);

  return filteredOrders.length > 0 ? (
    <Box sx={{ backgroundColor: "primary" }}>
      <Container>
        <Heading as="h2" variant="h2" color="light" sx={{ mt: [0], mb: [9] }}>
          Ultimi ordini
        </Heading>
        <Grid columns={[1, "repeat(4,1fr)"]} gap={[0]}>
          {filteredOrders.slice(0, 4).map((order,index) => (
            <InboundLink
              sx={{
                pl:[index === 0 ? 0 : 9],
                pr:[index === filteredOrders.length - 1 ? 0 : 9],
                color: "light",
                borderRight: index != filteredOrders.length - 1 && "1px solid",
                display: "inline-block",
                textDecoration: "none",
                borderColor: "lighter",
                width: "100%",
              }}
              to={`/account/orders/${order.id}`}
            >
              <Box>
                <Box sx={{ pb: [5] }}>
                  <Text sx={{ fontSize: [3] }}>
                    Ordine{" "}
                    <Box as="span" sx={{ fontWeight: 600 }}>
                      #{order.number}
                    </Box>
                  </Text>
                </Box>
                <Grid
                  columns={["20px auto"]}
                  gap={[0]}
                  sx={{ fontSize: [1], alignItems: "center", pb:["10px"] }}
                >
                  <Flex sx={{ alignItems: "center", justifyContent: "start" }}>
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
                <Grid
                  columns={["20px auto"]}
                  gap={[0]}
                  sx={{ fontSize: [1], alignItems: "center", pb:["10px"] }}
                >
                  <Flex sx={{ alignItems: "center", justifyContent: "start" }}>
                    <HiOutlineLocationMarker size={14} />
                  </Flex>
                  {order.shipping_address.last_name}
                </Grid>
                <Box sx={{ fontSize: [1], color: "lighter", pb:[5] }}>
                  {new Date(order.placed_at).toLocaleDateString("it-IT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Box>
              </Box>

              <Box sx={{ fontSize: [1], alignItems: "center", pb:["10px"], fontWeight:"600" }}>
                <Box>{order.formatted_total_amount_with_taxes}</Box>
              </Box>
            </InboundLink>
          ))}
        </Grid>
      </Container>
    </Box>
  ) : null;
};

export default LatestOrders;
