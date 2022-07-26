import React, { useContext, useEffect, useState } from "react";
import { Box } from "theme-ui";
import CustomerContext from "../../../hooks/customerContext";
import { buildClient } from "@datocms/cma-client-browser";
import CustomerFavourite from "./favourite";
import { useClSdk } from "../../../hooks/useClSdk";
import CustomerTokenContext from "../../../hooks/customerTokenContext";

const CustomerFavourites = () => {
  const cl = useClSdk();
  const client = buildClient({ apiToken: "7f672cb51a4f9c2dce0c59b466b8c6" });
  const { customer, setCustomer } = useContext(CustomerContext);
  const [skus, setSkus] = useState([]);

  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);

  console.log("enters");

  const handleGetSkus = async () => {
    const records = await client.items.list({
      filter: {
        type: "313716",
        fields: {
          code: {
            in: customer.metadata.favourites,
          },
        },
      },
    });

    if (customer.metadata.favourites)
      records.sort(function (a, b) {
        return (
          customer.metadata.favourites.indexOf(a.code) -
          customer.metadata.favourites.indexOf(b.code)
        );
      });

    console.log("customer.metadata.favourites", customer.metadata.favourites, records);

    setSkus(records);
  };

  const handleDeleteFavourite = async (sku) => {
    console.log("called")
    // const handleError = (e) => {
    //   if (e.errors[0].code === "INVALID_TOKEN") {
    //     setCustomerToken(null);
    //     // console.log("invalid token", e);
    //   }
    // };

    // let favourites = customer.metadata.favourites;

    // favourites = favourites.filter((e) => e !== sku.code);

    // const updatedCustomer = await cl.customers
    //   .update({
    //     id: customerToken.owner_id,
    //     metadata: {
    //       ...customer.metadata,
    //       favourites: favourites,
    //     },
    //   })
    //   .catch(handleError);
  };

  useEffect(() => {
    if (customer && customer.metadata.favourites.length > 0) handleGetSkus();
  }, [customer]);

  return skus.length > 0 ? (
    <Box>
      {skus.map((sku) => (
        <Box>
          <CustomerFavourite
            sku={sku}
            handleDeleteFavourite={() => handleDeleteFavourite(sku)}
          />
        </Box>
      ))}
    </Box>
  ) : (
    <Box>La lista dei preferiti è vuota</Box>
  );
};

export default CustomerFavourites;
