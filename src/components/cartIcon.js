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

  const getCustomer = async () => {
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
      getCustomer();
      getOrder(newOrder.id);
    }
  };

  useEffect(() => {
    if (customer) {
      // da modificare più avanti, qui bisogna considerare solo i draft o pending
      let tmpCustomer = {...customer}

      let ordersPendingDraft = tmpCustomer.orders.filter(
        (x) => x.status === "draft" || x.status === "pending"
      );

      if (ordersPendingDraft.length > 0) {
        console.log("ordersPendingDraft",ordersPendingDraft)
        getOrder(ordersPendingDraft[ordersPendingDraft.length - 1].id)
      } else {
        console.log("createOrder");
        createOrder();
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
