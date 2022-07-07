import React from "react";
import { Box, Text } from "theme-ui";

const ProductCounter = ({ skus }) => {
  return (
    <Box>
      <Text>{skus.length} prodotti</Text>
    </Box>
  );
};

export default ProductCounter;
