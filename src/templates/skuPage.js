import React, { useEffect, useState, useContext } from "react";
import { graphql } from "gatsby";
import { Box, Heading, Text } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import Nav from "../components/nav";
import AddToCart from "../components/addToCart";
import LineItemQuantity from "../components/lineItemQuantity";
import SkuQuantity from "../components/skuQuantity";
import Breadcumbs from "../components/breadcrumbs";
import CustomerContext from "../hooks/customerContext";
import CustomerTokenContext from "../hooks/customerTokenContext";

const SkuPage = ({ data: { sku } }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(sku.minimum);
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);

  const cl = useClSdk();

  const updateCustomer = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        // console.log("invalid token", e);
      }
    };

    let lastViewed = customer.metadata.lastViewed
      ? [...customer.metadata.lastViewed]
      : [];

    lastViewed = [...new Set(lastViewed)];
    
    if (lastViewed.length > 9) lastViewed.pop();

    if(!lastViewed.find((e)=> e === sku.code))
    lastViewed = [sku.code].concat(lastViewed);

    console.log("customer metadata", {
      ...customer.metadata,
      lastViewed: lastViewed,
    });

    const updatedCustomer = await cl.customers
      .update(
        {
          id: customerToken.owner_id,
          metadata: {
            ...customer.metadata,
            lastViewed: lastViewed,
          },
        }
      )
      .catch(handleError);

    // if (customer) {
    //   setCustomer(customer);
    // }
  };

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
    if (customer && customerToken) updateCustomer();
  }, [customer]);

  useEffect(() => {
    if (cl) {
      getClSku();
    }
  }, []);

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
