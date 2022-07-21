import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";

const ProductThumb = memo(({ sku, handleSkuLoaded }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const cl = useClSdk();

  return (
    <Box>
      {sku && (
        <InboundLink to={getProductPath(sku)}>
          <Grid columns={2} gap={32}>
            <Box>Image</Box>
            <Box>
              <Box>{sku.name}</Box>
              <Box>{sku.code}</Box>
              <Text>{sku ? sku.prices[0].formatted_amount : "-"}</Text>
            </Box>
          </Grid>
        </InboundLink>
      )}
    </Box>
  );
});

export default ProductThumb;
