import React, { useEffect, useState, useContext } from "react";
import { Box, Grid, Text, Button, Heading, Flex, Container } from "theme-ui";
import ProductCounter from "./productCounter";
import ProductOrder from "./productOrder";
import ProductFilters from "./productFilters";
import ProductThumb from "./productThumb";
import { useClSdk } from "../hooks/useClSdk";
import { MergeArrays } from "../utils/mergeArrays";
import CustomerContext from "../hooks/customerContext";
import getPrices from "../hooks/getPrices";
import { InboundLink } from "./link";
import { getCategoryPath } from "../utils/path";
import Breadcrumbs from "./breadcrumbs";
import ProductCollectionSkeleton from "../components/skeleton/productCollection";
import ProductCollectionCategories from "./productCollectionCategories";
import FilterSidebar from "./filterSidebar";
import { useResponsiveValue, useBreakpointIndex } from "@theme-ui/match-media";

const ProductCollection = ({ category, skus, categories }) => {
  const cl = useClSdk();
  const [skusData, setSkusData] = useState();
  const [filteredSkus, setFilteredSkus] = useState(null);
  const [orderBy, setOrderBy] = useState("code-asc");
  const [filters, setFilters] = useState({});
  const [checkedFilters, setCheckedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const [pricesPageCount, setPricesPageCount] = useState();
  const [currentPricesPage, setCurrentPricePage] = useState(1);
  const [recordCount, setRecordCount] = useState();
  const { customer, setCustomer } = useContext(CustomerContext);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const mediaIndex = useBreakpointIndex();

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
        delete newAcc.images

        return newAcc;
      });

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
    if (skus.length > 0 && cl && customer) {
      setSkusData(skus);
      getSkusPrices();
    }
  }, [skus, customer]);

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
            <Grid columns={[1,1, ".85fr 4.15fr"]} gap={[0,5]}>
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
              <Container sx={{ px: [3, 3, 0, 0], py:[0,0,0,0] }}>
                <Box>
                  {filteredSkus && filteredSkus.length > 0 ? (
                    <Grid
                      columns={["1fr", "1fr", "1fr 1fr", "1fr 1fr 1fr"]}
                      sx={{
                        columnGap: [4,3],
                        rowGap: [4,9],
                      }}
                    >
                      {filteredSkus.map((sku) => (
                        <ProductThumb horizontal={mediaIndex > 1 ? false : true} sku={sku} key={sku.id} />
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
