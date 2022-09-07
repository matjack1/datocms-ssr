import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Grid, Heading, Text, Flex } from "theme-ui";
import Nav from "../components/nav";
import CartContext from "../hooks/cartContext";
import CustomerContext from "../hooks/customerContext";
import CustomerTokenContext from "../hooks/customerTokenContext";
import getOrder from "../hooks/getOrder";
import { useClSdk } from "../hooks/useClSdk";
import Layout from "../components/layout";
import CartProduct from "../components/cartProduct";
import { InboundLink, OutboundLink } from "../components/link";
import getPrices from "../hooks/getPrices";
import { getColor } from "@theme-ui/color";
import theme from "../gatsby-plugin-theme-ui";
import BagIcon from "../assets/img/icons/carrello.inline.svg";

const CartPage = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken } = useContext(CustomerTokenContext);
  const { cart, setCart } = useContext(CartContext);
  const [itemQuantity, setItemQuantity] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const cl = useClSdk();

  const lightBorder = getColor(theme, "lightBorder");

  const updateLineItem = async (quantity, id) => {
    const line_item = {
      id: id,
      quantity: quantity,
    };

    const lineItem = await cl.line_items
      .update(line_item)
      .catch((e) => console.log(e));

    getOrder(cl, cart.id)
      .then((value) => {
        setCart(value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (customer && cart) {
      getOrder(cl, cart.id)
        .then((value) => {
          setCart(value);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [customer]);

  useEffect(() => {
    if (cart && cart.line_items.length > 0) {
      let tmp = 0;
      cart.line_items.map((item, a) => (tmp += item.quantity), 0);
      setItemQuantity(tmp);
    }
    setCartItems([]);
    setCartItems(cart && cart.line_items.length > 0 ? cart.line_items : []);
  }, [cart]);

  const updateQuantity = (quantity, id) => {
    updateLineItem(quantity, id);
  };

  return (
    <Layout>
      <Container>
        {cart && cartItems.length > 0 ? (
          <>
            <Grid columns={[".7fr .3fr"]} gap={[12]}>
              {console.log("cart", cart)}
              <Box>
                <Box>
                  <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
                    Carrello
                  </Heading>

                  {itemQuantity && (
                    <Box
                      sx={{
                        fontSize: [2],
                        fontWeight: "400",
                        pb: [8],
                      }}
                    >
                      <Text color="lightBorder">
                        {`${itemQuantity} articol${
                          itemQuantity > 0 ? "i" : "o"
                        } |`}
                      </Text>
                      <Text>{` ${cart.formatted_subtotal_amount}`}</Text>
                    </Box>
                  )}
                </Box>
                <Grid sx={{ gridTemplateRows: "auto" }} gap={[8]}>
                  {console.log("cart.line_items", cartItems)}
                  {cartItems.map((lineItem,index) => (
                    <Box key={lineItem.id}>
                      <CartProduct
                        sku={lineItem}
                        updateQuantity={updateQuantity}
                      />
                    </Box>
                  ))}
                </Grid>
              </Box>

              <Box>
                <Box>
                  <Heading
                    as="h2"
                    variant="h5"
                    sx={{ color: "primary", mt: [5], pb: [6] }}
                  >
                    Riepilogo ordine
                  </Heading>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [6],
                    }}
                  >
                    <Box>
                      <Text sx={{ fontSize: [5], color: "lightBorder" }}>
                        Costi di spedizione
                      </Text>
                    </Box>
                    <Box
                      sx={{
                        fontSize: [5],
                        color: "lightBorder",
                        fontWeight: "600",
                      }}
                    >
                      da calcolare
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [6],
                    }}
                  >
                    <Text sx={{ fontSize: [5], color: "lightBorder" }}>
                      Tasse
                    </Text>
                    <Box
                      sx={{
                        fontSize: [5],
                        color: "lightBorder",
                        fontWeight: "600",
                      }}
                    >
                      da calcolare
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "start",
                      pb: [6],
                    }}
                  >
                    <Text sx={{ fontSize: [5] }}>Subtotale</Text>
                    <Box
                      sx={{
                        textAlign: "right",
                        fontSize: [5],
                        fontWeight: "600",
                      }}
                    >
                      {cart.formatted_subtotal_amount}
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      pb: [6],
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: [3],
                        color: "lightBorder",
                        fontWeight: "600",
                      }}
                    >
                      Prezzo tasse escluse, spese di spedizioni calcolate al
                      checkout
                    </Box>
                  </Flex>
                  {customerToken && customerToken.access_token && (
                    <Box>
                      <OutboundLink
                        href={`https://socaf-b2b-checkout.netlify.app/${cart.id}?accessToken=${customerToken.access_token}`}
                        target="_self"
                        variant="buttons.primary"
                        sx={{
                          display: "inline-block",
                          width: "100%",
                          height: "100%",
                          textAlign: "center",
                          fontSize: [3],
                          fontWeight: "600",
                          borderRadius: "unset",
                          p: [3],
                        }}
                      >
                        Vai al pagamento
                      </OutboundLink>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          </>
        ) : (
          <>
            <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
              Carrello
            </Heading>
            <Flex
              sx={{
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid",
                color: "lightBorder",
                svg: {
                  color: "lightBorder",
                },
                borderColor: "lightBorder",
                p: [14],
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  pb: [7],
                  svg: {
                    width: "92px",
                    height: "auto",
                    "*": {
                      stroke: "lightBorder",
                    },
                  },
                }}
              >
                <BagIcon />
              </Box>
              <Box>
                <Text sx={{ fontSize: [7] }}>
                  Il tuo carrello è attualmente vuoto!
                </Text>
              </Box>
            </Flex>
          </>
        )}
        <Box>
          <Heading as="h2" variant="h2" sx={{ my: [6], color: "primary" }}>
            Preferiti
          </Heading>
          <Box
            sx={{
              fontWeight: "400",
              fontSize: [5],
              a: {
                color: "dark",
                "&:hover": {
                  color: "primary",
                },
              },
            }}
          >
            <InboundLink to="/account/favourites">
              Vuoi visualizzare i preferiti?{" "}
            </InboundLink>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default CartPage;
