import React, { useContext, useEffect, useState } from "react";
import { Box } from "theme-ui";
import CartContext from "../hooks/cartContext";
import CustomerContext from "../hooks/customerContext";
import CustomerTokenContext from "../hooks/customerTokenContext";
import { useClSdk } from "../hooks/useClSdk";
import { getCartPath } from "../utils/path";
import { InboundLink } from "./link";
import { navigate } from "gatsby";
import { BsBag } from "react-icons/bs";
import { getColor } from "@theme-ui/color";
import theme from "../gatsby-plugin-theme-ui";

const CartIcon = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  const { cart, setCart } = useContext(CartContext);
  const [order, setOrder] = useState(null);
  const cl = useClSdk();
  const dark = getColor(theme, "dark");

  const getCustomer = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    const customer = await cl.customers
      .retrieve(customerToken.owner_id, {
        include: ["orders", "orders.shipping_address", "shipping"],
      })
      .catch(handleError);

    if (customer) {
      setCustomer(customer);
    }
  };

  const getOrder = async (id) => {
    const handleError = (e) => {
      console.log("invalid token", e);
    };

    const order = await cl.orders
      .retrieve(id, { include: ["line_items"], filters: { status: "draft" } })
      .catch(handleError);

    if (order) {
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
      let tmpCustomer = { ...customer };

      let ordersPendingDraft = tmpCustomer.orders.filter(
        (x) => x.status === "draft" || x.status === "pending"
      );

      if (ordersPendingDraft.length > 0) {
        getOrder(ordersPendingDraft[ordersPendingDraft.length - 1].id);
      } else {
        createOrder();
      }
    }
  }, [customer]);

  useEffect(() => {
    if (order) {
      setCart(order);
    }
  }, [order]);


  return (
    <>
      {customer && (
        <InboundLink to={getCartPath()}>
          <Box sx={{ position: "relative" }}>
            <BsBag size={24} color={dark} />
            <Box
              sx={{
                position:"absolute",
                top: "-0.5em",
                right: "-0.6em",
                backgroundColor: "primary",
                color: "light",
                fontSize: ["10px"],
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width:cart && cart.skus_count > 99 ? "24px" : "18px",
                height:"18px",
                borderRadius: cart && cart.skus_count > 99 ? "16px" : "50%",
              }}
            >
              {cart && <Box>{cart.skus_count}</Box>}
            </Box>
          </Box>

          {/* <Box>{customer && <Box>{customer.orders[0].line_items.length}</Box>}</Box> */}
        </InboundLink>
      )}
    </>
  );
};

export default CartIcon;
