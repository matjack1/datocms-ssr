import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Box, Grid, Flex } from "theme-ui";

const OrderThumbSkeleton = () => {
  return (
    <Box>
      <Grid gap={[10]} columns={["167px auto"]}>
        <Skeleton width={"166px"} height={"166px"} />
        <Box>
          <Flex
            sx={{
              alignItems: "start",
              justifyContent: "space-between",
              pb: [5],
            }}
          >
            <Skeleton width={"20%"} />
            <Skeleton width={"20%"} />
          </Flex>
          <Box sx={{ fontSize: [2], pb: [5], color: "lightBorder" }}>
            <Skeleton width={"50%"} />
          </Box>
          <Grid
            columns={["20px auto"]}
            gap={[0]}
            sx={{
              fontSize: [2],
              alignItems: "center",
              color: "lightBorder",
            }}
          >
            <Skeleton width={"100%"} />
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default OrderThumbSkeleton;
