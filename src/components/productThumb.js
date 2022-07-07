import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Text } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import { getProductPath } from "../utils/path";
import { InboundLink } from "./link";

const ProductThumb = memo(({ sku, handleSkuLoaded }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const cl = useClSdk();

  const getClSku = async () => {
    const handleError = (e) => {
      console.log(e);
    };
    const clSku = await cl.skus
      .list({
        filters: { code_eq: sku.code },
        include: ["prices", "stock_items"],
      })
      .catch(handleError);
    setClSkuDetails(clSku[0]);
    handleSkuLoaded(clSku[0]);
  };

  useEffect(() => {
    if (cl) {
      getClSku();
    }
  }, []);

  return (
    <Box>
      <InboundLink to={getProductPath(sku)}>
        <Grid columns={2} gap={32}>
          <Box>Image</Box>
          <Box>
            <Box>{sku.name}</Box>
            <Box>{sku.code}</Box>
            <Text>
              {clSkuDetails ? clSkuDetails.prices[0].formatted_amount : "-"}
            </Text>
          </Box>
        </Grid>
      </InboundLink>
    </Box>
  );
});

export default ProductThumb;
