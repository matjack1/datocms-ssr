import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text, Flex, Heading } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";
import { GatsbyImage } from "gatsby-plugin-image";
import RemoveFromCart from "../components/removeFromCart";
import LineItemQuantity from "../components/lineItemQuantity";
import getSkuData from "../hooks/getSkuData";

const CartProduct = memo(
  ({ sku, handleSkuLoaded, horizontal = true, updateQuantity }) => {
    const [clSkuDetails, setClSkuDetails] = useState(null);
    const [datoSkusData, setDatoSkusData] = useState();
    const cl = useClSdk();

    useEffect(() => {
      const handleLoadSkusDatoData = async () => {
        const skuCode = sku.code ? sku.code : sku.sku_code;
        const datoSkusData = await getSkuData(skuCode);
        console.log("{...sku,...datoSkusData}", { ...sku, ...datoSkusData });
        setClSkuDetails({ ...datoSkusData, ...sku });
      };

      if (!clSkuDetails) handleLoadSkusDatoData();
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
                  <RemoveFromCart sku={sku} />
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
                {console.log("CARTPRODUCT",clSkuDetails)}
                <Text
                  sx={{
                    fontWeight: "600",
                    fontSize: ["18px"],
                  }}
                >
                  {clSkuDetails &&
                    clSkuDetails.formatted_unit_amount}
                </Text>
              </Box>
              <Box>
                <LineItemQuantity
                  lineItem={sku}
                  quantity={sku.quantity}
                  updateQuantity={updateQuantity}
                />
              </Box>
            </Flex>
          </Grid>
        )}
      </Box>
    );
  }
);

export default CartProduct;
