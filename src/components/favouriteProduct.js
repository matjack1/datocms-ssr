import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text, Flex, Heading, Button } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";
import { GatsbyImage } from "gatsby-plugin-image";
import RemoveFromCart from "./removeFromCart";
import LineItemQuantity from "./lineItemQuantity";
import getSkuData from "../hooks/getSkuData";
import SkuQuantity from "./skuQuantity";
import TrashIcon from "../assets/img/icons/cestino.inline.svg";
import AddToCart from "./addToCart";
import PlaceholderImage from "../assets/img/placeholder-image.png";
import { navigate } from "gatsby";
import ThumbPrice from "./thumbPrice";
import ThumbProductDetails from "./thumbProductDetails";
import { useBreakpointIndex } from "@theme-ui/match-media";
import { Image } from "react-datocms";

const FavouriteProduct = memo(
  ({ sku, handleSkuLoaded, handleDeleteFavourite }) => {
    const mediaIndex = useBreakpointIndex();
    const [currentQuantity, setCurrentQuantity] = useState(sku.minimum);
    const [clSkuDetails, setClSkuDetails] = useState(null);
    const [datoSkusData, setDatoSkusData] = useState();
    const cl = useClSdk();

    const updateQuantity = (quantity) => {
      
      setCurrentQuantity(quantity);
    };

    const handleLoadSkusDatoData = async () => {
      const skuCode = sku.code ? sku.code : sku.sku_code;
      const datoSkusData = await getSkuData(skuCode);

      return datoSkusData[0];
    };

    const getClSku = async () => {
      const handleError = (e) => {
        console.log("error", e);
        if (e.errors[0].code === "INVALID_TOKEN") {
          navigate("/login");
          // console.log("invalid token", e);
        }
      };

      const clSku = await cl.skus
        .list({
          filters: { code_eq: sku.code },
          include: ["stock_items"],
        })
        .catch(handleError);

      if (clSku && clSku[0]) {
        const datoSkusData = await handleLoadSkusDatoData();

        setClSkuDetails({ ...sku, ...datoSkusData, ...clSku[0] });
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
                    height: ["83px", "83px", "168px"],
                    borderColor: "dark",
                    width: "100%",
                  }}
                >
                  {clSkuDetails.images && clSkuDetails.images.length > 0 ? (
                    <>
                      <GatsbyImage
                        image={clSkuDetails.images[0].gatsbyImageData}
                        alt={clSkuDetails.images[0].gatsbyImageData}
                      />
                      {clSkuDetails.images[0].responsiveImage && (
                        <Image data={clSkuDetails.images[0].responsiveImage} />
                      )}
                    </>
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        img: {
                          width: "100%",
                          height:"100%",
                          objectFit: "contain",
                        },
                        backgroundColor: "light",
                      }}
                    >
                      <img src={PlaceholderImage} />
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
                          ":hover": {
                            "svg *": {
                              stroke: "primary",
                            },
                          },
                          "svg *": {
                            stroke: "lightBorder",
                          },
                        }}
                      >
                        <TrashIcon />
                      </Button>
                    </Box>
                  </Box>
                </Flex>
                <Box sx={{ pb: [2], color: "lightBorder" }}>
                  {clSkuDetails.code
                    ? clSkuDetails.code
                    : clSkuDetails.sku_code}
                </Box>
                <ThumbProductDetails item={clSkuDetails} />
                <ThumbPrice item={clSkuDetails} />
                <Flex sx={{ pb: [9], display: ["none", "none", "flex"] }}>
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
                        fontSize: [1, 3],
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
              <Flex sx={{ pb: [4], flexDirection: "column" }}>
                <SkuQuantity
                  sku={clSkuDetails}
                  quantity={currentQuantity}
                  updateQuantity={updateQuantity}
                  showMinMult={false}
                />
                <Box
                  sx={{
                    button: {
                      mt: [3, 3],
                      maxWidth: "330px",
                      minHeight: "37px",
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                      fontSize: [1, 3],
                      fontWeight: "600",
                      borderRadius: "unset",
                      p: [0],
                      px: [2],
                      ml: [0, 0],
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
  }
);

export default FavouriteProduct;
