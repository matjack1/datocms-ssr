import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Text } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import getOrder from "../hooks/getOrder";
import CartContext from "../hooks/cartContext";
import { FiTrash2 } from "react-icons/fi";
import { getColor } from "@theme-ui/color";
import theme from "../gatsby-plugin-theme-ui";


const RemoveFromCart = ({ sku }) => {
  const lightBorder = getColor(theme, "dark");
  const primary = getColor(theme, "primary");
  const { cart, setCart } = useContext(CartContext);
  const cl = useClSdk();

  const deleteLineItem = async () => {
    const lineItem = await cl.line_items
      .delete(sku.id)
      .catch((error) => console.log(error.errors));

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
          backgroundColor:"transparent",
          color:"lightBorder",
          p:[0],
          "&:hover":{
            backgroundColor:"transparent",
            color:"primary"
          }
        }}
        >
        <FiTrash2 size={24} />
      </Button>
    </Box>
  );
};

export default RemoveFromCart;
