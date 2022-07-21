import React, { useEffect, useState } from "react";
import { Box, Grid, Text, Button } from "theme-ui";
import ProductCounter from "./productCounter";
import ProductOrder from "./productOrder";
import ProductFilters from "./productFilters";
import ProductThumb from "./productThumb";
import { useClSdk } from "../hooks/useClSdk";

const ProductCollection = ({ skus }) => {
  const cl = useClSdk();
  const [skusData, setSkusData] = useState();
  const [filteredSkus, setFilteredSkus] = useState(skusData);
  const [orderBy, setOrderBy] = useState("code-asc");
  const [filters, setFilters] = useState({});
  const [checkedFilters, setCheckedFilters] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const [recordCount, setRecordCount] = useState();

  const handleOrderChange = (e) => {
    setOrderBy(e.target.value);
  };

  const handleFiltersChange = (checked, filter) => {
    let tmp = { ...checkedFilters };
    if (checked) {
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

    setCheckedFilters(tmp);
  };

  const handleGetFilters = async () => {
    const filters =
      skusData &&
      skusData.length > 0 &&
      skusData.reduce((acc, cur, idx) => {
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
        delete newAcc.updated_at;
        delete newAcc.created_at;
        delete newAcc.do_not_track;
        delete newAcc.pieces_per_pack;
        delete newAcc.type;
        delete newAcc.metadata;
        delete newAcc.prices;
        delete newAcc.stock_items;

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
    let tmpFilteredSkus = [...skusData];

    if (Object.keys(checkedFilters).length > 0)
      Object.keys(checkedFilters).forEach(function (k) {
        tmpFilteredSkus = tmpFilteredSkus.filter((item) => {
          return checkedFilters[k].includes(item[k]);
        });
      });

    switch (orderBy) {
      case "price-asc":
        return setFilteredSkus(
          tmpFilteredSkus.concat().sort((a, b) => {
            const first =
              typeof a.prices !== "undefined" ? a.prices.amount_cents : 0;
            const second =
              typeof b.prices !== "undefined" ? b.prices.amount_cents : 0;
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

  const getClSku = async () => {
    const handleError = (e) => {
      console.log(e);
    };

    const skus_codes = skus.map((sku) => sku.code);
    const clSku = await cl.skus
      .list({
        filters: { code_in: skus_codes },
        include: ["prices", "stock_items"],
        pageSize: 20,
        pageNumber: currentPage,
      })
      .catch(handleError);

    if (clSku) {
      if (currentPage < clSku.meta.pageCount)
        setCurrentPage(clSku.meta.currentPage + 1);

      setPageCount(clSku.meta.pageCount);
      setRecordCount(clSku.meta.recordCount);

      var tmpclSku = [...clSku];
      if (skusData) tmpclSku = [...clSku, ...skusData];

      const mergedSku = mergeArrays(tmpclSku, skus);

      setSkusData(mergedSku);
    }
  };

  useEffect(() => {
    if (currentPage != 1 && currentPage <= pageCount) getClSku();
  }, [currentPage]);

  useEffect(() => {
    if (skus.length > 0) {
      getClSku();
    }
  }, [skus]);

  useEffect(() => {
    if (skusData && skusData.length > 0) {
      handleGetFilters();
      orderProducts();
    }
  }, [skusData]);

  useEffect(() => {
    if (skusData && skusData.length > 0) orderProducts();
  }, [orderBy]);

  useEffect(() => {
    if (skusData && skusData.length > 0) orderProducts();
  }, [checkedFilters]);

  return (
    <Box>
      {filteredSkus ? (
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
      ) : (
        <Box sx={{py:[5]}}> Non ci sono prodotti sotto questa categoria.</Box>
      )}
    </Box>
  );
};

const mergeArrays = (arr1 = [], arr2 = []) => {
  let res = [];
  res = arr1.map((obj) => {
    const index = arr2.findIndex((el) => el["code"] == obj["code"]);
    return {
      ...obj,
      ...arr2[index],
    };
  });
  return res;
};

export default ProductCollection;
