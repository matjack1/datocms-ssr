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
  Radio,
  Grid,
  Button,
  Checkbox,
} from "theme-ui";
import CustomerTokenContext from "../../../hooks/customerTokenContext";
import Nav from "../../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../link";
import CustomerContext from "../../../hooks/customerContext";
import CustomBreadcrumbs from "../../customBreadcrumbs";
import { TruncateEllipsis } from "../../../utils/truncateEllipsis";
import OrderThumb from "../../orderThumb";
import OrderCounter from "../../orderCounter";

const CustomerOrders = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [checkAll, setCheckAll] = useState(null);
  const [checkedCounter, setCheckedCounter] = useState(0);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    orderByDate: "desc",
    orderByTime: "180",
    orderByAddress: [],
  });
  const [shippingAddresses, setShippingAddresses] = useState([]);

  useEffect(() => {
    if (customer && customer.orders.length > 0) setOrders(customer.orders);
  }, [customer]);

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
          ? filters.orderByAddress.filter((reference) => {
              return order.shipping_address.reference === reference;
            }).length > 0
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
    if (orders.length > 0) {
      handleOrder();
      let shippingAddressesTMP = [];

      orders.forEach((order) => {
        if (order.status !== "draft" && order.status !== "pending") {
          console.log(order.shipping_address.reference);
          shippingAddressesTMP.push(order.shipping_address);
        }
      });

      shippingAddressesTMP = shippingAddressesTMP.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.reference === value.reference)
      );

      setShippingAddresses(shippingAddressesTMP);
    }
  }, [orders]);

  useEffect(() => {
    if (orders.length > 0) handleOrder();

    console.log(filters);
  }, [filters]);

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
              title: "Ordini",
            },
          }}
        />
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
            I tuoi ordini
          </Heading>
          {filteredOrders.length > 0 && (
            <OrderCounter orders={filteredOrders} />
          )}
        </Flex>
        <Grid columns={[1, ".85fr 4.15fr"]}>
          <Box>
            <Box>
              <Box sx={{ pb: [3] }}>
                <Text
                  sx={{
                    fontWeight: "600",
                    textDecoration: "none",
                    color: "dark",
                  }}
                >
                  Ordina per
                </Text>
              </Box>
              <LabeledRadio
                name="orderbydate"
                value="desc"
                defaultChecked={true}
                checkedCheckbox={(e) => {
                  setCheckedCounter(1);
                  setFilters((prevState) => ({
                    ...prevState,
                    orderByDate: e,
                  }));
                }}
                required={true}
              >
                Data (desc.)
              </LabeledRadio>
              <LabeledRadio
                name="orderbydate"
                value="asc"
                defaultChecked={false}
                checkedCheckbox={(e) => {
                  setCheckedCounter(1);
                  setFilters((prevState) => ({
                    ...prevState,
                    orderByDate: e,
                  }));
                }}
                required={true}
              >
                Data (asc.)
              </LabeledRadio>
            </Box>
            <Box
              sx={{
                borderBottom: "1px solid",
                borderColor: "lightBorder",
                pt: [4],
                mb: [4],
              }}
            />
            <Box>
              <Box sx={{ pb: [3] }}>
                <Text
                  sx={{
                    fontWeight: "600",
                    textDecoration: "none",
                    color: "dark",
                  }}
                >
                  Intervallo termporale
                </Text>
              </Box>
              <LabeledRadio
                name="orderbytime"
                value="30"
                defaultChecked={false}
                checkedCheckbox={(e) => {
                  setCheckedCounter(1);
                  setFilters((prevState) => ({
                    ...prevState,
                    orderByTime: e,
                  }));
                }}
                required={true}
              >
                Ultimi 30 giorni
              </LabeledRadio>
              <LabeledRadio
                name="orderbytime"
                value="180"
                defaultChecked={true}
                checkedCheckbox={(e) => {
                  setCheckedCounter(1);
                  setFilters((prevState) => ({
                    ...prevState,
                    orderByTime: e,
                  }));
                }}
                required={true}
              >
                Ultimi 6 mesi
              </LabeledRadio>
              <LabeledRadio
                name="orderbytime"
                value="365"
                defaultChecked={false}
                checkedCheckbox={(e) => {
                  setCheckedCounter(1);
                  setFilters((prevState) => ({
                    ...prevState,
                    orderByTime: e,
                  }));
                }}
                required={true}
              >
                2022
              </LabeledRadio>
            </Box>
            <Box
              sx={{
                borderBottom: "1px solid",
                borderColor: "lightBorder",
                pt: [4],
                mb: [4],
              }}
            />
            {orders.length > 0 && (
              <Box>
                <Box sx={{ pb: [3] }}>
                  <Text
                    sx={{
                      fontWeight: "600",
                      textDecoration: "none",
                      color: "dark",
                    }}
                  >
                    Indirizzo di spedizione
                  </Text>
                </Box>
                {shippingAddresses.map((address) => (
                  <LabeledCheckbox
                    defaultChecked={checkAll}
                    checkedCheckbox={(e) => {
                      setCheckedCounter(1);

                      let tmpArray = [...filters.orderByAddress];
                      tmpArray.push(address.reference);
                      let uniqueArray = tmpArray.filter(function (item, pos) {
                        return e ? item !== address : item === address;
                      });

                      setFilters((prevState) => ({
                        ...prevState,
                        orderByAddress: uniqueArray,
                      }));
                    }}
                    required={true}
                  >
                    <Text
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {address.city}, {address.line_1}
                    </Text>
                  </LabeledCheckbox>
                ))}
              </Box>
            )}
          </Box>
          <Box sx={{ width: "100%" }}>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(
                (order) =>
                  order.status !== "draft" &&
                  order.status !== "pending" && (
                    <Box>
                      <Box sx={{}}>
                        <OrderThumb order={order} />
                      </Box>
                      <Box
                        sx={{
                          borderBottom: "1px solid",
                          borderColor: "lightBorder",
                          pt: [6],
                          mb: [6],
                        }}
                      />
                    </Box>
                  )
              )
            ) : (
              <Box>Nessun ordine effettuato</Box>
            )}
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

