import React, { useEffect, useState, useContext } from "react";
import { graphql } from "gatsby";
import { Box, Heading, Text, Button } from "theme-ui";
import { useClSdk } from "../../../hooks/useClSdk";
import AddToCart from "../../addToCart";
import SkuQuantity from "../../skuQuantity";
import CustomerContext from "../../../hooks/customerContext";
import CustomerTokenContext from "../../../hooks/customerTokenContext";

const CustomerFavourite = ({ sku, handleDeleteFavourite }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(sku.minimum);
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);

  const cl = useClSdk();

  const getClSku = async () => {
    const handleError = (e) => {
      console.log(e);
    };
    const clSku = await cl.skus
      .list({
        filters: { code_eq: sku.code },
        include: ["prices", "stock_items"],
      })
      .catch(handleError);
    if (clSku && clSku[0]) setClSkuDetails(clSku[0]);
  };

  const updateQuantity = (quantity) => {
    console.log(quantity);
    setCurrentQuantity(quantity);
  };

  useEffect(() => {
    if (cl) {
      getClSku();
    }
  }, []);

  return (
    <Box>
      <Heading as="h1">{sku.name}</Heading>
      <Text as="p">{sku.code}</Text>
      <SkuQuantity
        sku={sku}
        quantity={currentQuantity}
        updateQuantity={updateQuantity}
      />
      <AddToCart sku={clSkuDetails} quantity={currentQuantity} />
      <Button onClick={handleDeleteFavourite} sx={{ cursor: "pointer" }}>
        <Box
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
          }}
        />
      </Button>
      {clSkuDetails && (
        <Box>
          <Text as="p">
            {clSkuDetails &&
              clSkuDetails.prices[0] &&
              clSkuDetails.prices[0].formatted_amount}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default CustomerFavourite;
