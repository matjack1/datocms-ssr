import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text, Flex, Heading, Image } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";
import { GatsbyImage } from "gatsby-plugin-image";
import PlaceholderImage from "../assets/img/placeholder-image.png";
import ThumbPrice from "./thumbPrice";
import { TruncateEllipsis } from "../utils/truncateEllipsis";
import { useBreakpointIndex } from "@theme-ui/match-media";

const ProductThumb = memo(({ sku, horizontal = false, small = false }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const cl = useClSdk();
  const mediaIndex = useBreakpointIndex();

  useEffect(() => {
    setClSkuDetails(sku);
  }, [sku]);

  return (
    <Box>
      {clSkuDetails && (
        <InboundLink
          aria-current="page"
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
                ? small
                  ? ["78px 1fr"]
                  : ["185px auto", "218px 1fr"]
                : ["160px", "290px"],
            }}
            gap={horizontal ? (small ? [3, 5] : [3, 10]) : [3]}
          >
            <Flex
              sx={{
                display: "flex",
                overflow: "hidden",
                justifyItems: "baseline",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "dark",
                  width: "100%",
                  height: horizontal
                    ? small
                      ? ["78px"]
                      : ["185px", "218px"]
                    : ["160px", "290px"],
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
                justifyContent: !horizontal && "space-between",
              }}
            >
              <Box
                sx={{
                  pb: [horizontal ? 4 : 3],
                }}
              >
                <Heading
                  as={horizontal ? "h3" : "h2"}
                  variant="h2"
                  sx={{
                    color: "dark",
                    whiteSpace: "break-spaces",
                    fontWeight: "400",
                    my: [0],
                    fontSize: horizontal
                      ? small
                        ? [1, 1, 1]
                        : [1, 5, 5, 5]
                      : [2, 2],
                  }}
                >
                  {horizontal ? clSkuDetails.name : TruncateEllipsis(clSkuDetails.name, mediaIndex > 1 ? 1000 : 50)}
                </Heading>
              </Box>
              <Box
                sx={{
                  color: "lightBorder",
                  fontSize: small && [1, 1],
                  pb: [2],
                }}
              >
                {clSkuDetails.code ? clSkuDetails.code : clSkuDetails.sku_code}
              </Box>
              {clSkuDetails && clSkuDetails.quantity && (
                <Text
                  sx={{
                    fontWeight: "400",
                    fontSize: small ? [1, 1] : [2],
                    pb: [3],
                    color: "lightBorder",
                  }}
                >
                  {`Quantità ${clSkuDetails.quantity}`}
                </Text>
              )}
              <ThumbPrice item={clSkuDetails} />
            </Flex>
          </Grid>
        </InboundLink>
      )}
    </Box>
  );
});

export default ProductThumb;
