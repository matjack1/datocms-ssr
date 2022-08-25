import React from "react";
import { Box, Text } from "theme-ui";

const OrderCounter = ({ orders }) => {
  return (
    <Box>
      <Text sx={{fontWeight:"600"}}>{orders.length} Ordini</Text>
    </Box>
  );
};

export default OrderCounter;
