import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Text } from "theme-ui";
import CartContext from "../hooks/cartContext";
import { useClSdk } from "../hooks/useClSdk";

const AddToCart = ({ sku, quantity }) => {
  console.log(sku);
  const [order, setOrder] = useState();
  const { cart, setCart } = useContext(CartContext);
  const cl = useClSdk();

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

  const createLineItem = async () => {
    const attributes = {
      quantity: quantity,
      order: cl.orders.relationship(cart.id),
      item: cl.skus.relationship(sku.id),
      _update_quantity: true,
    };

    const lineItem = await cl.line_items
      .create(attributes)
      .catch((error) => console.log(error.errors));
    if (lineItem) {
      getOrder(cart.id);
    }
  };

  useEffect(() => {
    if (order) {
      console.log(order);
      setCart(order);
    }
  }, [order]);

  const addToCart = () => {
    createLineItem();
  };

  function isAvailable() {
    return sku && sku.stock_items[0] && sku.stock_items[0].quantity > 0 ? true : false;
  }

  return (
    <Box>
      <Button
        disabled={!isAvailable()}
        onClick={() => addToCart()}
        sx={{ opacity: isAvailable() ? 1 : 0.5 }}
      >
        {isAvailable() ? (
          <Text>Aggiungi al carrello</Text>
        ) : (
          <Text>Non disponibile</Text>
        )}
      </Button>
    </Box>
  );
};

export default AddToCart;
