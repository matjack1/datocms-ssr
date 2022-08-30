import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Text, Flex } from "theme-ui";
import CartContext from "../hooks/cartContext";
import { useClSdk } from "../hooks/useClSdk";
import { navigate } from "gatsby";
import { BsBag } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";

const AddToCart = ({ sku, quantity }) => {
  const [order, setOrder] = useState();
  const { cart, setCart } = useContext(CartContext);
  const [addingToCart, setAddingToCart] = useState(false);
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
      setAddingToCart(false);
      setOrder(order);
    }
  };

  const createLineItem = async () => {
    const attributes = {
      quantity: quantity,
      order: cl.orders.relationship(cart.id),
      item: cl.skus.relationship(sku.id),
      _update_quantity: true,
      _external_price: true,
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
      toast.success("Prodotto aggiunto al carrello", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      setCart(order);
    }
  }, [order]);

  const addToCart = () => {
    setAddingToCart(true);
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
        disabled={!isAvailable() || addingToCart}
        onClick={() => addToCart()}
        sx={{
          opacity: isAvailable() && !addingToCart ? 1 : 0.5,
          width: "100%",
          height: "100%",
          textAlign: "center",
          fontSize: [3],
          fontWeight: "600",
          borderRadius: "unset",
          p: [3],
        }}
      >
        {isAvailable() && !addingToCart ? (
          <Flex
            sx={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box>
              <Text>Aggiungi al carrello</Text>
            </Box>
          </Flex>
        ) : (
          <Box>
            {!isAvailable() && !addingToCart ? (
              <Text>Non disponibile</Text>
            ) : (
              <Text>Aggiungendo al carrello</Text>
            )}
          </Box>
        )}
      </Button>
    </Box>
  );
};

export default AddToCart;
