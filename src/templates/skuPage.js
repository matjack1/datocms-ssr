import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import { Box, Heading, Text } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import Nav from "../components/nav";
import AddToCart from "../components/addToCart";
import LineItemQuantity from "../components/lineItemQuantity";
import SkuQuantity from "../components/skuQuantity";
import Breadcumbs from "../components/breadcrumbs"

const SkuPage = ({ data: { sku } }) => {
  console.log(sku);

  const [clSkuDetails, setClSkuDetails] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(sku.minimum);
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
    if(clSku && clSku[0])
    setClSkuDetails(clSku[0]);
  };

  const updateQuantity = (quantity) => {
    console.log(quantity);
    setCurrentQuantity(quantity);
  };

  useEffect(() => {
    if (cl) {
      getClSku();
    }
  }, [cl]);

  return (
    <Box>
      <Nav />
      <Breadcumbs page={sku} />
      <Heading as="h1">{sku.name}</Heading>
      <Text as="p">{sku.code}</Text>
      <SkuQuantity
        sku={sku}
        quantity={currentQuantity}
        updateQuantity={updateQuantity}
      />
      <AddToCart sku={clSkuDetails} quantity={currentQuantity} />
      {clSkuDetails && (
        <Box>
          <Text as="p">{clSkuDetails.prices[0].formatted_amount}</Text>
        </Box>
      )}
    </Box>
  );
};

export default SkuPage;

export const query = graphql`
  query SkuPageQuery($id: String!) {
    sku: datoCmsSku(id: { eq: $id }) {
      ...SkuDetails
    }
  }
  fragment SkuDetails on DatoCmsSku {
    id
    name
    code
    slug
    minimum
    multiple
    model {
      apiKey
    }
    locale
    category {
      id 
      name
      locale
      slug
      treeParent {
        id
        name
        slug
        root
        locale
        treeParent {
          id
          name
          slug
          root
          locale
        }
      }
    }
  }
`;
