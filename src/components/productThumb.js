import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text, Flex, Heading, Image } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";
import { GatsbyImage } from "gatsby-plugin-image";
import PlaceholderImage from "../assets/img/placeholder-image.png";

const ProductThumb = memo(({ sku, horizontal = false, small = false }) => {
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
              gridTemplateColumns: horizontal
                ? small ? ["78px 1fr"] : ["218px 1fr"]
                : "",
            }}
            gap={[horizontal ? (small ? 5 : 11) : 3]}
          >
            <Flex sx={{ justifyItems: "baseline", width: "100%" }}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "dark",
                  width: "100%",
                  height: small && "79px",
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
                        height: horizontal ? "100%" : "319px",
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
              sx={{ flexDirection: "column", justifyContent: "space-between" }}
            >
              <Box sx={{ pb: [horizontal ? 0 : 3] }}>
                <Heading
                  as={horizontal ? "h3" : "h2"}
                  variant="h2"
                  sx={{
                    color: "dark",
                    whiteSpace: "break-spaces",
                    fontWeight: "400",
                    my: [0],
                    fontSize: horizontal ? (small ? [1, 1] : [2, 2]) : [2, 2],
                  }}
                >
                  {clSkuDetails.name}
                </Heading>
              </Box>
              <Box sx={{ color: "lightBorder", fontSize: small && [1, 1], pb:[2] }}>
                {clSkuDetails.code ? clSkuDetails.code : clSkuDetails.sku_code}
              </Box>
              <Text
                sx={{
                  fontWeight: "400",
                  fontSize: small ? [1, 1] : [5],
                  color: "dark",
                }}
              >
                {clSkuDetails &&
                  clSkuDetails.quantity &&
                  `Quantità ${clSkuDetails.quantity}`}
              </Text>
              <Text
                sx={{
                  fontWeight: "600",
                  fontSize: small ? [1, 1] : [3,3],
                  pt: [2],
                  color:"dark"
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
            </Flex>
          </Grid>
        </InboundLink>
      )}
    </Box>
  );
});

export default ProductThumb;
