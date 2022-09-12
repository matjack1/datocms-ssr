import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Text } from "theme-ui";
import { useDatoCmsSdk } from "../hooks/useDatoCmsSdk";

const LineItemQuantity = ({ lineItem, quantity, updateQuantity }) => {
  const [sku, setSku] = useState();
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const client = useDatoCmsSdk();

  async function run() {
    const records = await client.items.list({
      filter: {
        type: "sku",
        fields: {
          code: {
            eq: lineItem.code,
          },
        },
      },
    });

    setSku(records[0]);
  }

  function addQuantity() {
    setCurrentQuantity(currentQuantity + sku.multiple);
  }

  function removeQuantity() {
    setCurrentQuantity(currentQuantity - sku.multiple);
  }

  useEffect(() => {
    run();
  }, []);

  useEffect(() => {
    if(quantity != currentQuantity)
    updateQuantity(currentQuantity, lineItem.id);
  }, [currentQuantity]);

  return (
    <Box sx={{ pb: [4,5,9] }}>
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
            variant="buttons.darkEmpty"
            disabled={currentQuantity <= sku?.multiple}
            onClick={() => removeQuantity()}
          >
            -
          </Button>
          <Flex
            sx={{
              width: "80px",
              justifyContent: "center",
              alignItems: "center",
              borderTop: "1px solid",
              borderBottom: "1px solid",
              borderColor: "dark",
              py: [2],
              fontSize:[1,2]
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
        <Text sx={{ pl: [2], fontSize: [1], color: "lightBorder" }}>
          minimo {sku?.minimum}
          <br />
          multiplo {sku?.multiple}
        </Text>
      </Flex>
    </Box>
  );
};

export default LineItemQuantity;
