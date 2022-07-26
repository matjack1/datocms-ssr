import React, { useEffect, useState, useContext } from "react";
import { graphql } from "gatsby";
import { Box, Heading, Text, Button } from "theme-ui";
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

  const updateCustomerRecentlyViewed = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        // console.log("invalid token", e);
      }
    };

    let recentlyViewed = customer.metadata.recentlyViewed
      ? [...customer.metadata.recentlyViewed]
      : [];

    recentlyViewed = [...new Set(recentlyViewed)];

    if (recentlyViewed.length > 9) recentlyViewed.pop();

    if (!recentlyViewed.find((e) => e === sku.code))
      recentlyViewed = [sku.code].concat(recentlyViewed);

    const updatedCustomer = await cl.customers
      .update({
        id: customerToken.owner_id,
        metadata: {
          ...customer.metadata,
          recentlyViewed: recentlyViewed,
        },
      })
      .catch(handleError);
  };

  const updateCustomerFavourites = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        // console.log("invalid token", e);
      }
    };

    let favourites = customer.metadata.favourites
      ? [...customer.metadata.favourites]
      : [];

      favourites = [...new Set(favourites)];

    if (!favourites.find((e) => e === sku.code))
    favourites = [sku.code].concat(favourites);

    const updatedCustomer = await cl.customers
      .update({
        id: customerToken.owner_id,
        metadata: {
          ...customer.metadata,
          favourites: favourites,
        },
      })
      .catch(handleError);
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
    if (customer && customerToken) updateCustomerRecentlyViewed();
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
      <Button onClick={updateCustomerFavourites} sx={{ cursor: "pointer" }}>
        <Box
          dangerouslySetInnerHTML={{
            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
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
