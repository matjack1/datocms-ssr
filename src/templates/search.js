import React, { useEffect, useState, useContext, useRef } from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { getSearchPath } from "../utils/path";
import {
  Container,
  Text,
  Box,
  Grid,
  Flex,
  Heading,
} from "@theme-ui/components";
import { useClSdk } from "../hooks/useClSdk";
import { i18nContext } from "../hooks/i18nContext";
import { navigate } from "gatsby";
import CustomerContext from "../hooks/customerContext";
import { useBreakpointIndex } from "@theme-ui/match-media";
import getPrices from "../hooks/getPrices";
import CustomBreadcrumbs from "../components/customBreadcrumbs";
import ProductCounter from "../components/productCounter";
import ProductThumb from "../components/productThumb";
import ProductCollectionSkeleton from "../components/skeleton/productCollection";
import {
  InstantSearch,
  SortBy,
  ClearRefinements,
  connectInfiniteHits,
  connectStateResults,
  connectSearchBox,
  SearchBox,
  Configure,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import qs from "qs";

const searchClient = algoliasearch(
  "L90C68T5L3",
  "e09290f11a744650ef7bf8d0b72100d2"
);

function formatNumber(value) {
  return Number(value).toLocaleString();
}

const Results = connectStateResults(
  ({ searchState, searchResults, children }) =>
    searchResults &&
    searchResults.query.length > 0 &&
    searchResults.nbHits !== 0 ? (
      <Box>{children}</Box>
    ) : (
      searchResults &&
      searchResults.query.length > 0 && (
        <i18nContext.Consumer>
          {(t) => (
            <Box>
              <div>
                {t.noResults} <strong>{searchState.query}</strong>.
              </div>
            </Box>
          )}
        </i18nContext.Consumer>
      )
    )
);

const updateAfter = 700;

const InfiniteHits = ({
  locale,
  hits,
  hasPrevious,
  refinePrevious,
  hasMore,
  refineNext,
  categories = [],
}) => {
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
  const [queryURLParams, setQueryURLParams] = useState();

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
    let reduced = {};

    if (skusData && skusData.length > 0)
      reduced = skusData.reduce((acc, cur, idx) => {
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
        delete newAcc.images;

        return newAcc;
      });

    const filters = setFilters(reduced);
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
    const chunkSize = 8;
    const reducedData = hits.map((x) => x.code);

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
        hits.map((obj) => {
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
    console.log("ENTERS HITS");
    if (hits.length > 0 && cl && customer) {
      setSkusData(hits);
      getSkusPrices();
    }
  }, [hits, customer]);

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
            <CustomBreadcrumbs
              data={{
                pages: [
                  {
                    slug: "/",
                    title: "Home",
                  },
                ],
                current: {
                  title: "Cerca",
                },
              }}
            />
            <Flex
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: [2, 6],
                my: [4, 4],
              }}
            >
              <Heading as="h1" variant="h2" sx={{ color: "primary", my: [0] }}>
                {/* Risultati di ricerca per "{queryURLParams}" */}
                Risultati di ricerca
              </Heading>
              {filteredSkus && mediaIndex > 1 && (
                <ProductCounter skus={filteredSkus} />
              )}
            </Flex>
          </Container>
          <Container sx={{ px: [0, 0, 6, 6], pt: [0, 0, 0, 0] }}>
            <Grid columns={[1, 1, "1fr"]} gap={[0, 5]}>
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
                          key={sku.codd}
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
    // <Box sx={{ pb: [6, 8] }}>
    //   <Grid
    //     columns={[1, 2, 3, 4]}
    //     gap={["50px 8px", "50px 8px", "50px 8px", "50px 8px"]}
    //   >
    //     {hits.map((hit, index) => (
    //       <Box>index{console.log(index, hit)}</Box>
    //       // <VideoThumb
    //       //   search={true}
    //       //   video={{ ...hit, locale: locale }}
    //       //   category={hit.category}
    //       // />
    //     ))}
    //   </Grid>
    //   {hasMore && (
    //     <Flex sx={{ alignItems: "center", justifyContent: "center", py: [6] }}>
    //       <Box
    //         as="button"
    //         disabled={!hasMore}
    //         onClick={refineNext}
    //         variant="links.badge.full"
    //         sx={{
    //           cursor: "pointer",
    //         }}
    //       >
    //         Show more
    //       </Box>
    //     </Flex>
    //   )}
    // </Box>
  );
};

const CustomInfiniteHits = connectInfiniteHits(InfiniteHits);

const createURL = (state) => `?${qs.stringify(state)}`;

const searchStateToUrl = (searchState) =>
  searchState ? createURL(searchState) : "";

const urlToSearchState = ({ search }) => qs.parse(search.slice(1));
const DEBOUNCE_TIME = 400;

const SearchPage = ({
  location,
  history,
  data: { site, videos, channel },
  pageContext,
}) => {
  const isBrowser = typeof window !== "undefined";

  const [searchState, setSearchState] = useState(urlToSearchState(location));
  const debouncedSetStateRef = useRef(null);

  const i18nPaths = site.locales.map((locale) => {
    return {
      locale: locale,
      value: getSearchPath(locale),
    };
  });

  function onSearchStateChange(updatedSearchState) {
    clearTimeout(debouncedSetStateRef.current);

    debouncedSetStateRef.current = setTimeout(() => {
      navigate(searchStateToUrl(updatedSearchState));
    }, DEBOUNCE_TIME);

    setSearchState(updatedSearchState);
  }

  useEffect(() => {
    setSearchState(urlToSearchState(location));
  }, [location]);

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={`dev_SKUS`}
      searchState={searchState}
      onSearchStateChange={onSearchStateChange}
      createURL={createURL}
      resultsState={undefined}
      stalledSearchDelay={3000}
    >
      <Layout title={"search"}>
        <i18nContext.Consumer>
          {(t) => (
            <>
              <Results>
                <CustomInfiniteHits locale={pageContext.locale} />
              </Results>
            </>
          )}
        </i18nContext.Consumer>
      </Layout>
    </InstantSearch>
  );
};

export default SearchPage;

export const query = graphql`
  query SearchQuery {
    site: datoCmsSite {
      locales
    }
  }
`;
