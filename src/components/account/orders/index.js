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
  Button,
  Checkbox,
} from "theme-ui";
import CustomerTokenContext from "../../../hooks/customerTokenContext";
import Nav from "../../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../link";
import CustomerContext from "../../../hooks/customerContext";

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
    if (orders.length > 0) {
      handleOrder();
      let shippingAddressesTMP = [];

      orders.forEach((order) => {
        if (order.status !== "draft" && order.status !== "pending") {
          shippingAddressesTMP.push(order.shipping_address);
        }
      });

      shippingAddressesTMP.reduce((unique, o) => {
        if (!unique.some((obj) => obj.id === o.id && obj.id === o.id)) {
          unique.push(o);
        }
        return unique;
      }, []);

      setShippingAddresses(shippingAddressesTMP);
    }
  }, [orders]);

  useEffect(() => {
    if (orders.length > 0) handleOrder();

    console.log(filters);
  }, [filters]);

  return (
    <Box>
      <Heading as="h1">I tuoi ordini</Heading>
      <Flex>
        <Box>
          <Heading>Filtri</Heading>
          <Box sx={{ py: [3] }}>
            <Text>
              <strong>Ordina per</strong>
            </Text>
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
          <Box sx={{ py: [3] }}>
            <Text>
              <strong>Intervallo termporale</strong>
            </Text>
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
          {orders.length > 0 && (
            <Box sx={{ py: 3 }}>
              <strong>Indirizzo di spedizione</strong>
              {shippingAddresses.map((address) => (
                <LabeledCheckbox
                  defaultChecked={checkAll}
                  checkedCheckbox={(e) => {
                    setCheckedCounter(1);

                    let tmpArray = [...filters.orderByAddress];
                    tmpArray.push(address.id);
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
                  {address.city}, {address.line_1}
                </LabeledCheckbox>
              ))}
            </Box>
          )}
        </Box>
        <Box sx={{ margin: "0 auto", width: "80%" }}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(
              (order) =>
                order.status !== "draft" &&
                order.status !== "pending" && (
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
                          {new Date(order.placed_at).toLocaleDateString(
                            "it-IT",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
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
      </Flex>
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
          color: "secondaryText",
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
        display: "flex",
        alignItems: "center",
        color: "dark",
        "input:checked~.css-kydphz": {
          color: "secondaryText",
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
            color: "primary",
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
