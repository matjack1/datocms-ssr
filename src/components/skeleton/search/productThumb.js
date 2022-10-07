import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Box, Grid, Flex } from "theme-ui";

const ProductThumbSkeleton = ({ horizontal = false, small = false }) => {
  return (
    <Box>
      <Grid
        sx={{
          gridTemplateRows: !horizontal && "1fr auto",
          gridTemplateColumns: horizontal
            ? small
              ? ["78px 1fr"]
              : ["218px 1fr"]
            : "",
        }}
        gap={[horizontal ? (small ? 5 : 10) : 3]}
      >
        <Skeleton width={"100%"} height={small ? "79px" : "319px"} />
        <Flex sx={{ flexDirection: "column", justifyContent: "space-between" }}>
          <Box
            sx={{
              pb: [horizontal ? 4 : 3],
            }}
          >
            <Skeleton width={"100%"} />
          </Box>
          <Skeleton width={"100%"} />
          <Skeleton width={"100%"} />
          <Skeleton width={"100%"} />
        </Flex>
      </Grid>
    </Box>
  );
};

export default ProductThumbSkeleton;
