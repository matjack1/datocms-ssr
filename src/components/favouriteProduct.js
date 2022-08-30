import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text, Flex, Heading, Button } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";
import { GatsbyImage } from "gatsby-plugin-image";
import RemoveFromCart from "./removeFromCart";
import LineItemQuantity from "./lineItemQuantity";
import getSkuData from "../hooks/getSkuData";
import { FiTrash } from "react-icons/fi";
import SkuQuantity from "./skuQuantity";
import { FiTrash2 } from "react-icons/fi";
import AddToCart from "./addToCart";
import { BsBag } from "react-icons/bs";

const FavouriteProduct = memo(
  ({ sku, handleSkuLoaded, horizontal = true, handleDeleteFavourite }) => {
    const [currentQuantity, setCurrentQuantity] = useState(sku.minimum);
    const [clSkuDetails, setClSkuDetails] = useState(null);
    const [datoSkusData, setDatoSkusData] = useState();
    const cl = useClSdk();

    const updateQuantity = (quantity) => {
      console.log(quantity);
      setCurrentQuantity(quantity);
    };

    const handleLoadSkusDatoData = async () => {
      const skuCode = sku.code ? sku.code : sku.sku_code;
      const datoSkusData = await getSkuData(skuCode);

      return datoSkusData;
    };

    const getClSku = async () => {
      const handleError = (e) => {
        console.log(e);
      };
      const clSku = await cl.skus
        .list({
          filters: { code_eq: sku.code },
          include: ["stock_items"],
        })
        .catch(handleError);
      if (clSku && clSku[0]) {
        const datoSkusData = await handleLoadSkusDatoData();

        console.log("sku",{ ...sku })
        setClSkuDetails({ ...sku,...datoSkusData, ...clSku[0] });
      }
    };

    useEffect(() => {
      if (cl) {
        getClSku();
      }
    }, [sku]);

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
                {sku.images && sku.images.length > 0 ? (
                  <GatsbyImage
                    image={sku.images[0].gatsbyImageData}
                    alt={sku.images[0].gatsbyImageData}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "166px",
                      width: "100%",
                      backgroundColor: "light",
                    }}
                  />
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
                    to={getProductPath(sku)}
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
                <Box sx={{ width: "20%", textAlign: "right" }}>
                  <Box>
                    <Button
                      onClick={() => handleDeleteFavourite()}
                      sx={{
                        backgroundColor: "transparent",
                        color: "lightBorder",
                        p: [0],
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "primary",
                        },
                      }}
                    >
                      <FiTrash2 size={24} />
                    </Button>
                  </Box>
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
                  {clSkuDetails && clSkuDetails.prices
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
                      p:[0],
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
  }
);

export default FavouriteProduct;
