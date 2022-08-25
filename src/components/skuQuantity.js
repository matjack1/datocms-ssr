import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Text } from "theme-ui";

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
    <Box sx={{ pb: [9] }}>
      <Flex
        sx={{
          alignItems: "center",
        }}
      >
        <Text sx={{ mr: [5], fontSize: [1], color: "lightBorder" }}>
          Quantita:
        </Text>
        <Flex>
          <Button
            disabled={currentQuantity <= sku?.multiple}
            variant="buttons.primaryEmpty"
            onClick={() => removeQuantity()}
          >
            -
          </Button>
          <Flex
            sx={{
              width: "100px",
              justifyContent: "center",
              alignItems: "center",
              borderTop:"1px solid",
              borderBottom: "1px solid",
              borderColor:"dark",
              py:[2]
            }}
          >
            {currentQuantity}
          </Flex>
          <Button
            variant="buttons.primaryEmpty"
            disabled={!sku}
            onClick={() => addQuantity()}
          >
            +
          </Button>
        </Flex>
        <Text sx={{ pl: [2], fontSize: [1], color: "lightBorder" }}>
          minimo {sku.minimum}
          <br />
          multiplo {sku.multiple}
        </Text>
      </Flex>
    </Box>
  );
};

export default SkuQuantity;
