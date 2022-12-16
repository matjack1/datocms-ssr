import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Text } from "theme-ui";

const SkuQuantity = ({ sku, quantity, updateQuantity, showMinMult = true }) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  console.log(sku.multiple)

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
    <Box >
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
            variant="buttons.darkEmpty"
            onClick={() => removeQuantity()}
          >
            -
          </Button>
          <Flex
            sx={{
              width: "100px",
              justifyContent: "center",
              alignItems: "center",
              borderTop: "1px solid",
              borderBottom: "1px solid",
              borderColor: "dark",
              py: [2],
            }}
          >
            {currentQuantity}
          </Flex>
          <Button
            variant="buttons.darkEmpty"
            disabled={!sku}
            onClick={() => addQuantity()}
          >
            +
          </Button>
        </Flex>
        {showMinMult && (
          <Text sx={{ pl: [2], fontSize: [1], color: "lightBorder" }}>
            minimo {sku.minimum}
            <br />
            multiplo {sku.multiple}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default SkuQuantity;
