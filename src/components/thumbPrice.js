import React from "react";
import { Box, Text } from "theme-ui";
import BouncingDotsLoader from "./bouncingDotsLoader";

const ThumbPrice = ({ item }) => {
  return (
    <>
      <Box
        sx={{
          mb: [6],
          minHeight: ["30px"],
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text
          sx={{
            fontWeight: "600",
            fontSize: [4],
          }}
        >
          {item && item.formatted_unit_amount ? (
            item.formatted_unit_amount
          ) : item.prices && !item.formatted_unit_amount ? (
            item.prices.discountedPrice ? (
              "€" +
              item.prices.discountedPrice.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
              })
            ) : (
              "€" +
              item.prices.price.toLocaleString("it-IT", {
                minimumFractionDigits: 2,
              })
            )
          ) : (
            <Box
              sx={{
                minWidth: "70px",
                maxWidth: "70px",
              }}
            >
              <BouncingDotsLoader color="primary" />
            </Box>
          )}
        </Text>
      </Box>
    </>
  );
};

export default ThumbPrice;
