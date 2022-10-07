import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Box, Grid, Flex } from "theme-ui";
import ProductThumbSkeleton from "./productThumb";

const SearchSkeleton = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Skeleton width={"30%"} />
        <Skeleton width={"50%"} />
      </Box>
      <Grid
        columns={["1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr 1fr"]}
        sx={{
          columnGap: [3],
          rowGap: [9],
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((sku) => (
          <ProductThumbSkeleton />
        ))}
      </Grid>
    </Box>
  );
};

export default SearchSkeleton;
