import React, { useContext, useState, useEffect } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Label,
  Input,
  Text,
  Checkbox,
  Textarea,
  Button,
  Flex,
} from "theme-ui";
import CustomerTokenContext from "../../../../hooks/customerTokenContext";
import Nav from "../../../nav";
import { navigate } from "gatsby";
import { useParams } from "@reach/router";
import { useClSdk } from "../../../../hooks/useClSdk";
import SkuQuantity from "../../../skuQuantity";
import { buildClient } from "@datocms/cma-client-browser";
import CartContext from "../../../../hooks/cartContext";

const CustomerOrderReturn = () => {
  const client = buildClient({ apiToken: "7f672cb51a4f9c2dce0c59b466b8c6" });
  const { cart, setCart } = useContext(CartContext);
  const [order, setOrder] = useState();
  const [orderId, setOrderId] = useState(useParams().orderId);
  const [lineItems, setLineItems] = useState();
  const [cartList, setCartList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const [recordCount, setRecordCount] = useState();
  const [currentOrder, setCurrentOrder] = useState();
  const [success, setSuccess] = useState(null);

  const [skusData, setSkusData] = useState();

  const cl = useClSdk();

  const getClSku = async () => {
    const handleError = (e) => {
      console.log(e);
    };

    let skus_codes = [];

    order.line_items.map(
      (sku) => sku.sku_code && skus_codes.push(sku.sku_code)
    );

    const clSku = await cl.skus
      .list({
        filters: { code_in: skus_codes },
        include: ["prices", "stock_items"],
        pageSize: 20,
        pageNumber: currentPage,
      })
      .catch(handleError);

    const records = await client.items.list({
      filter: {
        type: "313716",
        fields: {
          code: {
            in: skus_codes,
          },
        },
      },
    });

    if (clSku && records) {
      if (currentPage < clSku.meta.pageCount)
        setCurrentPage(clSku.meta.currentPage + 1);

      setPageCount(clSku.meta.pageCount);
      setRecordCount(clSku.meta.recordCount);

      var tmpclSku = [...clSku];
      if (skusData) tmpclSku = [...clSku, ...skusData];

      const line_items = await Promise.all(
        order.line_items
          .map((item) => {
            return { ...item, code: item.sku_code };
          })
          .filter((e) => e.sku_code != null)
      );

      let mergedSku = await Promise.all(
        tmpclSku.map((obj) => {
          const index = line_items.findIndex((el) => el["code"] == obj["code"]);
          console.log("...obj", obj.id);
          console.log("...line_items[index].id", line_items[index].id);
          console.log("...records[index]", records[index].id);
          return {
            ...records[index],
            ...line_items[index],
            ...obj,
          };
        })
      );

      setSkusData(mergedSku);
    }
  };

  const getOrder = async (id) => {
    const handleError = (e) => {
      console.log("invalid token", e);
    };

    const order = await cl.orders
      .retrieve(id, { include: ["line_items"] })
      .catch(handleError);

    if (order) {
      setLineItems(order.line_items);
      setOrder(order);
    }
  };

  const handleSetCurrentOrder = async (id) => {
    const handleError = (e) => {
      console.log("invalid token", e);
    };

    const order = await cl.orders
      .retrieve(id, { include: ["line_items"], filters: { status: "draft" } })
      .catch(handleError);

    if (order) {
      setCurrentOrder(order);
    }
  };

  useEffect(() => {
    if (currentPage != 1 && currentPage <= pageCount && cl && order) getClSku();
    console.log(22);
  }, [currentPage]);

  useEffect(() => {
    if (lineItems && lineItems.length > 0 && cl) {
      getClSku();
    }
    console.log(11);
  }, [lineItems]);

  useEffect(() => {
    console.log("useParams()", orderId);
    getOrder(orderId);
  }, [orderId]);

  const handleOrderAgain = async (e) => {
    e.preventDefault();

    console.log("handleOrderAgain");
    let errors = [];

    await Promise.all(
      skusData.map(async (sku) => {
        console.log(
          cl.skus.relationship(sku.id),
          sku.id,
          cl.orders.relationship(cart.id)
        );

        const attributes = {
          quantity: sku.quantity,
          order: cl.orders.relationship(cart.id),
          item: cl.skus.relationship(sku.id),
          _update_quantity: true,
        };

        const lineItem = await cl.line_items
          .create(attributes)
          .catch((error) => errors.push(error.errors));
        if (lineItem) {
          handleSetCurrentOrder(cart.id);
        }
      })
    );

    if (errors.length === 0) setSuccess(true);
    else setSuccess(false);
  };

  useEffect(() => {
    if (currentOrder) {
      setCart(currentOrder);
    }
  }, [currentOrder]);

  useEffect(() => {
    if (cart && currentOrder && success) {
      navigate("/cart")
    }
  }, [cart, currentOrder, success]);

  const removeItem = (code) => {
    setSkusData(skusData.filter((o, i) => code !== o.code));
  };

  const updateQuantity = (e, code) => {
    setSkusData(
      skusData.map((item) => {
        if (item.code === code) {
          return {
            ...item,
            quantity: e,
          };
        } else return item;
      })
    );
  };

  return (
    <Box>
      {order && (
        <>
          <Heading as="h1">Ordina di nuovo</Heading>
          <Box>
            <Box>Seleziona prodotti</Box>
            {skusData &&
              skusData.map(
                (item, index) =>
                  item.code && (
                    <SkuComponent
                      removeSku={() => removeItem(item.code)}
                      handleUpdateQuantity={(e) => updateQuantity(e, item.code)}
                      sku={item}
                    />
                  )
              )}
            {success === false && (
              <Flex sx={{ maxWidth: "600px" }}>
                <Heading sx={{ my: [4], color: "secondary" }} as="h4">
                  Qualcosa è andato storto
                </Heading>
              </Flex>
            )}
            <Box>
              <Button onClick={handleOrderAgain}>Ordina di nuovo</Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

const SkuComponent = ({ sku, removeSku, handleUpdateQuantity }) => {
  console.log("sku", sku);
  const [currentQuantity, setCurrentQuantity] = useState(sku.quantity);

  const updateQuantity = (quantity) => {
    handleUpdateQuantity(quantity);
    setCurrentQuantity(quantity);
  };

  function isAvailable() {
    return sku && sku.stock_items[0] && sku.stock_items[0].quantity > 0
      ? true
      : false;
  }

  return (
    <Box>
      <Heading as="h1">{sku.name}</Heading>
      <Text as="p">{sku.sku_code}</Text>
      {isAvailable() ? (
        <SkuQuantity
          sku={sku}
          quantity={currentQuantity}
          updateQuantity={updateQuantity}
        />
      ) : (
        <Box>Non disponibile</Box>
      )}
      <Button onClick={() => removeSku()}>
        <Text>Rimuovi</Text>
      </Button>
      {sku && (
        <Box>
          <Text as="p">
            {console.log(sku)}
            {sku && sku.formatted_amount}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default CustomerOrderReturn;
