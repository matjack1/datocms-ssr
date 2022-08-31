import React from "react";
import { Box, Text } from "theme-ui";

const ProductCounter = ({ skus }) => {
  return (
    <Box>
      <Text sx={{ fontWeight: "600" }}>
        {skus.length} articol{skus.length > 0 ? "i" : "o"}
      </Text>
    </Box>
  );
};

export default ProductCounter;
