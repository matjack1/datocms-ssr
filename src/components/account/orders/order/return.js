import React, { useContext, useState, useEffect } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Label,
  Input,
  Text,
  Checkbox,
  Textarea,
  Button,
} from "theme-ui";
import CustomerTokenContext from "../../../../hooks/customerTokenContext";
import Nav from "../../../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../../link";
import { useParams } from "@reach/router";
import { useClSdk } from "../../../../hooks/useClSdk";
import CustomerContext from "../../../../hooks/customerContext";

const CustomerOrderReturn = () => {
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
      .retrieve(id, { include: ["line_items"], filters: { status: "draft" } })
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
    console.log("useParams()", orderId);
    getOrder(orderId);
  }, [orderId]);

  const handleAskReturn = (e) => {
    e.preventDefault();

    let obj = {
      products: [],
      message: e.target.reason.value
    };

    order.line_items.map((item, index) => {
      if (e.target["item" + (index - 2)] &&  e.target["item" + (index - 2)].checked) obj.products.push(item);
      
      return item
    });

    console.log(obj,e.target);
  };

  return (
    <Box>
      {order && (
        <>
          <Heading as="h1">Richiedi un reso</Heading>
          <Box as="form" onSubmit={handleAskReturn}>
            <Box>Seleziona prodotti</Box>
            {order.line_items.map(
              (item, index) =>
                item.sku_code && (
                  <Box>
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
                        name={"item" + (index - 2)}
                        sx={{
                          color: "dark",
                          "input:checked~&": {
                            color: "primary",
                          },
                        }}
                      />
                      {item.name}
                    </Label>
                  </Box>
                )
            )}
            <Box>
              Motivo del reso
              <Textarea name="reason"  required />
            </Box>
            <Box>
              <Button type="submit">Inoltra la richiesta di reso</Button>
            </Box>
            <Box>
              <Label>
                La richiesta di reso verrà esaminata dal nostro servizio clienti
              </Label>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CustomerOrderReturn;
