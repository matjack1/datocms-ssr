import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Box, Grid, Flex } from "theme-ui";

const SkuPageSkeleton = () => {
  return (
    <>
      <Box sx={{ pb: [4] }}>
        <Skeleton width={"20%"} />
      </Box>
      <Grid columns={["minmax(auto,672px) minmax(auto, 469px)"]} gap={[11]}>
        <Box
          sx={{
            aspectRatio: "1",
            "@supports not (aspect-ratio: 1 / 1)": {
              "&::before": {
                cssFloat: "left",
                paddingTop: "100%",
                content: '""',
              },
              "&::after": { display: "block", content: '""', clear: "both" },
            },
          }}
        >
          <Skeleton width={"100%"} height="469px" />

          <Box sx={{ pt: [5], pb: [5] }}>
            <Skeleton width={"60%"} />
            <Skeleton width={"40%"} />
            <Skeleton width={"50%"} />
          </Box>

          <Box sx={{ pt: [5], pb: [5] }}>
            <Skeleton width={"60%"} />
            <Skeleton width={"40%"} />
            <Skeleton width={"50%"} />
          </Box>

          <Box sx={{ pt: [5], pb: [5] }}>
            <Skeleton width={"60%"} />
            <Skeleton width={"40%"} />
            <Skeleton width={"50%"} />
          </Box>
        </Box>
        <Box sx={{}}>
          <Box sx={{ pb: [8] }}>
            <Skeleton width={"100%"} height={"60px"} />
          </Box>
          <Box sx={{ pb: [6] }}>
            <Skeleton width={"80%"} />
            <Skeleton width={"100%"} />
          </Box>

          <Box sx={{ pb: [6] }}>
            <Skeleton width={"100%"} />
          </Box>

          <Box>
            <Skeleton width={"80%"} />
            <Skeleton width={"80%"} />
            <Skeleton width={"80%"} />
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default SkuPageSkeleton;
