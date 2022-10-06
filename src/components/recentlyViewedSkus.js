import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Heading } from "theme-ui";
import CustomerContext from "../hooks/customerContext";
import { buildClient } from "@datocms/cma-client-browser";
import CustomCarousel from "./customCarousel";
import getSkusImage from "../hooks/getSkusImages";

const RecentlyViewedSkus = () => {
  const client = buildClient({ apiToken: "7f672cb51a4f9c2dce0c59b466b8c6" });
  const { customer, setCustomer } = useContext(CustomerContext);
  const [skus, setSkus] = useState([]);

  const handleGetSkus = async () => {
    const skus = customer.metadata.recentlyViewed;
    console.log("await getSkusImage(skus)", await getSkusImage(skus));
    setSkus(await getSkusImage(skus));
  };

  // const handleGetSkus = async () => {
  //   const records = await client.items.list({
  //     filter: {
  //       type: "313716",
  //       fields: {
  //         code: {
  //           in: customer.metadata.recentlyViewed,
  //         },
  //       },
  //     },
  //   });

  //   records.sort(function (a, b) {
  //     return (
  //       customer.metadata.recentlyViewed.indexOf(a.code) -
  //       customer.metadata.recentlyViewed.indexOf(b.code)
  //     );
  //   });

  //   setSkus(records);
  //   console.log("RECENTLY VIEWED", records);
  // };

  useEffect(() => {
    if (
      customer &&
      customer.metadata &&
      customer.metadata.recentlyViewed &&
      customer.metadata.recentlyViewed.length > 0
    )
      handleGetSkus();
  }, [customer]);

  return skus && skus.length > 0 ? (
    <Box sx={{ position: "relative", backgroundColor: "#F4F4F4", pb: [6, 11] }}>
      <Container sx={{ py: [6, 11, 11], pb: [3, 11, 11] }}>
        <Heading as="h2" variant="h2" sx={{ my: [0], fontWeight: "600" }}>
          Continua ad acquistare
        </Heading>
      </Container>
      {/* to do hide on first one */}
      <CustomCarousel small={true} data={skus} type="skus" />
    </Box>
  ) : null;
};

export default RecentlyViewedSkus;
