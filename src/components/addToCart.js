import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Text, Flex } from "theme-ui";
import CartContext from "../hooks/cartContext";
import { useClSdk } from "../hooks/useClSdk";
import { navigate } from "gatsby";
import { BsBag } from "react-icons/bs";

const AddToCart = ({ sku, quantity }) => {
  const [order, setOrder] = useState();
  const { cart, setCart } = useContext(CartContext);
  const cl = useClSdk();

  const getOrder = async (id) => {
    console.log("getOrder");
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    const order = await cl.orders
      .retrieve(id, { include: ["line_items"], filters: { status: "draft" } })
      .catch(handleError);

    if (order) {
      console.log(order.line_items);
      setOrder(order);
    }
  };

  const createLineItem = async () => {
    const attributes = {
      quantity: quantity,
      order: cl.orders.relationship(cart.id),
      item: cl.skus.relationship(sku.id),
      _update_quantity: true,
      // _external_price: true,
    };

    const lineItem = await cl.line_items
      .create(attributes)
      .catch((error) => console.log(error.errors));

    console.log("lineItem", lineItem, quantity);
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
    return sku && sku.stock_items[0] && sku.stock_items[0].quantity > 0
      ? true
      : false;
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Button
        disabled={!isAvailable()}
        onClick={() => addToCart()}
        sx={{
          opacity: isAvailable() ? 1 : 0.5,
          width: "100%",
          height: "100%",
          textAlign: "center",
          fontSize: [3],
          fontWeight: "600",
          borderRadius: "unset",
          p: [3],
        }}
      >
        {isAvailable() ? (
          <Flex sx={{width:"100%", justifyContent:"center", alignItems:"center"}}>
            <Box>
              <BsBag />
            </Box>
            <Box sx={{ml:[4]}}>
              <Text>Aggiungi al carrello</Text>
            </Box>
          </Flex>
        ) : (
          <Text>Non disponibile</Text>
        )}
      </Button>
    </Box>
  );
};

export default AddToCart;
