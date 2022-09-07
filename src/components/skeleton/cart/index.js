import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Box, Grid, Flex } from "theme-ui";
import CartProductSkeleton from "./cartProduct";

const CartSkeleton = () => {
  return (
    <Box>
      <Grid columns={[".7fr .3fr"]} gap={[12]}>
        <Box>
          <Box>
            <Skeleton width={"50%"} />
            <Skeleton width={"40%"} />
          </Box>
          <Grid sx={{ gridTemplateRows: "auto" }} gap={[8]}>
            {[1, 2].map((lineItem, index) => (
              <Box>
                <CartProductSkeleton />
              </Box>
            ))}
          </Grid>
        </Box>
        <Box>
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
        </Box>
      </Grid>
    </Box>
  );
};

export default CartSkeleton;
