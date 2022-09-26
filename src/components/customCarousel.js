import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { Box, Button, Container, Flex, Heading, Grid } from "theme-ui";
import CustomerContext from "../hooks/customerContext";
import { buildClient } from "@datocms/cma-client-browser";
import { InboundLink } from "./link";
import { getProductPath, getCategoryPath } from "../utils/path";
import ChevronRightIcon from "../assets/img/icons/chevron-right.inline.svg";
import ChevronLeftIcon from "../assets/img/icons/chevron-left.inline.svg";
import { GatsbyImage } from "gatsby-plugin-image";
import ProductThumb from "./productThumb";
import PlaceholderImage from "../assets/img/placeholder-image.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Image } from "react-datocms";

const CustomCarousel = ({
  data,
  small = false,
  type = "category",
  productThumbnail = false,
}) => {

  const isBrowser = typeof window != "undefined" && window.document;
  const windowWidth = isBrowser && document.querySelector("body").offsetWidth;
  const [current, setCurrent] = useState(1);
  const scrollParentRef = useRef(null);
  const itemRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [offsetWidth, setOffsetWidth] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);

  const handleArrowIndex = (index) => {
    const scrolls = Math.ceil(
      (itemRef.current.offsetWidth * data.length) /
        itemRef.current.offsetWidth -
        scrollParentRef.current.offsetWidth / itemRef.current.offsetWidth
    );

    if (current + index >= 1 && current + index <= scrolls + 1) {
      scrollParentRef.current.scrollTo({
        top: 0,
        left:
          scrollParentRef.current.scrollLeft +
          index * itemRef.current.offsetWidth,
        behavior: "smooth",
      });
      setCurrent(current + index);
    }
  };

  // The scroll listener
  const handleScroll = useCallback(() => {
    setOffsetWidth(scrollParentRef.current.scrollLeft);
  }, []);

  // Attach the scroll listener to the div
  useEffect(() => {
    scrollParentRef.current &&
      scrollParentRef.current.addEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setTimeout(() => {
      setShowCarousel(true);
    }, 300);
  }, []);

  useEffect(() => {
    if (scrollParentRef.current) {
      console.log("enters");
      scrollParentRef.current.addEventListener("scroll", handleScroll);
    }
  }, [scrollParentRef.current]);

  return showCarousel ? (
    <Box
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      sx={{
        overscrollBehaviorX: "none",
        "*": {
          minWidth: "unset",
          ".rf-productnav-card-content": {
            width: ["160px", "290px"],
            height: small
              ? ["160px", "290px"]
              : productThumbnail
              ? ["340px", "440px"]
              : ["212px", "390px"],
            minWidth: ["160px", "290px"],
          },
          ".rf-cards-scroller-crop": {
            overflow: "hidden",
            paddingBottom: "26px",
          },
          ".rf-cards-scroller-crop,.rf-cards-scroller-itemview": {
            height: small
              ? ["160px", "290px"]
              : productThumbnail
              ? ["340px", "440px"]
              : ["212px", "390px"],
          },
        },
      }}
    >
      <Box as="div" className="rf-cards-scroller" sx={{ position: "relative" }}>
        <Box as="div" className="rf-cards-scroller-crop">
          <Box
            ref={scrollParentRef}
            as="div"
            data-core-scroller=""
            className="rf-cards-scroller-content"
            style={{ "overflow-x": "scroll;" }}
          >
            <Box
              as="div"
              data-core-scroller-platter=""
              className="rf-cards-scroller-platter"
              role="list"
              aria-label="Prodotto"
            >
              {data.map((item) => (
                <Box
                  as="div"
                  ref={itemRef}
                  className="rf-cards-scroller-itemview-wrapper"
                  data-core-scroller-item=""
                  role="listitem"
                >
                  <Box as="div" className="rf-cards-scroller-itemview">
                    <Box
                      as="div"
                      className="rf-productnav-card as-util-relatedlink"
                      data-trigger-click="click [data-relatedlink='c459d270-22fb-11ed-9104-11b35ac48992_link']"
                    >
                      {!productThumbnail ? (
                        <InboundLink
                          sx={{
                            textDecoration: "none",
                          }}
                          to={
                            type === "category"
                              ? getCategoryPath(item, item.locale)
                              : getProductPath(item)
                          }
                        >
                          <Box
                            as="div"
                            className="rf-productnav-card-content"
                            sx={{
                              width: ["160px", "290px"],
                              height: small
                                ? ["160px", "290px"]
                                : productThumbnail
                                ? ["auto", "500px"]
                                : ["212px", "390px"],
                              minWidth: ["160px", "290px"],
                              backgroundColor: "light",
                              border:
                                !small && !productThumbnail && "2px solid",
                              borderColor: "dark",
                            }}
                          >
                            <>
                              <Flex
                                sx={{
                                  flexDirection: "column",
                                  height: "100%",
                                }}
                              >
                                {!small && item.name && (
                                  <Heading
                                    as="h3"
                                    variant="h4"
                                    sx={{
                                      whiteSpace: "break-spaces",
                                      m: [0],
                                      p: [1, 3],
                                      minHeight: ["65px", "120px"],
                                    }}
                                  >
                                    {item.name && item.name}
                                  </Heading>
                                )}
                                <Box
                                  sx={{
                                    height: "100%",
                                  }}
                                >
                                  {item.image && (
                                    <GatsbyImage
                                      image={
                                        item.image
                                          ? item.image.gatsbyImageData
                                          : item.images[0].gatsbyImageData
                                      }
                                      alt={
                                        item.image
                                          ? item.image.gatsbyImageData
                                          : item.images[0].gatsbyImageData
                                      }
                                    />
                                  )}
                                  {item.images && item.images.length > 0 ? (
                                    <>
                                      <GatsbyImage
                                        image={
                                          item.image
                                            ? item.image.gatsbyImageData
                                            : item.images[0].gatsbyImageData
                                        }
                                        alt={
                                          item.image
                                            ? item.image.gatsbyImageData
                                            : item.images[0].gatsbyImageData
                                        }
                                      />
                                      {item.images[0].responsiveImage && (
                                        <Image
                                          data={item.images[0].responsiveImage}
                                        />
                                      )}
                                    </>
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
                                      <img src={PlaceholderImage} />
                                    </Box>
                                  )}
                                </Box>
                              </Flex>
                            </>
                          </Box>
                        </InboundLink>
                      ) : (
                        <Box
                          as="div"
                          className="rf-productnav-card-content"
                          sx={{
                            width: ["160px", "290px"],
                            height: small
                              ? ["160px", "290px"]
                              : productThumbnail
                              ? ["auto", "500px"]
                              : ["212px", "390px"],
                            minWidth: ["160px", "290px"],
                            backgroundColor: "light",
                            border: !small && !productThumbnail && "2px solid",
                            borderColor: "dark",
                          }}
                        >
                          <ProductThumb sku={item} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            m: [0],
          }}
        >
          <Button
            sx={{
              opacity: offsetWidth > 0 ? (showArrows ? 1 : 0) : 0,
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontStyle: "normal",
              overflow: "hidden",
              position: "absolute",
              textAlign: "center",
              top: small ? "34%" : productThumbnail ? "24%" : "45%",
              left: [3],
              "svg *": {
                fill: "light",
              },
            }}
            onClick={() => handleArrowIndex(-1)}
          >
            <ChevronLeftIcon />
          </Button>
          {console.log(
            Math.floor(
              scrollParentRef.current &&
                scrollParentRef.current.offsetWidth /
                  itemRef.current.offsetWidth
            ),
            data.length
            // scrollParentRef.current && itemRef.current
            //   ? Math.floor(
            //       scrollParentRef.current.offsetWidth /
            //         itemRef.current.offsetWidth
            //     ) == data.length ||
            //     (scrollParentRef.current &&
            //       offsetWidth === scrollParentRef.current.offsetWidth + 18)
            //     ? 0
            //     : showArrows
            //     ? 1
            //     : 0
            //   : 0
          )}
          <Button
            sx={{
              opacity:
                scrollParentRef.current &&
                Math.abs(scrollParentRef.current.scrollLeft) ===
                  scrollParentRef.current.scrollWidth -
                    scrollParentRef.current.clientWidth
                  ? 0
                  : showArrows
                  ? 1
                  : 0,
              backgroundColor: current != data.length ? "black" : "red",
              display: "block",
              fontStyle: "normal",
              overflow: "hidden",
              position: "absolute",
              textAlign: "center",
              top: small ? "34%" : productThumbnail ? "24%" : "45%",
              right: [3],
              "svg *": {
                fill: "light",
              },
            }}
            onClick={() => handleArrowIndex(1)}
          >
            <ChevronRightIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box>
      <Container sx={{ py: [0, 0] }}>
        <Grid
          columns={["1fr", "1fr 1fr", "1fr 1fr", "1fr 1fr 1fr"]}
          sx={{
            columnGap: [3],
          }}
        >
          {[1, 2, 3].map((sku) => (
            <Skeleton
              height={
                small
                  ? ["160px", "290px"]
                  : productThumbnail
                  ? ["auto", "500px"]
                  : ["212px", "390px"]
              }
              width={["160px", "290px"]}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomCarousel;
