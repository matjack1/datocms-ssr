import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Box, Grid, Flex } from "theme-ui";
import OrderThumbSkeleton from "./orderThumbSkeleton";

const OrdersSkeleton = () => {
  return (
    <Box>
      <Box sx={{mb:4}}>
      <Skeleton width={"30%"} />
      <Skeleton width={"50%"} />
      </Box>
      <Grid columns={[1, ".85fr 4.15fr"]}>
        <Box>
          <Box as="ul" variant="ul" sx={{ listStyle: "none", pl: [0] }}>
             <Skeleton width={"100%"} />
             <Skeleton width={"100%"} />
             <Skeleton width={"100%"} />
             <Skeleton width={"100%"} />
          </Box>
          <Box
            sx={{
              pt: [1],
              mb: [4],
            }}
          />
          <Skeleton width={"100%"} />
          <Skeleton width={"100%"} />
          <Skeleton width={"100%"} />
          <Skeleton width={"100%"} />
          <Skeleton width={"100%"} />
        </Box>
        <Box>
            <Grid
              columns={["1fr", "1fr"]}
              sx={{
                columnGap: [3],
                rowGap: [9],
              }}
            >
              {[1,2,3,4,5,6].map((sku) => (
                <OrderThumbSkeleton />
              ))}
            </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default OrdersSkeleton;
