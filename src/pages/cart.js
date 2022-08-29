import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Grid, Heading, Link, Text } from "theme-ui";
import Nav from "../components/nav";
import RemoveFromCart from "../components/removeFromCart";
import LineItemQuantity from "../components/lineItemQuantity";
import CartContext from "../hooks/cartContext";
import CustomerContext from "../hooks/customerContext";
import CustomerTokenContext from "../hooks/customerTokenContext";
import getOrder from "../hooks/getOrder";
import { useClSdk } from "../hooks/useClSdk";
import Layout from "../components/layout";
import CartProduct from "../components/cartProduct";

const CartPage = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken } = useContext(CustomerTokenContext);
  const { cart, setCart } = useContext(CartContext);
  const cl = useClSdk();

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
        console.log(value);
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

  const updateQuantity = (quantity, id) => {
    updateLineItem(quantity, id);
  };

  return (
    <Layout>
      <Container>
        <Grid columns={[".7fr .3fr"]} gap={[12]}>
          <Box>
            <Box>
              <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
                Carrello
              </Heading>
            </Box>
            <Box>
              {cart && cart.line_items.length > 0 ? (
                <Box>
                  <Box>
                    {cart.line_items.map((lineItem) => (
                      <Box>
                        <CartProduct sku={lineItem} />
                        <Box>{lineItem.name}</Box>
                        <Box>{lineItem.formatted_total_amount}</Box>
                        <Box>{lineItem.sku_code}</Box>
                        <LineItemQuantity
                          lineItem={lineItem}
                          quantity={lineItem.quantity}
                          updateQuantity={updateQuantity}
                        />
                        <RemoveFromCart sku={lineItem} />
                      </Box>
                    ))}
                  </Box>
                  <Box>
                    <Box>Totale parziale: {cart.formatted_subtotal_amount}</Box>
                    <Box>Spedizione: {cart.formatted_shipping_amount}</Box>
                    <Box>Tasse: {cart.formatted_total_tax_amount}</Box>
                    <Box>Totale: {cart.formatted_total_amount_with_taxes}</Box>
                    <Link
                      href={`https://socaf-s-p-a.checkout.commercelayer.app/${cart.id}?accessToken=${customerToken.access_token}`}
                      target="_blank"
                    >
                      Checkout
                    </Link>
                  </Box>
                </Box>
              ) : (
                <Box>Il tuo carrello è attualmente vuoto!</Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Container>
    </Layout>
  );
};

export default CartPage;
