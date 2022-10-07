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
import SearchSkeleton from "../components/skeleton/search";
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
  ({ searchState, searchResults, children }) => {
    return searchResults &&
      searchResults.query.length > 0 &&
      searchResults.nbHits !== 0 ? (
      <>
        <Box>{children}</Box>
      </>
    ) : (
      searchResults && searchResults.query.length > 0 && (
        <i18nContext.Consumer>
          {(t) => (
            <Box>
              <Container>
                {t.noResults} per <strong>{searchState.query}</strong>.
              </Container>
            </Box>
          )}
        </i18nContext.Consumer>
      )
    );
  }
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
  const { customer, setCustomer } = useContext(CustomerContext);
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
  const [showSkeleton, setShowSkeleton] = useState(true);
  const mediaIndex = useBreakpointIndex();
  const [queryURLParams, setQueryURLParams] = useState();
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
        delete newAcc.pack;
        delete newAcc.pallet;

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

  const getSkusPrices = async (pricesPage) => {
    let i = pricesPage;
    let chunkPrices = [];
    let allChunks = [];

    const data = pricesPage != 0 && skusData ? JSON.parse(JSON.stringify(skusData)) : hits;
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

    let res = [];
    res = await Promise.all(
      data.map((obj) => {
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

    if (pricesPage < allChunks.length - 1) {
      console.log(
        "pricesPage < allChunks.length - 1",
        pricesPage,
        allChunks.length - 1
      );
      setPricesPage(pricesPage + 1);
    }
  };

  const getDifference = (array1, array2) => {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1.code === object2.code;
      });
    });
  };

  useEffect(() => {
    if (skusData != null) {
      setTimeout(() => {
        setShowSkeleton(false);
      }, 300);
    } else if (skusData && pricesPage === 0) getSkusPrices();
  }, [skusData]);

  useEffect(() => {
    if (hits.length > 0 && cl && customer) {
      getSkusPrices(pricesPage);
    }
  }, [pricesPage]);

  useEffect(() => {
    if (
      hits.length > 0 &&
      cl &&
      customer &&
      (!skusData || getDifference(hits, skusData).length > 0)
    ) {
      setSkusData(hits);
    }
  }, [hits, cl, customer]);

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
              {skusData && mediaIndex > 1 && <ProductCounter skus={skusData} />}
            </Flex>
          </Container>
          <Container sx={{ px: [0, 0, 6, 6], pt: [0, 0, 0, 0] }}>
            <Grid columns={[1, 1, "1fr"]} gap={[0, 5]}>
              <Container sx={{ px: [3, 3, 0, 0], py: [0, 0, 0, 0] }}>
                <Box>
                  {skusData && skusData.length > 0 ? (
                    <Grid
                      columns={["1fr", "1fr", "1fr 1fr", "1fr 1fr 1fr"]}
                      sx={{
                        columnGap: [4, 3],
                        rowGap: [4, 9],
                      }}
                    >
                      {skusData.map((sku) => (
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
                    skusData &&
                    skusData.length < 1 && <Text>Nessun articolo trovato</Text>
                  )}
                </Box>
              </Container>
            </Grid>
          </Container>
        </>
      ) : (
        showSkeleton && (
          <Container>
            <SearchSkeleton />
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

const SearchPage = ({
  location,
  history,
  data: { site, videos, channel },
  pageContext,
}) => {
  const urlToSearchState = ({ search }) => qs.parse(search.slice(1));
  const [searchState, setSearchState] = useState(urlToSearchState(location));

  const DEBOUNCE_TIME = 400;
  const createURL = (state) => `?${qs.stringify(state)}`;

  const searchStateToUrl = (searchState) =>
    searchState ? createURL(searchState) : "";

  const isBrowser = typeof window !== "undefined";
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
    <Box>
      {console.log(searchClient, searchState, pageContext.locale)}
      <InstantSearch
        searchClient={searchClient}
        indexName={`dev_SKUS`}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createURL={createURL}
        resultsState={undefined}
      >
        <Layout title={"search"}>
          <Results>
            <CustomInfiniteHits locale={pageContext.locale} />
          </Results>
        </Layout>
      </InstantSearch>
    </Box>
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
