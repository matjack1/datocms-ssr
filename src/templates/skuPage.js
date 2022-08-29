import React, { useEffect, useState, useContext } from "react";
import { graphql } from "gatsby";
import { Box, Heading, Text, Button, Container, Grid, Flex } from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import Nav from "../components/nav";
import AddToCart from "../components/addToCart";
import LineItemQuantity from "../components/lineItemQuantity";
import SkuQuantity from "../components/skuQuantity";
import Breadcumbs from "../components/breadcrumbs";
import CustomerContext from "../hooks/customerContext";
import CustomerTokenContext from "../hooks/customerTokenContext";
import Layout from "../components/layout";
import { GatsbyImage } from "gatsby-plugin-image";
import { GrDocumentPdf } from "react-icons/gr";
import { OutboundLink } from "../components/link";
import { GoPackage } from "react-icons/go";
import { TbTruckDelivery } from "react-icons/tb";
import RelatedProducts from "../components/relatedProducts";
import { navigate } from "gatsby";
import getPrices from "../hooks/getPrices";

const SkuPage = ({ data: { sku, skus } }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const [pricedClSkuDetails, setPricedClSkuDetails] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(sku.minimum);
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  const [isFavourie, setIsFavourite] = useState(null);
  const [relatedSkus, setRelatedSkus] = useState(null);

  const cl = useClSdk();

  const updateCustomerRecentlyViewed = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    let recentlyViewed = customer.metadata.recentlyViewed
      ? [...customer.metadata.recentlyViewed]
      : [];

    recentlyViewed = [...new Set(recentlyViewed)];

    if (recentlyViewed.length > 9) recentlyViewed.pop();

    if (!recentlyViewed.find((e) => e === sku.code))
      recentlyViewed = [sku.code].concat(recentlyViewed);

    const updatedCustomer = await cl.customers
      .update({
        id: customerToken.owner_id,
        metadata: {
          ...customer.metadata,
          recentlyViewed: recentlyViewed,
        },
      })
      .catch(handleError);
  };

  const updateCustomerFavourites = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    let favourites = customer.metadata.favourites
      ? [...customer.metadata.favourites]
      : [];

    if (!isFavourie)
      if (!favourites.find((e) => e === sku.code))
        favourites = [sku.code].concat(favourites);
      else favourites = favourites.filter((e) => e !== sku.code);

    setIsFavourite(!isFavourie);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    const updatedCustomer = await cl.customers
      .update({
        id: customerToken.owner_id,
        metadata: {
          ...customer.metadata,
          favourites: favourites,
        },
      })
      .catch(handleError);
  };

  const getClSku = async () => {
    const handleError = (e) => {
      console.log(e);
    };
    const clSku = await cl.skus
      .list({
        filters: { code_eq: sku.code },
        include: [ "stock_items"],
      })
      .catch(handleError);

    setClSkuDetails(clSku[0]);

    const prices = await getPrices({
      iduser: customer.reference,
      items: [sku.code],
    });

    const foundPrices = prices && prices.items.length > 0 && prices.items[0];

    if (clSku && clSku[0] && foundPrices)
      setClSkuDetails({
        ...clSku[0],
        prices: {
          discount: foundPrices.discount,
          discountedPrice: foundPrices.discountedPrice,
          price: foundPrices.price,
        },
      });
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  const updateQuantity = (quantity) => {
    console.log(quantity);
    setCurrentQuantity(quantity);
  };

  useEffect(() => {
    if (customer && customerToken) updateCustomerRecentlyViewed();
    if (cl && customer) {
      getClSku();
    }
  }, [customer]);

  useEffect(() => {
    if (isFavourie === null) {
      let findSku = JSON.parse(localStorage.getItem("favourites")).filter(
        (e) => e === sku.code
      );

      setIsFavourite(findSku[0] === true);
    }
  }, []);

  useEffect(() => {
    if (clSkuDetails && clSkuDetails.prices && !relatedSkus)
      setRelatedSkus(skus.nodes.filter((e) => e.code != sku.code));
  }, [clSkuDetails]);

  return (
    <Layout>
      <Container>
        <Box sx={{ pb: [4] }}>
          <Breadcumbs page={sku} />
        </Box>

        <Grid columns={["minmax(auto,672px) minmax(auto, 469px)"]} gap={[11]}>
          <Box
            sx={{
              aspectRatio: "1",
            }}
          >
            <Box
              sx={{
                border: "1px solid",
                borderColor: "dark",
                width: "100%",
                height: "100%",
                mb: [12],
              }}
            >
              {sku.images && sku.images.length > 0 ? (
                <GatsbyImage
                  image={sku.images[0].gatsbyImageData}
                  alt={sku.images[0].gatsbyImageData}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: "light",
                  }}
                />
              )}
            </Box>
            <Box>
              <Box>
                <Box>
                  <GrDocumentPdf size={26} />
                </Box>
                <Box>
                  <Heading
                    as="h2"
                    variant="h6"
                    sx={{ fontSize: [2], my: [3], fontWeight: "600" }}
                  >
                    Documenti Tecnici
                  </Heading>
                  {sku.documents.map((document) => (
                    <Box sx={{ pb: [2] }}>
                      <OutboundLink
                        sx={{ color: "lightBorder" }}
                        href={document.url}
                      >
                        {document.title}
                      </OutboundLink>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box
                sx={{
                  borderBottom: "1px solid",
                  mb: [5],
                  pt: [5],
                  borderColor: "lightBorder",
                }}
              />
              <Box>
                <Box>
                  <GoPackage size={26} />
                </Box>
                <Box>
                  <Heading
                    as="h2"
                    variant="h6"
                    sx={{ fontSize: [2], my: [3], fontWeight: "600" }}
                  >
                    Confezionamento
                  </Heading>
                  {sku.pallet}
                </Box>
              </Box>

              <Box
                sx={{
                  borderBottom: "1px solid",
                  mb: [5],
                  pt: [5],
                  borderColor: "lightBorder",
                }}
              />
            </Box>

            <Box>
              <Box>
                <TbTruckDelivery size={26} />
              </Box>
              <Box>
                <Heading
                  as="h2"
                  variant="h6"
                  sx={{ fontSize: [2], my: [3], fontWeight: "600" }}
                >
                  1-3 giorni lavorativi
                </Heading>
                <Box sx={{ pb: [3] }}>
                  <Text color="lightBorder">
                    Consegna rapida gratuita per ordini superiori a 250€ <br />
                  </Text>
                </Box>
                <Box>
                  <Text color="lightBorder" sx={{ fontSize: [1] }}>
                    Spedizione calcolata durante il checkout
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{}}>
            <Box sx={{ pb: [11] }}>
              <Heading
                as="h1"
                variant="h2"
                sx={{
                  color: "dark",
                  fontWeight: "400",
                  my: [0],
                  fontSize: ["28px"],
                }}
              >
                {sku.name}
              </Heading>
            </Box>
            <Box>
              {clSkuDetails && (
                <Flex
                  sx={{
                    alignItems: "center",
                    pb: [6],
                  }}
                >
                  <Text as="span" sx={{ fontWeight: "600", fontSize: [3] }}>
                    {clSkuDetails && clSkuDetails.prices
                      ? clSkuDetails.prices.discountedPrice
                        ? "€" +
                          clSkuDetails.prices.discountedPrice.toLocaleString(
                            "it-IT",
                            { minimumFractionDigits: 2 }
                          )
                        : "€" +
                          clSkuDetails.prices.price.toLocaleString("it-IT", {
                            minimumFractionDigits: 2,
                          })
                      : "Caricamento del prezzo"}
                  </Text>
                  <Text sx={{ pl: [2], fontSize: [1], color: "lightBorder" }}>
                    Prezzo per unità / Tasse escluse
                  </Text>
                </Flex>
              )}
            </Box>
            <Box sx={{ pb: [9] }}>
              <SkuQuantity
                sku={sku}
                quantity={currentQuantity}
                updateQuantity={updateQuantity}
              />
            </Box>
            <Flex
              sx={{
                mb: [12],
                alignItems: "center",
                minHeight: "60px",
                height: "60px",
              }}
            >
              <Box sx={{ width: "100%", height: "100%" }}>
                <AddToCart sku={clSkuDetails} quantity={currentQuantity} />
              </Box>
              <Box sx={{ height: "100%", ml: [2] }}>
                <Button
                  onClick={updateCustomerFavourites}
                  sx={{
                    flex: 1,
                    cursor: "pointer",
                    borderRadius: "unset",
                    height: "100%",
                    p: [3],
                    height: "100%",
                    backgroundColor: isFavourie ? "primary" : "light",
                    border: "1px solid",
                    borderColor: !isFavourie ? "primary" : "transparent",
                    svg: {
                      color: isFavourie ? "light" : "primary",
                      width: "20px",
                      height: "20px",
                    },
                  }}
                >
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
                    }}
                  />
                </Button>
              </Box>
            </Flex>
            <Box
              sx={{ border: "1px solid", borderColor: "lightBorder", p: [4] }}
            >
              <Box sx={{ pb: [4] }}>
                <Text sx={{ fontWeight: "600" }}>Dettagli prodotto</Text>
              </Box>
              <Box
                as="table"
                sx={{
                  tr: {
                    p: [0],
                    "td:first-child": {
                      textAlign: "left",
                      verticalAlign: "middle",
                      color: "lightBorder",
                    },
                    td: {
                      fontSize: [2],
                      fontWeight: "400",
                      pb: [3],
                    },
                  },
                }}
              >
                {sku.code && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>Codice</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.code}</Box>
                    </Box>
                  </Box>
                )}

                {sku.size && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>Dimensione</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.size}</Box>
                    </Box>
                  </Box>
                )}

                {sku.gloveType && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>Tipo di guanto</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.gloveType}</Box>
                    </Box>
                  </Box>
                )}

                {sku.packaging && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>Imballaggio</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.packaging}</Box>
                    </Box>
                  </Box>
                )}

                {sku.ecolabel && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>Etichetta ecologica</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.ecolabel}</Box>
                    </Box>
                  </Box>
                )}

                {sku.biodegradable && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>Biodegradabile</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.biodegradable}</Box>
                    </Box>
                  </Box>
                )}

                {sku.sanitizer && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>Sanificatore</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.sanitizer}</Box>
                    </Box>
                  </Box>
                )}

                {sku.haccp && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>HACCP</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.haccp}</Box>
                    </Box>
                  </Box>
                )}

                {sku.detergentType && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>Tipo di detergente</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.detergentType}</Box>
                    </Box>
                  </Box>
                )}

                {sku.detergentUsage && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>Uso del detergente</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>{sku.detergentUsage}</Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Container>
      {relatedSkus && relatedSkus.length > 0 && (
        <RelatedProducts
          sku={sku}
          skus={relatedSkus.slice(
            0,
            skus.nodes.length > 8 ? 8 : skus.nodes.length
          )}
          customer={customer}
        />
      )}
    </Layout>
  );
};

export default SkuPage;

export const query = graphql`
  query SkuPageQuery($id: String!, $categoryId: [String]) {
    sku: datoCmsSku(id: { eq: $id }) {
      ...SkuDetails
    }
    skus: allDatoCmsSku(
      limit: 20
      filter: { category: { id: { in: $categoryId } } }
      sort: { fields: code, order: ASC }
    ) {
      nodes {
        ...SkuDetails
      }
    }
  }

  fragment SkuDetails on DatoCmsSku {
    id
    name
    code
    slug
    minimum
    multiple
    size
    gloveType
    pallet
    packaging
    ecolabel
    biodegradable
    sanitizer
    haccp
    detergentType
    detergentUsage
    documents {
      url
      title
    }
    model {
      apiKey
    }
    locale
    category {
      id
      name
      locale
      slug
      treeParent {
        id
        name
        slug
        root
        locale
        treeParent {
          id
          name
          slug
          root
          locale
        }
      }
    }
  }
`;
