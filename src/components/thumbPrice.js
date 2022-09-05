import React from "react";
import { Box, Text } from "theme-ui";

const ThumbPrice = ({ item }) => {
  return (
    <Box sx={{ pb: [6] }}>
      <Text
        sx={{
          fontWeight: "600",
          fontSize: [4],
        }}
      >
        {item && item.formatted_unit_amount
          ? item.formatted_unit_amount
          : item.prices && !item.formatted_unit_amount
          ? item.prices.discountedPrice
            ? "€" +
              item.prices.discountedPrice.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
              })
            : "€" +
              item.prices.price.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
              })
          : "Caricamento del prezzo"}
      </Text>
    </Box>
  );
};

export default ThumbPrice;
