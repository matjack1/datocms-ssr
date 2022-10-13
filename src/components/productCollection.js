import React, { useEffect, useState, useContext } from "react";
import { Box, Grid, Text, Heading, Flex, Container } from "theme-ui";
import ProductCounter from "./productCounter";
import ProductOrder from "./productOrder";
import ProductFilters from "./productFilters";
import ProductThumb from "./productThumb";
import { useClSdk } from "../hooks/useClSdk";
import CustomerContext from "../hooks/customerContext";
import getPrices from "../hooks/getPrices";
import Breadcrumbs from "./breadcrumbs";
import ProductCollectionSkeleton from "../components/skeleton/productCollection";
import ProductCollectionCategories from "./productCollectionCategories";
import FilterSidebar from "./filterSidebar";
import { useBreakpointIndex } from "@theme-ui/match-media";

const ProductCollection = ({ category, skus, categories }) => {
  const cl = useClSdk();
  const [skusData, setSkusData] = useState();
  const [filteredSkus, setFilteredSkus] = useState(null);
  const [orderBy, setOrderBy] = useState("ranking");
  const [filters, setFilters] = useState({});
  const [checkedFilters, setCheckedFilters] = useState({});
  const { customer, setCustomer } = useContext(CustomerContext);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const mediaIndex = useBreakpointIndex();
  const [pricesPage, setPricesPage] = useState(0);

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
      skusData.reduce((r, o) => {
        Object.entries(o).forEach(([k, v]) => {
          if (v && v.length > 0) {
            r[k] = r[k] || [];
            if (!r[k].includes(v)) r[k].push(v);

            return r[k];
          }
        });
        if (r) return r;
      }, Object.create(null));

    delete filters.id;
    delete filters.code;
    delete filters.name;
    delete filters.slug;
    delete filters.locale;
    delete filters.updated_at;
    delete filters.created_at;
    delete filters.do_not_track;
    delete filters.pieces_per_pack;
    delete filters.type;
    delete filters.metadata;
    delete filters.prices;
    delete filters.stock_items;
    delete filters.images;
    delete filters.pack;
    delete filters.pallet;

    for (let [key, val] of Object.entries(filters)) {
      console.log("key", key);
      if (key != "size")
        filters[key].sort(function (a, b) {
          return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        });
      else {
        const sizes = {
          "UNICA" : 100,
          "XS" : 200,
          "S" : 300,
          "M" : 400,
          "L" : 500,
          "XL" : 600,
          "XXL" : 700,
        };
        filters[key].sort((a, b) => sizes[a] - sizes[b]);
      }
    }

    // const filters =
    //   skusData &&
    //   skusData.length > 0 &&
    //   skusData.reduce((acc, cur, idx) => {
    //     const newAcc = [acc, cur];

    //     console.log(newAcc);

    //     // for (let [key, val] of Object.entries(cur)) {
    //     //   if (
    //     //     (!newAcc[key] && !cur[key]) ||
    //     //     (newAcc[key] &&
    //     //       newAcc[key].length < 0 &&
    //     //       cur[key] &&
    //     //       cur[key].length < 0)
    //     //   ) {
    //     //     delete newAcc[key];
    //     //   } else {
    //     //     newAcc[key] = `${newAcc[key]},${val}`;
    //     //     newAcc[key] = [
    //     //       ...new Set(
    //     //         newAcc[key].split(",").filter((element) => {
    //     //           return element && element.length > 0;
    //     //         })
    //     //       ),
    //     //     ];
    //     //     newAcc[key] = newAcc[key].sort(function (a, b) {
    //     //       return a.localeCompare(b, undefined, {
    //     //         numeric: true,
    //     //         sensitivity: "base",
    //     //       });
    //     //     });
    //     //   }
    //     // }

    //     // newAcc[key] = newAcc[key].sort(function(a, b) {
    //     //   return a.localeCompare(b, undefined, {
    //     //     numeric: true,
    //     //     sensitivity: 'base'
    //     //   });
    //     // });

    //     delete newAcc.id;
    //     delete newAcc.code;
    //     delete newAcc.name;
    //     delete newAcc.slug;
    //     delete newAcc.locale;
    //     delete newAcc.updated_at;
    //     delete newAcc.created_at;
    //     delete newAcc.do_not_track;
    //     delete newAcc.pieces_per_pack;
    //     delete newAcc.type;
    //     delete newAcc.metadata;
    //     delete newAcc.prices;
    //     delete newAcc.stock_items;
    //     delete newAcc.images;

    //     return newAcc;
    //   });
    setFilters(filters);
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
              a.prices && a.prices.length > 0 ? a.prices[0].amount_cents : 0;
            const second =
              b.prices && b.prices.length > 0 ? b.prices[0].amount_cents : 0;

            return first - second;
          })
        );
      case "price-desc":
        return setFilteredSkus(
          tmpFilteredSkus
            .concat()
            .sort((a, b) => {
              const first =
                a.prices && a.prices.length > 0 ? a.prices[0].amount_cents : 0;
              const second =
                b.prices && b.prices.length > 0 ? b.prices[0].amount_cents : 0;

              return first - second;
            })
            .reverse()
        );
      case "ranking":
        return setFilteredSkus(
          tmpFilteredSkus.concat().sort(function (a, b) {
            return (
              (a.ranking === null) - (b.ranking === null) ||
              +(a.ranking > b.ranking) ||
              -(a.ranking < b.ranking)
            );
          })
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
    if (skus.length > 0 && cl && customer) {
      setSkusData(skus);
      if (pricesPage === 0) getSkusPrices(pricesPage);
    }
  }, [skus, customer]);

  useEffect(() => {
    if (skus.length > 0 && cl && customer) {
      getSkusPrices(pricesPage);
    }
  }, [pricesPage]);

  useEffect(() => {
    if (skusData && skusData.length > 0) {
      handleGetFilters();
      orderProducts();
    } else {
      setFilteredSkus([]);
    }
  }, [skusData]);

  useEffect(() => {
    if (skusData && skusData.length > 0) orderProducts();
  }, [orderBy]);

  useEffect(() => {
    if (skusData && skusData.length > 0) orderProducts();
  }, [checkedFilters]);

  useEffect(() => {
    if (filteredSkus != null) {
      setTimeout(() => {
        setShowSkeleton(false);
      }, 300);
    }
  }, [filteredSkus]);

  return (
    <Box>
      {!showSkeleton ? (
        <>
          <Container>
            <Breadcrumbs page={category} />
            <Flex
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Heading
                as="h1"
                variant="h2"
                sx={{ color: "primary", mb: [2, 6] }}
              >
                {category.name}
              </Heading>
              {filteredSkus && mediaIndex > 1 && (
                <ProductCounter skus={filteredSkus} />
              )}
            </Flex>
          </Container>
          <Container sx={{ px: [0, 0, 6, 6], pt: [0, 0, 0, 0] }}>
            <Grid columns={[1, 1, ".85fr 4.15fr"]} gap={[0, 5]}>
              <Box>
                <ProductCollectionCategories categories={categories} />

                {mediaIndex > 1 ? (
                  <>
                    <ProductOrder handleOrderChange={handleOrderChange} />
                    <ProductFilters
                      categories={categories}
                      handleFiltersChange={handleFiltersChange}
                      handleClearFilters={() => {
                        setCheckedFilters([]);
                      }}
                      filters={filters}
                    />
                  </>
                ) : (
                  <>
                    {filteredSkus && (
                      <FilterSidebar skus={filteredSkus}>
                        <ProductOrder handleOrderChange={handleOrderChange} />
                        <ProductFilters
                          categories={categories}
                          handleFiltersChange={handleFiltersChange}
                          handleClearFilters={() => {
                            setCheckedFilters([]);
                          }}
                          filters={filters}
                        />
                      </FilterSidebar>
                    )}
                  </>
                )}
              </Box>
              <Container sx={{ px: [3, 3, 0, 0], py: [0, 0, 0, 0] }}>
                <Box>
                  {filteredSkus && filteredSkus.length > 0 ? (
                    <Grid
                      columns={["1fr", "1fr", "1fr 1fr", "1fr 1fr 1fr"]}
                      sx={{
                        columnGap: [4, 3],
                        rowGap: [4, 9],
                      }}
                    >
                      {filteredSkus.map((sku) => (
                        <ProductThumb
                          horizontal={mediaIndex > 1 ? false : true}
                          sku={sku}
                          key={sku.id}
                        />
                      ))}
                    </Grid>
                  ) : Object.keys(checkedFilters).length > 0 ? (
                    <Text>Non ci sono risultati per i filtri selezionati</Text>
                  ) : (
                    filteredSkus &&
                    filteredSkus.length < 1 && (
                      <Text>Nessun articolo trovato</Text>
                    )
                  )}
                </Box>
              </Container>
            </Grid>
          </Container>
        </>
      ) : (
        showSkeleton && (
          <Container>
            <ProductCollectionSkeleton />
          </Container>
        )
      )}
    </Box>
  );
};

export default ProductCollection;
