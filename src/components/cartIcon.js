import React, { useContext, useEffect, useState } from "react";
import { Box } from "theme-ui";
import CartContext from "../hooks/cartContext";
import CustomerContext from "../hooks/customerContext";
import CustomerTokenContext from "../hooks/customerTokenContext";
import { useClSdk } from "../hooks/useClSdk";
import { getCartPath } from "../utils/path";
import { InboundLink } from "./link";

const CartIcon = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  const { cart, setCart } = useContext(CartContext);
  const [order, setOrder] = useState(null);
  const cl = useClSdk();

  const getCostumer = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        // console.log("invalid token", e);
      }
    };

    const customer = await cl.customers
      .retrieve(customerToken.owner_id, { include: ["orders"] })
      .catch(handleError);

    if (customer) {
      console.log(customer);
      setCustomer(customer);
    }
  };

  const getOrder = async (id) => {
    console.log("getOrder");
    const handleError = (e) => {
      console.log("invalid token", e);
    };

    const order = await cl.orders
      .retrieve(id, { include: ["line_items"], filters: { status: "draft" } })
      .catch(handleError);

    if (order) {
      console.log(order);
      setOrder(order);
    }
  };

  const createOrder = async () => {
    const attributes = {
      customer_email: customer.email,
    };
    const handleError = (e) => {
      console.log(e);
    };

    const newOrder = await cl.orders.create(attributes).catch(handleError);

    if (newOrder) {
      getCostumer();
      getOrder(newOrder.id);
    }
  };

  useEffect(() => {
    if (customer) {
      // da modificare più avanti, qui bisogna considerare solo i draft o pending
      console.log("customer.orders",customer.orders.filter(x => x.status === "status" || x.status === "pending" ).length > 0)
      if (customer.orders.length === 0) {
        createOrder();
      } else {
        getOrder(customer.orders[0].id);
      }
    }
  }, [customer]);

  useEffect(() => {
    if (order) {
      console.log(order);
      setCart(order);
    }
  }, [order]);

  return (
    <>
      {customer && (
        <InboundLink to={getCartPath()}>
          <Box>{cart && <Box>{cart.skus_count}</Box>}</Box>
          {/* <Box>{customer && <Box>{customer.orders[0].line_items.length}</Box>}</Box> */}
        </InboundLink>
      )}
    </>
  );
};

export default CartIcon;
