import React from "react";
import { Box, Label, Radio, Text } from "theme-ui";

const ProductOrder = ({ handleOrderChange }) => {
  return (
    <Box>
      <Text>Ordina per</Text>
      <Box onChange={(e) => handleOrderChange(e)}>
        <Label>
          <Radio name="order-by" value="code-asc" defaultChecked={true} />
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
    </Box>
  );
};

export default ProductOrder;
