import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Container, Heading } from "theme-ui";
import CustomerContext from "../hooks/customerContext";
import { buildClient } from "@datocms/cma-client-browser";
import { InboundLink } from "./link";
import { getProductPath } from "../utils/path";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import CustomCarousel from "./customCarousel";

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

    records.sort(function (a, b) {
      return (
        customer.metadata.recentlyViewed.indexOf(a.code) -
        customer.metadata.recentlyViewed.indexOf(b.code)
      );
    });

    setSkus(records);
  };

  useEffect(() => {
    if (customer) handleGetSkus();
  }, [customer]);

  return skus.length > 0 ? (
    <Box sx={{ position: "relative", backgroundColor: "#F4F4F4", pb:[11] }}>
      <Container sx={{py:[11,11]}}>
        <Heading as="h2" variant="h2" sx={{ my: [0], fontWeight: "600" }}>
          Continua ad acquistare
        </Heading>
      </Container>
      {/* to do hide on first one */}
      <CustomCarousel  small={true} data={skus} type="skus" />
    </Box>
  ) : null;
};

export default RecentlyViewedSkus;
