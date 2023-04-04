import React, { useState, useEffect } from "react";
import CustomCarousel from "./customCarousel";
import { Box, Container, Heading } from "theme-ui";
import getPrices from "../hooks/getPrices";

const RelatedProducts = ({ sku, skus, customer }) => {
  const [skusData, setSkusData] = useState(skus);
  const [pricesPage, setPricesPage] = useState(0);

  const getSkusPrices = async (pricesPage) => {
    let i = pricesPage;
    let chunkPrices = [];
    let allChunks = [];

    const data = pricesPage != 0 ? JSON.parse(JSON.stringify(skusData)) : skus;
    const chunkSize = 4;
    const reducedData = data.map((x) => x.code);

    

    for (let i = 0; i < reducedData.length; i += chunkSize) {
      const chunk = reducedData.slice(i, i + chunkSize);
      allChunks.push(chunk);
    }

    const prices = await getPrices({
      iduser: customer.reference,
      items: allChunks[i],
    });

    if (prices.items) chunkPrices = [...chunkPrices, ...prices.items];
    else
      chunkPrices = allChunks[i].map((x) => {
        return {
          itemcode: x,
          error: "no_price",
        };
      });

    let res = [];
    res = await Promise.all(
      data.map((obj) => {
        const index = chunkPrices.findIndex(
          (el) => el["itemcode"] == obj["code"]
        );
        if (chunkPrices[index]) {
          return {
            ...obj,
            prices: chunkPrices[index],
          };
        }

        return obj;
      })
    );

    setSkusData(res);

    if (pricesPage < allChunks.length - 1) {
      
      setPricesPage(pricesPage + 1);
    }
  };

  useEffect(() => {
    if (skus.length > 0 && customer) {
      if (pricesPage === 0) getSkusPrices(pricesPage);
    }
  }, []);

  useEffect(() => {
    if (skus.length > 0 && customer) {
      getSkusPrices(pricesPage);
    }
  }, [pricesPage]);

  return skusData ? (
    <Box sx={{ position: "relative" }}>
      <Container sx={{ py: [0, 0, 0] }}>
        <Box sx={{ py: [6, 8, 8], pb: [3, 8, 8] }}>
          <Heading as="h2" variant="h2" sx={{ my: [0] }}>
            Articoli correlati
          </Heading>
        </Box>
      </Container>
      {/* to do hide on first one */}
      <CustomCarousel
        small={false}
        data={skusData.sort(function (a, b) {
          return (
            (a.ranking === null) - (b.ranking === null) ||
            +(a.ranking > b.ranking) ||
            -(a.ranking < b.ranking)
          );
        })}
        type="skus"
        productThumbnail={true}
      />
    </Box>
  ) : null;
};

export default RelatedProducts;
