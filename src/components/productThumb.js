import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text, Flex, Heading } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";
import { GatsbyImage } from "gatsby-plugin-image";

const ProductThumb = memo(({ sku, handleSkuLoaded, horizontal = false }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const cl = useClSdk();

  useEffect(() => {
    setClSkuDetails(sku);
  }, [sku]);

  return (
    <Box>
      {clSkuDetails && (
        <InboundLink
          to={getProductPath(sku)}
          sx={{
            textDecoration: "none",
            color: "dark",
          }}
        >
          <Grid
            sx={{
              gridTemplateRows: !horizontal && "1fr auto",
              gridTemplateColumns: horizontal && [" 218px 1fr"],
            }}
            gap={[horizontal ? 11 : 3]}
          >
            <Flex sx={{ justifyItems: "baseline", width: "100%" }}>
              <Box
                sx={{ border: "1px solid", borderColor: "dark", width: "100%" }}
              >
                {sku.images && sku.images.length > 0 ? (
                  <GatsbyImage
                    image={sku.images[0].gatsbyImageData}
                    alt={sku.images[0].gatsbyImageData}
                  />
                ) : (
                  <Box
                    sx={{
                      height: horizontal ? "216px" : "319px",
                      width: "100%",
                      backgroundColor: "light",
                    }}
                  />
                )}
              </Box>
            </Flex>
            <Flex
              sx={{ flexDirection: "column", justifyContent: "space-between" }}
            >
              <Box sx={{ pb: [horizontal ? 5 : 3] }}>
                <Heading
                  as={horizontal ? "h3" : "h2"}
                  variant="h2"
                  sx={{
                    color: "dark",
                    whiteSpace: "break-spaces",
                    fontWeight: "400",
                    my: [0],
                    fontSize: horizontal ? [7, 7] : [4, 4],
                  }}
                >
                  {clSkuDetails.name}
                </Heading>
              </Box>
              <Box>
                {clSkuDetails.code ? clSkuDetails.code : clSkuDetails.sku_code}
              </Box>
              <Text
                sx={{
                  fontWeight: "600",
                  fontSize: [5],
                }}
              >
                {clSkuDetails && clSkuDetails.quantity && `Quantità ${clSkuDetails.quantity}`}
              </Text>
              <Text
                sx={{
                  fontWeight: "600",
                  fontSize: ["18px"],
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
            </Flex>
          </Grid>
        </InboundLink>
      )}
    </Box>
  );
});

export default ProductThumb;
