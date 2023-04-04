import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Text, Flex } from "theme-ui";
import CartContext from "../hooks/cartContext";
import { useClSdk } from "../hooks/useClSdk";
import { navigate } from "gatsby";
import { toast } from "react-toastify";
import BouncingDotsLoader from "../components/bouncingDotsLoader";
import ProductThumb from "../components/productThumb";
import { getCartPath } from "../utils/path";
import { InboundLink } from "./link";
import CheckedIcon from "../assets/img/icons/flag.inline.svg";
import ClosedCirle from "../assets/img/icons/closed-circle.inline.svg";
import ErrorIcon from "../assets/img/icons/closed-circle.inline.svg";

const AddToCart = ({ sku, quantity }) => {
  const [order, setOrder] = useState();
  const { cart, setCart } = useContext(CartContext);
  const [addingToCart, setAddingToCart] = useState(false);
  const [errorAddToCart, setErrorAddToCart] = useState(null);
  const [lineItem, setLineItem] = useState(null);
  const cl = useClSdk();

  const getOrder = async (id) => {
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
    } else
      toast.error("Qualcosa è andato storto", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
  };

  const createLineItem = async () => {
    
    const attributes = {
      quantity: quantity,
      order: cl.orders.relationship(cart.id),
      item: cl.skus.relationship(sku.id),
      image_url: sku.images && sku.images.length > 0 ? sku.images[0].url : "",
      _update_quantity: true,
      _external_price: true,
    };

    

    const handleError = (e) => {
      console.log("error", e);
      if (e.errors[0].code === "INVALID_TOKEN") {
        navigate("/login");
      }
    };

    const lineItem = await cl.line_items.create(attributes).catch(handleError);

    if (lineItem) {
      setLineItem(lineItem);
      getOrder(cart.id);
    } else {
      setAddingToCart(true);
      setTimeout(() => {
        setAddingToCart(false);
        toast(<ToastThumb status="error" item={lineItem} />, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }, 2000);
    }
  };

  useEffect(() => {
    if (order && lineItem) {
      toast(<ToastThumb status="success" item={lineItem} />, {
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
    setErrorAddToCart(null);
    createLineItem();
  };

  function isAvailable() {
    return sku && sku.stock_items[0] && sku.stock_items[0].quantity > 0
      ? true
      : false;
  }

  return (
    <>
      <Box sx={{ width: "100%", height: "100%" }}>
        <Button
          disabled={!isAvailable() || addingToCart}
          onClick={() => addToCart()}
          sx={{
            minWidth: "200px",
            opacity: isAvailable() ? 1 : 0.7,
            width: "100%",
            height: "100%",
            textAlign: "center",
            maxHeight: "60px",
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
                <BouncingDotsLoader />
              )}
            </Box>
          )}
        </Button>
      </Box>
    </>
  );
};

const ToastThumb = ({ status, label, item }) => {
  return status === "success" ? (
    <Box>
      <Flex
        sx={{
          pb: [4],
          svg: { width: "15px", height: "auto" },
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <CheckedIcon />
        <Text sx={{ color: "dark", ml: [1], fontWeight: "600" }}>
          Aggiunto al carrello
        </Text>
      </Flex>
      <ProductThumb sku={item} horizontal={true} small={true} />
      <Box sx={{ pt: [4] }}>
        <InboundLink
          sx={{ fontSize: [1, 1], textDecoration: "underline", color: "dark" }}
          to={getCartPath()}
        >
          visualizza il carrello
        </InboundLink>
      </Box>
    </Box>
  ) : (
    status === "error" && (
      <Flex
        sx={{
          svg: { width: "15px", height: "auto" },
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <ClosedCirle />
        <Text sx={{ color: "primary", ml: [1], fontWeight: "400" }}>
          Non è stato possibile aggiungere l'articolo al carrello
        </Text>
      </Flex>
    )
  );
};

export default AddToCart;
