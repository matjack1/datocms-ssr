import React, { useEffect, useState, useContext } from "react";
import { graphql } from "gatsby";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  Grid,
  Flex,
  Image,
} from "theme-ui";
import { useClSdk } from "../hooks/useClSdk";
import AddToCart from "../components/addToCart";
import SkuQuantity from "../components/skuQuantity";
import Breadcumbs from "../components/breadcrumbs";
import CustomerContext from "../hooks/customerContext";
import CustomerTokenContext from "../hooks/customerTokenContext";
import Layout from "../components/layout";
import { GatsbyImage } from "gatsby-plugin-image";
import { OutboundLink } from "../components/link";
import { Helmet } from "react-helmet";
import PdfIcon from "../assets/img/icons/documenti-tecnici.inline.svg";
import Package from "../assets/img/icons/confezionamento.inline.svg";
import DeliveryIcon from "../assets/img/icons/corriere-sede.inline.svg";
import RelatedProducts from "../components/relatedProducts";
import { navigate } from "gatsby";
import getPrices from "../hooks/getPrices";
import FavouritIcon from "../assets/img/icons/preferiti.inline.svg";
import PlaceholderImage from "../assets/img/placeholder-image.png";
import { toast } from "react-toastify";
import ThumbProductDetails from "../components/thumbProductDetails";
import SkuPageSkeleton from "../components/skeleton/skuPage";
import BouncingDotsLoader from "../components/bouncingDotsLoader";
import { useBreakpointIndex } from "@theme-ui/match-media";
import FilterMetaTagDescription from "../utils/filterMetaTagDescription";

const SkuPage = ({ data: { sku, skus } }) => {
  const [clSkuDetails, setClSkuDetails] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(sku.minimum);
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  const [isFavourie, setIsFavourite] = useState(null);
  const [relatedSkus, setRelatedSkus] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

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

    if (updatedCustomer)
      toast.success(
        !isFavourie
          ? "Articolo aggiunto ai preferiti"
          : "Articolo rimosso dai preferiti",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        }
      );
  };

  const getClSku = async () => {
    const handleError = (e) => {
      console.log(e);
    };
    const clSku = await cl.skus
      .list({
        filters: { code_eq: sku.code },
        include: ["stock_items"],
      })
      .catch(handleError);

    setClSkuDetails({ ...sku, ...clSku[0] });

    const prices = await getPrices({
      iduser: customer.reference,
      items: [sku.code],
    });

    const foundPrices =
      prices && prices.items && prices.items.length > 0
        ? prices.items[0]
        : { error: "no_price" };

    if (clSku && clSku[0])
      setClSkuDetails({
        ...sku,
        ...clSku[0],
        prices: foundPrices,
      });

    console.log("22", {
      ...sku,
      ...clSku[0],
      prices: foundPrices,
    });
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
    if (isFavourie === null && localStorage.getItem("favourites")) {
      let findSku = JSON.parse(localStorage.getItem("favourites")).filter(
        (e) => e === sku.code
      );
      console.log("findSku", findSku);
      setIsFavourite(findSku[0] && true);
    }
  }, []);

  useEffect(() => {
    if (clSkuDetails && !relatedSkus)
      setRelatedSkus(skus.nodes.filter((e) => e.code != sku.code));
  }, [clSkuDetails]);

  useEffect(() => {
    setTimeout(() => {
      setShowSkeleton(false);
    }, 300);
  }, [sku]);

  return (
    <Layout>
      <Helmet>
        <title>{sku && sku.name ? sku.name : "Prodotto"} | Socaf</title>
      </Helmet>
      <Container>
        {!showSkeleton ? (
          <>
            <Box sx={{ pb: [4] }}>
              <Breadcumbs page={sku} />
            </Box>
            <Grid
              columns={["1fr", "1fr", "minmax(auto,672px) minmax(auto, 469px)"]}
              gap={[4, 4, 11]}
            >
              <Box
                sx={{
                  aspectRatio: "1",
                  "@supports not (aspect-ratio: 1 / 1)": {
                    "&::before": {
                      cssFloat: "left",
                      paddingTop: "100%",
                      content: '""',
                    },
                    "&::after": {
                      display: "block",
                      content: '""',
                      clear: "both",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    border: "1px solid",
                    borderColor: "dark",
                    width: "100%",
                    height: "100%",
                    mb: [4, 5, 12],
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
                        height: "100%",
                        img: {
                          height: "100%",
                          objectFit: "contain",
                        },
                        backgroundColor: "light",
                      }}
                    >
                      <Image src={PlaceholderImage} />
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: ["block", "block", "none", "none"] }}>
                  <SideSku
                    sku={sku}
                    clSkuDetails={clSkuDetails}
                    currentQuantity={currentQuantity}
                    updateQuantity={updateQuantity}
                    updateCustomerFavourites={updateCustomerFavourites}
                    isFavourie={isFavourie}
                  />
                </Box>

                <Box>
                  {sku.documents.length > 0 && (
                    <>
                      <Box>
                        <Box
                          sx={{
                            svg: {
                              width: "26px",
                              height: "auto",
                            },
                          }}
                        >
                          <PdfIcon />
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
                          mb: [4, 5],
                          pt: [4, 5],
                          borderColor: "lightBorder",
                        }}
                      />
                    </>
                  )}

                  {sku.pack && (
                    <>
                      <Box>
                        <Box
                          sx={{
                            svg: {
                              width: "26px",
                              height: "auto",
                            },
                          }}
                        >
                          <Package />
                        </Box>
                        <Box>
                          <Heading
                            as="h2"
                            variant="h6"
                            sx={{ fontSize: [2], my: [3], fontWeight: "600" }}
                          >
                            Confezione
                          </Heading>
                          {sku.pack}
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
                    </>
                  )}
                </Box>

                <Box>
                  <Box
                    sx={{
                      svg: {
                        width: "26px",
                        height: "auto",
                      },
                    }}
                  >
                    <DeliveryIcon />
                  </Box>
                  <Box>
                    <Heading
                      as="h2"
                      variant="h6"
                      sx={{ fontSize: [2], my: [3], fontWeight: "600" }}
                    >
                      1-3 giorni lavorativi salvo disponibilità
                    </Heading>
                    <Box sx={{ pb: [3] }}>
                      <Text color="lightBorder">
                        Consegna rapida gratuita per ordini superiori a 250€{" "}
                        <br />
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
              <Box sx={{ display: ["none", "none", "block", "block"] }}>
                <SideSku
                  sku={sku}
                  clSkuDetails={clSkuDetails}
                  currentQuantity={currentQuantity}
                  updateQuantity={updateQuantity}
                  updateCustomerFavourites={updateCustomerFavourites}
                  isFavourie={isFavourie}
                />
              </Box>
            </Grid>
          </>
        ) : (
          <SkuPageSkeleton />
        )}
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

