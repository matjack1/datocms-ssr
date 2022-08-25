import React, { useState, useEffect } from "react";
import CustomCarousel from "./customCrousel";
import { Box, Container, Heading } from "theme-ui";
import getPrices from "../hooks/getPrices";

const RelatedProducts = ({ sku, skus, customer }) => {
  const [skusData, setSkusData] = useState(skus);

  const getSkusPrices = async () => {
    let chunkPrices = [];
    let allChunks = [];
    const chunkSize = 4;
    const reducedData = skus.map((x) => x.code);

    for (let i = 0; i < reducedData.length; i += chunkSize) {
      const chunk = reducedData.slice(i, i + chunkSize);
      allChunks.push(chunk);
    }

    for (let i = 0; i < allChunks.length; i++) {
      const prices = await getPrices({
        iduser: customer.reference,
        items: allChunks[i],
      });

      if (prices.items) chunkPrices = [...chunkPrices, ...prices.items];

      let res = [];
      res = await Promise.all(
        skus.map((obj) => {
          const index = chunkPrices.findIndex(
            (el) => el["itemcode"] == obj["code"]
          );
          if (chunkPrices[index]) {
            return {
              ...obj,
              prices: {
                discount: chunkPrices[index].discount,
                discountedPrice: chunkPrices[index].discountedPrice,
                price: chunkPrices[index].price,
              },
            };
          }

          return obj;
        })
      );

      setSkusData(res);
    }
  };

  useEffect(() => {
    if (skus.length > 0 && customer) {
      getSkusPrices();
    }
  }, [skus,customer]);

  return skusData ? (
    <Box sx={{ position: "relative", pb: [11] }}>
      <Container sx={{ py: [11, 11] }}>
        <Heading as="h2" variant="h2" sx={{ my: [0], fontWeight: "600" }}>
          Articoli correlati
        </Heading>
      </Container>
      {/* to do hide on first one */}

      <CustomCarousel
        small={false}
        data={skusData}
        type="skus"
        productThumbnail={true}
      />
    </Box>
  ) : null;
};

export default RelatedProducts;
