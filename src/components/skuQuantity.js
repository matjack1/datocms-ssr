import React, { useEffect, useState } from "react";
import { Box, Button } from "theme-ui";

const SkuQuantity = ({ sku, quantity, updateQuantity }) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  function addQuantity() {
    setCurrentQuantity(currentQuantity + sku.multiple);
  }

  function removeQuantity() {
    setCurrentQuantity(currentQuantity - sku.multiple);
  }

  useEffect(() => {
    updateQuantity(currentQuantity);
  }, [currentQuantity]);

  return (
    <Box>
      <Button
        disabled={currentQuantity <= sku?.multiple}
        onClick={() => removeQuantity()}
      >
        -
      </Button>
      <Box>{currentQuantity}</Box>
      <Button disabled={!sku} onClick={() => addQuantity()}>
        +
      </Button>
    </Box>
  );
};

export default SkuQuantity;
