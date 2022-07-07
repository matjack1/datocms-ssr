import React, { useEffect, useState } from "react";
import { Box, Button } from "theme-ui";
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
    updateQuantity(currentQuantity, lineItem.id);
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

export default LineItemQuantity;
