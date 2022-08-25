import React from "react";
import { Box, Text } from "theme-ui";

const ProductCounter = ({ skus }) => {
  return (
    <Box>
      <Text sx={{fontWeight:"600"}}>{skus.length} articoli</Text>
    </Box>
  );
};

export default ProductCounter;
