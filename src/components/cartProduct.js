import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text, Flex, Heading, Image } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";
import { GatsbyImage } from "gatsby-plugin-image";
import RemoveFromCart from "../components/removeFromCart";
import LineItemQuantity from "../components/lineItemQuantity";
import getSkuData from "../hooks/getSkuData";
import PlaceholderImage from "../assets/img/placeholder-image.png";
import ThumbPrice from "../components/thumbPrice";
import ThumbProductDetails from "../components/thumbProductDetails";

const CartProduct = memo(({ sku, handleSkuLoaded, updateQuantity }) => {
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
        <>
          <Grid
            sx={{
              gridTemplateColumns: ["83px 1fr", "83px 1fr", "168px 1fr"],
            }}
            gap={[3, 10]}
          >
            <Flex sx={{ justifyItems: "baseline", width: "100%" }}>
              <Box
                sx={{
                  border: "1px solid",
                  height: ["81px", "81px", "168px"],
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
                  pb: [2],
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
                      as={"h3"}
                      variant="h2"
                      sx={{
                        color: "dark",
                        fontWeight: "400",
                        my: [0],
                        fontSize: [1, 5, 5],
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
              <Box sx={{ pb: [2], color: "lightBorder", fontSize:[1,2] }}>
                {clSkuDetails.code ? clSkuDetails.code : clSkuDetails.sku_code}
              </Box>
              <ThumbProductDetails item={clSkuDetails} />
              <ThumbPrice item={clSkuDetails} />
              <Box sx={{ display: ["none", "block", "block"] }}>
                <LineItemQuantity
                  lineItem={sku}
                  quantity={sku.quantity}
                  updateQuantity={updateQuantity}
                />
              </Box>
            </Flex>
          </Grid>

          <Box sx={{ display: ["block", "none"] }}>
            <LineItemQuantity
              lineItem={sku}
              quantity={sku.quantity}
              updateQuantity={updateQuantity}
            />
          </Box>
        </>
      )}
    </Box>
  );
});

export default CartProduct;
