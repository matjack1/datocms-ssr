import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Grid, Heading, Flex, Text } from "theme-ui";
import CustomerContext from "../../../hooks/customerContext";
import { buildClient } from "@datocms/cma-client-browser";
import { useClSdk } from "../../../hooks/useClSdk";
import CustomerTokenContext from "../../../hooks/customerTokenContext";
import { navigate } from "gatsby";
import CustomBreadcrumbs from "../../customBreadcrumbs";
import FavouriteProduct from "../../favouriteProduct";
import getPrices from "../../../hooks/getPrices";
import FavouritesSkeleton from "../../skeleton/favourites";
import NoPref from "../../../assets/img/icons/no-ordini.inline.svg";

const CustomerFavourites = () => {
  const cl = useClSdk();
  const client = buildClient({ apiToken: "7f672cb51a4f9c2dce0c59b466b8c6" });
  const { customer, setCustomer } = useContext(CustomerContext);
  const [skus, setSkus] = useState([]);
  const [skusPrices, setSkusPrices] = useState(null);
  const [pricedSkusData, setPricedSkusData] = useState(null);

  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);

  console.log("enters");

  const handleGetSkus = async () => {
    let records = [];

    if (customer.metadata.favourites.length > 0) {
      records = await client.items.list({
        filter: {
          type: "313716",
          fields: {
            code: {
              in: customer.metadata.favourites,
            },
          },
        },
      });

      records.sort(function (a, b) {
        return (
          customer.metadata.favourites.indexOf(a.code) -
          customer.metadata.favourites.indexOf(b.code)
        );
      });
    }

    setSkus(records);
  };

  const handleDeleteFavourite = async (sku) => {
    console.log("called");
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    let favourites = customer.metadata.favourites;

    favourites = favourites.filter((e) => e !== sku.code);

    const updatedCustomer = await cl.customers
      .update({
        id: customerToken.owner_id,
        metadata: {
          ...customer.metadata,
          favourites: favourites,
        },
      })
      .catch(handleError);

    if (updatedCustomer) {
      const retrievedCustomer = await cl.customers
        .retrieve(customerToken.owner_id, {
          include: ["orders", "orders.shipping_address"],
        })
        .catch(handleError);

      setCustomer(retrievedCustomer);
    }
  };

  const getSkusPrices = async () => {
    let chunkPrices = [];
    let allChunks = [];
    let res = [];

    if (skus) {
      const skusTmp = JSON.parse(JSON.stringify(skus));
      const chunkSize = 4;
      const reducedData = skusTmp.map((x) => x.code);

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

        res = await Promise.all(
          skusTmp.map((obj) => {
            const index = chunkPrices.findIndex(
              (el) => el["itemcode"] == obj["code"]
            );

            console.log("chunkPrices", chunkPrices);
            if (chunkPrices[index]) {
              return {
                code: obj["code"],
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

        setSkusPrices(res);
      }
    }
  };

  const handleMergePrices = async () => {
    const skusTmp = JSON.parse(JSON.stringify(skus));
    const res = await Promise.all(
      skusTmp.map((obj) => {
        const index = skusPrices.findIndex((el) => el["code"] == obj["code"]);
        if (skusPrices[index] && skusPrices[index].prices) {
          let prices = skusPrices[index].prices;
          return {
            ...obj,
            prices: {
              discount: prices.discount,
              discountedPrice: prices.discountedPrice,
              price: prices.price,
            },
          };
        }
        return obj;
      })
    );
    console.log("res", res);
    setTimeout(() => {
      setPricedSkusData(res);
    }, 300);
  };

  useEffect(() => {
    getSkusPrices();
    setTimeout(() => {
      setPricedSkusData(skus);
    }, 300);
  }, [skus]);

  useEffect(() => {
    handleMergePrices();
  }, [skusPrices]);

  useEffect(() => {
    if (customer && customer.metadata && customer.metadata.favourites)
      handleGetSkus();
  }, [customer]);

  return (
    <Box>
      <Container>
        {pricedSkusData && pricedSkusData.length > 0 ? (
          <>
            <CustomBreadcrumbs
              data={{
                pages: [
                  {
                    slug: "/",
                    title: "Home",
                  },
                ],
                current: {
                  title: "Preferiti",
                },
              }}
            />
            <Box sx={{ pb: [8] }}>
              <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
                Preferiti
              </Heading>
            </Box>

            <Grid columns={["1fr", "1fr", ".7fr .3fr"]} gap={[0, 0, 12]}>
              <Box>
                <Box>
                  <Box>
                    <Grid sx={{ gridTemplateRows: "auto" }} gap={[6, 8]}>
                      {console.log(pricedSkusData[0].prices)}
                      {pricedSkusData.map((sku) => (
                        <Box>
                          <FavouriteProduct
                            sku={sku}
                            handleDeleteFavourite={() =>
                              handleDeleteFavourite(sku)
                            }
                          />
                        </Box>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Box>
              <Box></Box>
            </Grid>
          </>
        ) : pricedSkusData != null && pricedSkusData.length < 1 ? (
          <Box sx={{}}>
            <>
              <CustomBreadcrumbs
                data={{
                  pages: [
                    {
                      slug: "/",
                      title: "Home",
                    },
                  ],
                  current: {
                    title: "Preferiti",
                  },
                }}
              />
              <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
                Preferiti
              </Heading>
              <Flex
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid",
                  color: "lightBorder",
                  svg: {
                    color: "lightBorder",
                  },
                  borderColor: "lightBorder",
                  p: [14],
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    pb: [7],
                    svg: {
                      width: "92px",
                      height: "auto",
                      "*": {
                        stroke: "lightBorder",
                      },
                    },
                  }}
                >
                  <NoPref />
                </Box>
                <Box>
                  <Text sx={{ fontSize: [7] }}>
                    La lista dei preferiti è vuota
                  </Text>
                </Box>
              </Flex>
            </>
          </Box>
        ) : (
          <FavouritesSkeleton />
        )}
      </Container>
    </Box>
  );
};

export default CustomerFavourites;
