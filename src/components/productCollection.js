import React, { useEffect, useState } from "react";
import { Box, Grid } from "theme-ui";
import ProductCounter from "./productCounter";
import ProductOrder from "./productOrder";
import ProductThumb from "./productThumb";

const ProductCollection = ({ skus }) => {
  const [filteredSkus, setFilteredSkus] = useState(skus);
  const [orderBy, setOrderBy] = useState("code-asc");

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  const handleSkuLoaded = (clSku) => {
    if (clSku) {
      setFilteredSkus(
        filteredSkus.concat().map((sku) => {
          if (sku.code === clSku.code)
            return {
              ...sku,
              prices: clSku.prices[0],
            };
          else return sku;
        })
      );
    }
  };

  function orderProducts() {
    switch (orderBy) {
      case "price-asc":
        return setFilteredSkus(
          filteredSkus.concat().sort((a, b) => {
            const first =
              typeof a.prices !== "undefined" ? a.prices.amount_cents : 0;
            const second =
              typeof b.prices !== "undefined" ? b.prices.amount_cents : 0;
            console.log(first, second);
            return first - second;
          })
        );
      case "price-desc":
        return setFilteredSkus(
          filteredSkus
            .concat()
            .sort((a, b) => {
              const first =
                typeof a.prices !== "undefined" ? a.prices.amount_cents : 0;
              const second =
                typeof b.prices !== "undefined" ? b.prices.amount_cents : 0;
              console.log(a, first, b, second);
              return first - second;
            })
            .reverse()
        );
      case "code-asc":
        return setFilteredSkus(
          filteredSkus.concat().sort((a, b) => a.code.localeCompare(b.code))
        );
      case "code-desc":
        return setFilteredSkus(
          filteredSkus
            .concat()
            .sort((a, b) => a.code.localeCompare(b.code))
            .reverse()
        );
      case "name-asc":
        return setFilteredSkus(
          filteredSkus.concat().sort((a, b) => a.name.localeCompare(b.name))
        );

      case "name-desc":
        return setFilteredSkus(
          filteredSkus
            .concat()
            .sort((a, b) => a.name.localeCompare(b.name))
            .reverse()
        );
      default:
        return filteredSkus;
    }
  }

  useEffect(() => {
    orderProducts();
  }, [orderBy]);

  return (
    <Box>
      {filteredSkus && (
        <Grid columns={[1, "1fr 4fr"]}>
          <ProductOrder handleOrderChange={handleOrderChange} />
          <Box>
            <ProductCounter skus={filteredSkus} />
            {filteredSkus.map((sku) => (
              <ProductThumb
                sku={sku}
                key={sku.id}
                handleSkuLoaded={handleSkuLoaded}
              />
            ))}
          </Box>
        </Grid>
      )}
    </Box>
  );
};

export default ProductCollection;
