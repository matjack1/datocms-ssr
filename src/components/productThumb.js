import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text, Flex } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";
import { GatsbyImage } from "gatsby-plugin-image";

const ProductThumb = memo(({ sku, handleSkuLoaded }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const cl = useClSdk();

  useEffect(() => {
    setClSkuDetails(sku);
  }, [sku]);

  console.log("clSkuDetails", clSkuDetails);

  return (
    <Box>
      {clSkuDetails && (
        <InboundLink to={getProductPath(sku)} sx={{
          textDecoration:"none"
        }}>
          <Grid sx={{ gridTemplateRows: "1fr auto" }}gap={[3]}>
            <Flex sx={{ justifyItems: "baseline", width:"100%" }}>
              <Box sx={{border: "1px solid", borderColor:"dark", width:"100%"}}>
                {sku.images && sku.images.length > 0 ? (
                  <GatsbyImage
                    image={sku.images[0].gatsbyImageData}
                    alt={sku.images[0].gatsbyImageData}
                  />
                ) : (
                  <Box
                    sx={{
                      height:"319px",
                      width:"100%",
                      backgroundColor: "light",
                    }}
                  />
                )}
              </Box>
            </Flex>
            <Box>
              <Box>{clSkuDetails.name}</Box>
              <Box>{clSkuDetails.code}</Box>
              <Text sx={{
                fontWeight:"600",
                fontSize:["18px"]
              }}>
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
          </Grid>
        </InboundLink>
      )}
    </Box>
  );
});

export default ProductThumb;
