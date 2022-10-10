import React from "react";
import { Box, Label, Radio, Text } from "theme-ui";

const ProductOrder = ({ handleOrderChange }) => {
  return (
    <Box>
      <Box sx={{ pb: [3] }}>
        <Text sx={{ fontWeight: "600", textDecoration: "none", color: "dark" }}>
          Ordina per
        </Text>
      </Box>
      <Box
        onChange={(e) => handleOrderChange(e)}
        sx={{
          label: {
            pb: [2],
            display: "flex",
            alignItems: "center",
          },
          "input:checked~ svg": {
            color: "secondary",
          },
        }}
      >
        <Label>
          <Radio name="order-by" value="ranking" defaultChecked={true} />
          Rilevanza
        </Label>
        <Label>
          <Radio name="order-by" value="code-asc" />
          Codice (Asc.)
        </Label>
        <Label>
          <Radio name="order-by" value="code-desc" />
          Codice (Disc.)
        </Label>
        <Label>
          <Radio name="order-by" value="name-asc" />
          Nome (Asc.)
        </Label>
        <Label>
          <Radio name="order-by" value="name-desc" />
          Nome (Disc.)
        </Label>
        <Label>
          <Radio name="order-by" value="price-asc" />
          Prezzo (Asc.)
        </Label>
        <Label>
          <Radio name="order-by" value="price-desc" />
          Prezzo (Disc.)
        </Label>
      </Box>
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "lightBorder",
          pt: [4],
          mb: [4],
        }}
      />
    </Box>
  );
};

export default ProductOrder;
