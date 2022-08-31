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
  Grid,
  Image
} from "theme-ui";
import CustomerTokenContext from "../../../../hooks/customerTokenContext";
import Nav from "../../../nav";
import { navigate } from "gatsby";
import { useParams } from "@reach/router";
import { useClSdk } from "../../../../hooks/useClSdk";
import SkuQuantity from "../../../skuQuantity";
import { buildClient } from "@datocms/cma-client-browser";
import CartContext from "../../../../hooks/cartContext";
import AddToCart from "../../../addToCart";
import CustomBreadcrumbs from "../../../customBreadcrumbs";
import { getProductPath } from "../../../../utils/path";
import { InboundLink } from "../../../link";
import { GatsbyImage } from "gatsby-plugin-image";
import PlaceholderImage from "../../../../assets/img/placeholder-image.png";

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

  useEffect(() => {
    if (currentOrder) {
      setCart(currentOrder);
    }
  }, [currentOrder]);

  useEffect(() => {
    if (cart && currentOrder && success) {
      navigate("/cart");
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
      <Box>
        <Container>
          <CustomBreadcrumbs
            data={{
              pages: [
                {
                  slug: "/",
                  title: "Home",
                },
                {
                  slug: "/account/orders",
                  title: "Ordini",
                },
                {
                  slug: "/account/orders/" + orderId,
                  title: `Ordine #${orderId}`,
                },
              ],
              current: {
                title: "Ordina di nuovo",
              },
            }}
          />
          <Box sx={{ pb: [8] }}>
            <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
              Ordina di nuovo
            </Heading>
          </Box>
          {skusData && skusData.length > 0 ? (
            <Grid columns={[".7fr .3fr"]} gap={[12]}>
              <Box>
                <Box>
                  <Box>
                    <Grid sx={{ gridTemplateRows: "auto" }} gap={[8]}>
                      {skusData.map((sku) => (
                        <Box>
                          <SkuComponent
                            handleUpdateQuantity={(e) =>
                              updateQuantity(e, sku.code)
                            }
                            clSkuDetails={sku}
                            horizontal={true}
                          />
                        </Box>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Box>
              <Box />
            </Grid>
          ) : (
            <Box>La lista dei preferiti è vuota</Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

const SkuComponent = ({
  clSkuDetails,
  handleUpdateQuantity,
  horizontal = false,
}) => {
  console.log("sku", clSkuDetails);
  const [currentQuantity, setCurrentQuantity] = useState(clSkuDetails.quantity);

  const updateQuantity = (quantity) => {
    handleUpdateQuantity(quantity);
    setCurrentQuantity(quantity);
  };

  function isAvailable() {
    return clSkuDetails &&
      clSkuDetails.stock_items[0] &&
      clSkuDetails.stock_items[0].quantity > 0
      ? true
      : false;
  }

  return (
    <Box>
      {clSkuDetails && (
        <Grid
          sx={{
            gridTemplateRows: !horizontal && "1fr auto",
            gridTemplateColumns: horizontal && ["168px 1fr"],
          }}
          gap={[horizontal ? 11 : 3]}
        >
          <Flex sx={{ justifyItems: "baseline", width: "100%" }}>
            <Box
              sx={{
                border: "1px solid",
                height: "168px",
                borderColor: "dark",
                width: "100%",
              }}
            >
              {clSkuDetails.images && clSkuDetails.images.length > 0 ? (
                <GatsbyImage
                  image={clSkuDetails.images[0].gatsbyImageData}
                  alt={clSkuDetails.images[0].gatsbyImageData}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    img: {
                      height: "100%",
                      objectFit: "contain",
                    },
                    backgroundColor: "light",
                  }}
                >
                  <Image src={PlaceholderImage} />
                </Box>
              )}
            </Box>
          </Flex>
          <Flex
            sx={{
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Flex
              sx={{
                pb: [horizontal ? 5 : 3],
                justifyContent: "space-between",
              }}
            >
              <Box>
                <InboundLink
                  to={getProductPath(clSkuDetails)}
                  sx={{
                    textDecoration: "none",
                    color: "dark",
                  }}
                >
                  <Heading
                    as={horizontal ? "h3" : "h2"}
                    variant="h2"
                    sx={{
                      color: "dark",
                      fontWeight: "400",
                      my: [0],
                      fontSize: horizontal ? [7, 7] : [4, 4],
                    }}
                  >
                    {clSkuDetails.name}
                  </Heading>
                </InboundLink>
              </Box>
            </Flex>
            <Box sx={{ pb: [6] }}>
              {clSkuDetails.code ? clSkuDetails.code : clSkuDetails.sku_code}
            </Box>
            <Box
              as="table"
              sx={{
                tr: {
                  p: [0],
                  "td:first-child": {
                    textAlign: "left",
                    verticalAlign: "middle",
                    color: "lightBorder",
                  },
                  td: {
                    fontSize: [2],
                    fontWeight: "400",
                    pb: [3],
                  },
                },
              }}
            >
              {clSkuDetails.size && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>Dimensione</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{clSkuDetails.size}</Box>
                  </Box>
                </Box>
              )}

              {clSkuDetails.glove_type && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>Tipo di guanto</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{clSkuDetails.glove_type}</Box>
                  </Box>
                </Box>
              )}

              {clSkuDetails.packaging && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>Imballaggio</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{clSkuDetails.packaging}</Box>
                  </Box>
                </Box>
              )}

              {clSkuDetails.ecolabel && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>Etichetta ecologica</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{clSkuDetails.ecolabel}</Box>
                  </Box>
                </Box>
              )}

              {clSkuDetails.biodegradable && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>Biodegradabile</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{clSkuDetails.biodegradable}</Box>
                  </Box>
                </Box>
              )}

              {clSkuDetails.sanitizer && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>Sanificatore</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{clSkuDetails.sanitizer}</Box>
                  </Box>
                </Box>
              )}

              {clSkuDetails.haccp && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>HACCP</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{clSkuDetails.haccp}</Box>
                  </Box>
                </Box>
              )}

              {clSkuDetails.detergent_type && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>Tipo di detergente</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{clSkuDetails.detergent_type}</Box>
                  </Box>
                </Box>
              )}

              {clSkuDetails.detergent_usage && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>Uso del detergente</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{clSkuDetails.detergent_usage}</Box>
                  </Box>
                </Box>
              )}
            </Box>
            <Box sx={{ pb: [6] }}>
              <Text
                sx={{
                  fontWeight: "600",
                  fontSize: [6],
                }}
              >
                {clSkuDetails && clSkuDetails.formatted_unit_amount
                  ? clSkuDetails.formatted_unit_amount
                  : clSkuDetails.prices && !clSkuDetails.formatted_unit_amount
                  ? clSkuDetails.prices.discountedPrice
                    ? "€" +
                      clSkuDetails.prices.discountedPrice.toLocaleString(
                        "it-IT",
                        { minimumFractionDigits: 2 }
                      )
                    : "€" +
                      clSkuDetails.prices.price.toLocaleString("it-IT", {
                        minimumFractionDigits: 2,
                      })
                  : "Caricamento del prezzo"}
              </Text>
            </Box>
            <Flex sx={{ pb: [9] }}>
              <SkuQuantity
                sku={clSkuDetails}
                quantity={currentQuantity}
                updateQuantity={updateQuantity}
                showMinMult={false}
              />
              <Box
                sx={{
                  button: {
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    fontSize: [3],
                    fontWeight: "600",
                    borderRadius: "unset",
                    p: [0],
                    px: [2],
                    ml: [2],
                  },
                }}
              >
                <AddToCart sku={clSkuDetails} quantity={currentQuantity} />
              </Box>
            </Flex>
          </Flex>
        </Grid>
      )}
    </Box>
  );
};

export default CustomerOrderReturn;
