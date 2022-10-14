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
          color: "dark",
        }}
      >
        <Text
          sx={{
            fontWeight: "600",
            fontSize: [1, 4],
          }}
        >
          {item && item.formatted_unit_amount ? (
            item.formatted_unit_amount
          ) : item.prices &&
            !item.formatted_unit_amount &&
            !item.prices.error ? (
            item.prices.discountedPrice ? (
              "€" +
              (item.prices.discountedPrice / 100).toLocaleString("it-IT", {
                minimumFractionDigits: 2,
              })
            ) : (
              "€" +
              (item.prices.price / 100).toLocaleString("it-IT", {
                minimumFractionDigits: 2,
              })
            )
          ) : item.prices && item.prices.error ? (
            <Box>Prezzo non disponibile</Box>
          ) : (
            <Box
              sx={{
                minWidth: "80px",
                maxWidth: "80px",
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
