import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";

const ProductThumb = memo(({ sku, handleSkuLoaded }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const cl = useClSdk();

  useEffect(()=>{
    setClSkuDetails(sku)
  },[sku])

  // console.log(clSkuDetails)

  return (
    <Box>
      {clSkuDetails && (
        <InboundLink to={getProductPath(sku)}>
          <Grid columns={2} gap={32}>
            <Box>Image</Box>
            <Box>
              <Box>{clSkuDetails.name}</Box>
              <Box>{clSkuDetails.code}</Box>
              <Text>{clSkuDetails && clSkuDetails.prices && clSkuDetails.prices.length > 0 ? clSkuDetails.prices[0].formatted_amount : "-"}</Text>
            </Box>
          </Grid>
        </InboundLink>
      )}
    </Box>
  );
});

export default ProductThumb;
