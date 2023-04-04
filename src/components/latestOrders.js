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
import LocationMapIcon from "../assets/img/icons/map-pin.inline.svg";
import { useResponsiveValue, useBreakpointIndex } from "@theme-ui/match-media";

const LatestOrders = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    orderByDate: "desc",
    orderByTime: "180",
    orderByAddress: [],
  });
  const mediaIndex = useBreakpointIndex();

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
    
  }, [filters]);

  return filteredOrders.length > 0 ? (
    <Box sx={{ backgroundColor: "primary" }}>
      <Container>
        <Flex sx={{
          alignItems:"center",
          justifyContent:"space-between",
          mb: [2, 4, 9]
        }}>
        <Heading
          as="h2"
          variant="h2"
          color="light"
          sx={{ mt: [2,0], mb:[0,0] }}
        >
          Ultimi ordini
        </Heading>
        <InboundLink to={"/account/orders"} sx={{
          color:"light",

        }}>
          Vedi tutti
        </InboundLink>
        </Flex>
        <Grid columns={["1fr", "repeat(3,1fr)", "repeat(4,1fr)"]} gap={[0]}>
          {filteredOrders
            .slice(0, mediaIndex > 1 ? 4 : 3)
            .map((order, index) => (
              <InboundLink
                sx={{
                  py: [3],
                  pl: [0, index === 0 ? 0 : 9],
                  pr: [0, index === filteredOrders.length - 1 ? 0 : 9],
                  color: "light",
                  borderRight: [
                    "unset",
                    index !=
                      filteredOrders.slice(0, mediaIndex > 1 ? 4 : 3).length -
                        1 && "1px solid",
                  ],
                  borderBottom: [
                    index !=
                      filteredOrders.slice(0, mediaIndex > 1 ? 4 : 3).length -
                        1 && "1px solid",
                    "unset",
                  ],
                  display: "inline-block",
                  textDecoration: "none",
                  borderColor: "lighter",
                  width: "100%",
                }}
                to={`/account/orders/${order.id}`}
              >
                <Box>
                  <Box sx={{ pb: [1, 5], display:["flex","block"], justifyContent:"space-between", alignItems:"center"}}>
                    <Text sx={{ fontSize: [3] }}>
                      Ordine{" "}
                      <Box as="span" sx={{ fontWeight: 600 }}>
                        #{order.number}
                      </Box>
                    </Text>
                    <Box
                      sx={{
                        display:["block","none"],
                        fontSize: [1],
                        alignItems: "center",
                        pb: [1],
                        fontWeight: "600",
                      }}
                    >
                      <Box>{order.formatted_total_amount_with_taxes}</Box>
                    </Box>
                  </Box>
                  <Grid
                    columns={["16px auto"]}
                    gap={[0]}
                    sx={{ fontSize: [1], alignItems: "center", pb: [1] }}
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
                    {order.status === "placed" ? "In approvazione":"Approvato"  }
                  </Grid>
                  <Grid
                    columns={["16px auto"]}
                    gap={[0]}
                    sx={{ fontSize: [1], alignItems: "center", pb: [1] }}
                  >
                    <Flex
                      sx={{
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <LocationMapIcon />
                    </Flex>
                    {order.shipping_address.last_name}
                  </Grid>
                  <Box sx={{ fontSize: [1], color: "lighter", pb: [0, 5] }}>
                    {new Date(order.placed_at).toLocaleDateString("it-IT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: ["none", "block"],
                    fontSize: [1],
                    alignItems: "center",
                    pb: [1],
                    fontWeight: "600",
                  }}
                >
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
