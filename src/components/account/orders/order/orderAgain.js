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
  Image,
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
import ThumbPrice from "../../../thumbPrice";
import ThumbProductDetails from "../../../thumbProductDetails";
import FavouritesSkeleton from "../../../skeleton/favourites";
import { useResponsiveValue, useBreakpointIndex } from "@theme-ui/match-media";
import { Helmet } from "react-helmet"

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
  const [showSkeleton, setShowSkeleton] = useState();

  const [skusData, setSkusData] = useState(null);

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
          obj.images = []
          return {
            ...records[index],
            ...obj,
            ...line_items[index],
          };
        })
      );

      console.log("mergedSku",mergedSku)
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
    console.log("order",order)

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
      <Helmet>
        <title>Ordina di nuovo | Socaf</title>
      </Helmet>
      <Box>
        <Container>
          {!showSkeleton && skusData && skusData.length > 0 ? (
            <>
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
              <Grid columns={["1fr","1fr", ".7fr .3fr"]} gap={[0,0, 12]}>
                <Box>
                  <Box>
                    <Box>
                      <Grid sx={{ gridTemplateRows: "auto" }} gap={[6,8]}>
                        {console.log(skusData)}
                        {skusData.map((sku) => (
                          <Box key={sku.code}>
                            <SkuComponent
                              handleUpdateQuantity={(e) =>
                                updateQuantity(e, sku.code)
                              }
                              clSkuDetails={sku}
                            />
                          </Box>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                </Box>
                <Box />
              </Grid>
            </>
          ) : (
            <FavouritesSkeleton />
          )}
        </Container>
      </Box>
    </Box>
  );
};

const SkuComponent = ({ clSkuDetails, handleUpdateQuantity }) => {
  const [currentQuantity, setCurrentQuantity] = useState(clSkuDetails.quantity);
  const mediaIndex = useBreakpointIndex();

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
        <>
          <Grid
            sx={{
              gridTemplateColumns: ["83px 1fr","83px 1fr","168px 1fr"],
            }}
            gap={[3, 10]}
          >
            <Flex sx={{ justifyItems: "baseline", width: "100%" }}>
              <Box
                sx={{
                  border: "1px solid",
                  height: ["81px","81px","168px"],
                  borderColor: "dark",
                  width: "100%",
                }}
              >
                {console.log("clSkuDetails",clSkuDetails)}
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
                        width: "100%",
                        objectFit: "cover",
                      },
                      backgroundColor: "light",
                    }}
                  >
                    <Image
                      src={clSkuDetails.image_url ? clSkuDetails.image_url : PlaceholderImage}
                    />
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
                  pb: [4],
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
                      as={"he"}
                      variant="h2"
                      sx={{
                        color: "dark",
                        fontWeight: "400",
                        my: [0],
                        fontSize: [1,5, 5],
                      }}
                    >
                      {clSkuDetails.name}
                    </Heading>
                  </InboundLink>
                </Box>
              </Flex>
              <Box sx={{ pb: [2], color: "lightBorder" }}>
                {clSkuDetails.code ? clSkuDetails.code : clSkuDetails.sku_code}
              </Box>
              <ThumbProductDetails item={clSkuDetails} />
              <ThumbPrice item={clSkuDetails} />
              <Flex sx={{ pb: [9], display:["none","none","flex"] }}>
                <SkuQuantity
                  sku={clSkuDetails}
                  quantity={currentQuantity}
                  updateQuantity={updateQuantity}
                  showMinMult={false}
                />
                <Box
                  sx={{
                    button: {
                      minHeight: "37px",
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                      fontSize: [1,3],
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

          {mediaIndex < 2 && (
            <Flex sx={{ pb: [9], flexDirection:"column" }}>
              <SkuQuantity
                sku={clSkuDetails}
                quantity={currentQuantity}
                updateQuantity={updateQuantity}
                showMinMult={false}
              />
              <Box
                sx={{
                  button: {
                    mt:[3,3],
                    minHeight: "37px",
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    fontSize: [1,3],
                    fontWeight: "600",
                    borderRadius: "unset",
                    p: [0],
                    px: [2],
                    ml: [0,0],
                  },
                }}
              >
                <AddToCart sku={clSkuDetails} quantity={currentQuantity} />
              </Box>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

export default CustomerOrderReturn;
