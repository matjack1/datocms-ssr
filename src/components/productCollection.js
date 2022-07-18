import React, { useEffect, useState } from "react";
import { Box, Grid, Text, Button } from "theme-ui";
import ProductCounter from "./productCounter";
import ProductOrder from "./productOrder";
import ProductFilters from "./productFilters";
import ProductThumb from "./productThumb";

const ProductCollection = ({ skus }) => {
  const [filteredSkus, setFilteredSkus] = useState(skus);
  const [orderBy, setOrderBy] = useState("code-asc");
  const [filters, setFilters] = useState({});
  const [checkedFilters, setCheckedFilters] = useState({});

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  const handleFiltersChange = (checked, filter) => {
    let tmp = { ...checkedFilters };
    if (checked) {
      // Object.keys(filters) &&
      //   Object.keys(filters).length > 0 &&
      //   Object.keys(filters).map((key, index) => );
      Object.keys(filter).forEach(function (k) {
        if (!checkedFilters.hasOwnProperty(k)) tmp[k] = [filter[k]];
        else {
          tmp[k].push(filter[k]);
        }
      });
    } else {
      Object.keys(filter).forEach(function (k) {
        if (tmp[k]) tmp[k] = tmp[k].filter((item) => item != filter[k]);

        if (tmp[k].length < 1) delete tmp[k];
      });
    }

    console.log("setCheckedFilters", tmp);
    setCheckedFilters(tmp);
  };

  const handleGetFilters = async (skus) => {
    const filters = skus.reduce((acc, cur, idx) => {
      const newAcc = { ...acc };
      for (let [key, val] of Object.entries(cur)) {
        if (!newAcc[key]) {
          delete newAcc[key];
        } else {
          newAcc[key] = `${newAcc[key]},${val}`;
          newAcc[key] = [
            ...new Set(
              newAcc[key].split(",").filter((element) => {
                return element && element.length > 0;
              })
            ),
          ];
        }
      }

      delete newAcc.id;
      delete newAcc.code;
      delete newAcc.name;
      delete newAcc.slug;
      delete newAcc.locale;

      return newAcc;
    });

    setFilters(filters);
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
    let tmpFilteredSkus = [...skus];

    if (Object.keys(checkedFilters).length > 0)
      Object.keys(checkedFilters).forEach(function (k) {
        tmpFilteredSkus = tmpFilteredSkus.filter((item) => {
          console.log(
            "checkedFilters[k].includes(item[k])",
            checkedFilters[k],
            item[k]
          );
          return checkedFilters[k].includes(item[k]);
        });
      });

    console.log(tmpFilteredSkus.length);

    switch (orderBy) {
      case "price-asc":
        return setFilteredSkus(
          tmpFilteredSkus.concat().sort((a, b) => {
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
          tmpFilteredSkus
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
          tmpFilteredSkus.concat().sort((a, b) => a.code.localeCompare(b.code))
        );
      case "code-desc":
        return setFilteredSkus(
          tmpFilteredSkus
            .concat()
            .sort((a, b) => a.code.localeCompare(b.code))
            .reverse()
        );
      case "name-asc":
        return setFilteredSkus(
          tmpFilteredSkus.concat().sort((a, b) => a.name.localeCompare(b.name))
        );

      case "name-desc":
        return setFilteredSkus(
          tmpFilteredSkus
            .concat()
            .sort((a, b) => a.name.localeCompare(b.name))
            .reverse()
        );
      default:
        return tmpFilteredSkus;
    }
  }

  useEffect(() => {
    orderProducts();
  }, [orderBy]);

  useEffect(() => {
    orderProducts();
  }, [checkedFilters]);

  useEffect(() => {
    console.log(222);
    handleGetFilters(skus);
  }, []);

  return (
    <Box>
      {filteredSkus && (
        <Grid columns={[1, "1fr 4fr"]}>
          <Box>
            <ProductOrder handleOrderChange={handleOrderChange} />
            <ProductFilters
              handleFiltersChange={handleFiltersChange}
              handleClearFilters={() => {
                setCheckedFilters([]);
              }}
              filters={filters}
            />
          </Box>
          <Box>
            <ProductCounter skus={filteredSkus} />
            {filteredSkus.length > 0 ? (
              filteredSkus.map((sku) => (
                <ProductThumb
                  sku={sku}
                  key={sku.id}
                  handleSkuLoaded={handleSkuLoaded}
                />
              ))
            ) : Object.keys(checkedFilters).length > 0 ? (
              <Text>Non ci sono risultati per i filtri selezionati</Text>
            ) : (
              <Text>Nessun risultato per questa ricerca</Text>
            )}
          </Box>
        </Grid>
      )}
    </Box>
  );
};

export default ProductCollection;
