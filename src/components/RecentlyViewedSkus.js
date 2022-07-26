import React, { useContext, useEffect, useState } from "react";
import { Box } from "theme-ui";
import CustomerContext from "../hooks/customerContext";
import { buildClient } from "@datocms/cma-client-browser";

const RecentlyViewedSkus = () => {
  const client = buildClient({ apiToken: "7f672cb51a4f9c2dce0c59b466b8c6" });
  const { customer, setCustomer } = useContext(CustomerContext);
  const [skus, setSkus] = useState([]);

  const handleGetSkus = async () => {
    console.log("customer", customer);
    const records = await client.items.list({
      filter: {
        type: "313716",
        fields: {
          code: {
            in: customer.metadata.recentlyViewed,
          },
        },
      },
    });

    records.sort(function(a, b){  
        return customer.metadata.recentlyViewed.indexOf(a.code) - customer.metadata.recentlyViewed.indexOf(b.code);
    });

    setSkus(records);
  };

  useEffect(() => {
    if (customer) handleGetSkus();
  }, [customer]);

  return skus.length > 0 ? (
    <Box>
      {skus.map((sku) => (
        <Box>SKU NR : {sku.code}</Box>
      ))}
    </Box>
  ) : null;
};

export default RecentlyViewedSkus;
