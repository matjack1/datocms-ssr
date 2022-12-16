import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Text } from "theme-ui";
import { useDatoCmsSdk } from "../hooks/useDatoCmsSdk";

const LineItemQuantity = ({ lineItem, quantity, updateQuantity }) => {
  const [sku, setSku] = useState();
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [inputValue, setInputValue] = useState(quantity);
  const client = useDatoCmsSdk();

  console.log("LineItemQuantity");

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

  function handleQuantityChange(e) {
    setInputValue(e.target.value);
  }

  function addQuantity() {
    if (currentQuantity < 1000) {
      setInputValue(parseInt(inputValue) + 1);
      setCurrentQuantity(parseInt(currentQuantity) + 1);
    }
  }

  function removeQuantity() {
    if (currentQuantity > 2) {
      setInputValue(parseInt(inputValue) - 1);
      setCurrentQuantity(parseInt(currentQuantity) - 1);
    }
  }

  useEffect(() => {
    run();
  }, []);

  useEffect(() => {
    if (quantity != currentQuantity)
      updateQuantity(currentQuantity, lineItem.id);
  }, [currentQuantity]);

  return (
    <Box sx={{ pb: [4, 5, 9] }}>
      <Flex
        sx={{
          alignItems: "center",
        }}
      >
        <Text sx={{ mr: [5], fontSize: [2], color: "lightBorder" }}>
          Quantità:
        </Text>
        <Flex>
          <Box
            sx={{
              fontFamily: "body",
              color: "dark",
              borderColor: "dark",
            }}
          >
            {currentQuantity}
          </Box>
          {/* <Button
            sx={{mr:["-1px"]}}
            variant="buttons.darkEmpty"
            disabled={currentQuantity < 2}
            onClick={() => removeQuantity()}
          >
            -
          </Button>
          <Input
            sx={{ maxWidth: "120px", textAlign: "center" }}
            variant="inputs.dark"
            onChange={handleQuantityChange}
            onBlur={(e) => {
              if (e.target.value < 1 || isNaN(parseInt(e.target.value))) {
                setCurrentQuantity(1);
                setInputValue(1);
              } else if (e.target.value > 1000) {
                setCurrentQuantity(1000);
                setInputValue(1000);
              }
              else {
                setCurrentQuantity(
                  e.target.value.replace(/[^0-9a-zA-Z]+/g, "")
                );
                setInputValue(e.target.value.replace(/[^0-9a-zA-Z]+/g, ""));
              }
            }}
            max="1000"
            type="tel"
            pattern="[0-9]*"
            inputmode="numeric"
            defaultValue={currentQuantity}
            value={inputValue}
          />
          <Button
            sx={{ml:["-1px"]}}
            variant="buttons.darkEmpty"
            disabled={currentQuantity > 1000}
            onClick={() => addQuantity()}
          >
            +
          </Button> */}
        </Flex>
      </Flex>
    </Box>
  );
};

export default LineItemQuantity;
