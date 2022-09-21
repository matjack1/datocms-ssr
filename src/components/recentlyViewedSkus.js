import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Heading } from "theme-ui";
import CustomerContext from "../hooks/customerContext";
import { buildClient } from "@datocms/cma-client-browser";
import CustomCarousel from "./customCarousel";

const RecentlyViewedSkus = () => {
  const client = buildClient({ apiToken: "7f672cb51a4f9c2dce0c59b466b8c6" });
  const { customer, setCustomer } = useContext(CustomerContext);
  const [skus, setSkus] = useState([]);

  const token = "7f672cb51a4f9c2dce0c59b466b8c6";
  function handleGetSkus() {
    const skus = customer.metadata.recentlyViewed;
    var query = `query RollDice($skus: [String]) {
      allSkus(filter: {code: {in: $skus}}) {
        id
        code
        images {
          id
          responsiveImage(imgixParams: {fit: crop, w: 600, h: 600 }) {
            srcSet           
              webpSrcSet
              sizes
              src
              width
              height
              aspectRatio
              alt
              title
              bgColor
              base64
          }  
        }}
      }`;

    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { skus },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("DATA", skus, res.data);
        setSkus(res.data.allSkus);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
    if (customer && customer.metadata.recentlyViewed.length > 0)
      handleGetSkus();
  }, [customer]);

  return skus.length > 0 ? (
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
