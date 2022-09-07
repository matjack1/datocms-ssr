import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Box, Grid, Flex } from "theme-ui";

const CartProductSkeleton = () => {
  return (
    <Box sx={{ my: 4 }}>
      <Grid
        sx={{
          gridTemplateColumns: ["168px 1fr"],
        }}
        gap={[10]}
      >
        <Skeleton width={"100%"} height={"168px"} />
        <Flex
          sx={{
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box>
              <Skeleton width={"100%"} />
            </Box>
            <Box>
              <Skeleton width={"100%"} />
            </Box>
            <Box>
              <Skeleton width={"100%"} />
            </Box>
            <Box>
              <Skeleton width={"100%"} />
            </Box>
            <Box>
              <Skeleton width={"100%"} />
            </Box>
          </Box>
        </Flex>
      </Grid>
    </Box>
  );
};

export default CartProductSkeleton;