const LabeledRadio = ({
  children,
  value,
  name,
  defaultChecked,
  checkedCheckbox,
  ...props
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    if (defaultChecked === false) {
      setChecked(defaultChecked);
    }
  }, [defaultChecked]);

  return (
    <Label
      sx={{
        display: "flex",
        alignItems: "center",
        color: "dark",
        "input:checked~.css-kydphz": {
          color: "secondary",
          outlineColor: "secondary",
        },
        "input:checked~ svg": {
          color: "secondary",
          outlineColor: "secondary",
        },
        svg: {
          color: "secondaryText",
        },
      }}
    >
      <Radio
        name={name}
        value={value}
        sx={{
          color: "dark",
          "input:checked~&": {
            color: "primary",
          },
        }}
        defaultChecked={defaultChecked}
        onChange={() => {
          checkedCheckbox(value);
          setChecked(!checked);
        }}
        {...props}
      />
      {children}
    </Label>
  );
};

const LabeledCheckbox = ({
  children,
  defaultChecked,
  checkedCheckbox,
  ...props
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    if (defaultChecked === false) {
      setChecked(defaultChecked);
    }
  }, [defaultChecked]);

  return (
    <Label
      sx={{
        pb: [3],
        display: "flex",
        alignItems: "center",
        color: "dark",
        "input:checked~.css-kydphz": {
          color: "secondaryText",
          outlineColor: "secondary",
        },
        svg: {
          color: "secondaryText",
        },
      }}
    >
      <Checkbox
        sx={{
          color: "dark",
          "input:checked~&": {
            color: "secondary",
            outlineColor: "secondary",
          },
        }}
        checked={checked}
        onChange={() => {
          checkedCheckbox(!checked);
          setChecked(!checked);
        }}
        {...props}
      />
      {children}
    </Label>
  );
};

export default CustomerOrders;