const SideSku = ({
  sku,
  clSkuDetails,
  currentQuantity,
  updateQuantity,
  updateCustomerFavourites,
  isFavourie,
}) => {
  return (
    <Box>
      <Box sx={{ mb: [4, 5, 11] }}>
        <Heading
          as="h1"
          variant="h2"
          sx={{
            color: "dark",
            fontWeight: "400",
            my: [0],
            fontSize: [5, "28px"],
          }}
        >
          {sku.name}
        </Heading>
        {sku.description && (
          <Box
            sx={{ marginTop: 4 }}
            dangerouslySetInnerHTML={{ __html: sku.description }}
          />
        )}
      </Box>
      <Box>
        {clSkuDetails && (
          <Flex
            sx={{
              alignItems: "center",
              mb: [4, 5, 6],
              minHeight: ["36px"],
            }}
          >
            <Text as="span" sx={{ fontWeight: "600", fontSize: [5, 6] }}>
              {clSkuDetails &&
              clSkuDetails.prices &&
              !clSkuDetails.prices.error ? (
                <>
                  {clSkuDetails.prices.discountedPrice
                    ? "€" +
                      (
                        clSkuDetails.prices.discountedPrice / 100
                      ).toLocaleString("it-IT", { minimumFractionDigits: 2 })
                    : "€" +
                      (clSkuDetails.prices.price / 100).toLocaleString(
                        "it-IT",
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                  <Text
                    sx={{
                      pl: [2],
                      fontSize: [1],
                      color: "lightBorder",
                    }}
                  >
                    Prezzo per unità / IVA esclusa
                  </Text>
                </>
              ) : clSkuDetails.prices && clSkuDetails.prices.error ? (
                <Box>Prezzo non disponibile</Box>
              ) : (
                <Box
                  sx={{
                    minWidth: "80px",
                    maxWidth: "80px",
                  }}
                >
                  <BouncingDotsLoader color="primary" />
                </Box>
              )}
            </Text>
          </Flex>
        )}
      </Box>
      <Box sx={{ pb: [4, 5, 9] }}>
        <SkuQuantity
          sku={sku}
          quantity={currentQuantity}
          updateQuantity={updateQuantity}
        />
      </Box>
      <Grid
        columns={["auto 54px"]}
        gap={[2]}
        sx={{
          mb: [4, 5, 6],
          alignItems: "center",
          minHeight: "60px",
          height: "60px",
        }}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <AddToCart sku={clSkuDetails} quantity={currentQuantity} />
        </Box>
        <Box sx={{ height: "100%" }}>
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
              "&:hover": {
                borderColor: "transparent",
                "svg *": {
                  stroke: "light",
                },
              },
              svg: {
                "*": {
                  stroke: isFavourie ? "light" : "primary",
                },
                width: "20px",
                height: "20px",
              },
            }}
          >
            <FavouritIcon />
          </Button>
        </Box>
      </Grid>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "lightBorder",
          p: [4],
          mb: [4, 5, 0],
        }}
      >
        <Box sx={{ pb: [4] }}>
          <Text sx={{ fontWeight: "600" }}>Dettagli prodotto</Text>
        </Box>
        <ThumbProductDetails item={sku}>
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
        </ThumbProductDetails>
      </Box>
    </Box>
  );
};

export default SkuPage;

export const query = graphql`
  query SkuPageQuery($id: String!, $categoryId: [String]) {
    sku: datoCmsSku(id: { eq: $id }) {
      ...SkuDetails
      seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
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
    description
    code
    slug
    minimum
    multiple
    size
    material
    color
    pallet
    ecolabel
    biodegradable
    haccp
    sanitizer
    detergentType
    detergentUsage
    ranking
    pack
    brand
    documents {
      url
      title
    }
    images {
      url(imgixParams: { ar: "1:1", fit: "crop", w: "670", h: "670" })
      gatsbyImageData(
        width: 670
        height: 670
        placeholder: BLURRED
        forceBlurhash: false
        imgixParams: { ar: "1:1", fit: "crop" }
      )
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
