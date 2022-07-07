import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Text } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import getOrder from "../hooks/getOrder";
import CartContext from "../hooks/cartContext";

const RemoveFromCart = ({ sku }) => {
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
      <Button onClick={() => removeFromCart()}>
        <Text>Rimuovi</Text>
      </Button>
    </Box>
  );
};

export default RemoveFromCart;
