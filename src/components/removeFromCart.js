import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Text } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import getOrder from "../hooks/getOrder";
import CartContext from "../hooks/cartContext";
import { getColor } from "@theme-ui/color";
import theme from "../gatsby-plugin-theme-ui";
import TrashIcon from "../assets/img/icons/cestino.inline.svg"
import { navigate } from "gatsby";

const RemoveFromCart = ({ sku }) => {
  const lightBorder = getColor(theme, "dark");
  const primary = getColor(theme, "primary");
  const { cart, setCart } = useContext(CartContext);
  const cl = useClSdk();

  const deleteLineItem = async () => {
    
    const handleError = (e) => {
      console.log("error", e);
      if (e.errors[0].code === "INVALID_TOKEN") {
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    const lineItem = await cl.line_items
      .delete(sku.id)
      .catch(handleError);

    getOrder(cl, cart.id)
      .then((value) => {
        setCart(value);
        console.log(value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeFromCart = () => {
    console.log("RemoveFromCart");
    deleteLineItem();
  };

  return (
    <Box>
      <Button
        onClick={() => removeFromCart()}
        sx={{
          backgroundColor: "transparent",
          color: "lightBorder",
          p: [0],
          ":hover": {
            background:"transparent",
            "svg *": {
              stroke: "primary",
            },
          },
          "svg *": {
            stroke: "lightBorder",
          },
        }}
      >
        <TrashIcon />
      </Button>
    </Box>
  );
};

export default RemoveFromCart;
