import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { Box, Button, Container, Flex, Heading, Image } from "theme-ui";
import CustomerContext from "../hooks/customerContext";
import { buildClient } from "@datocms/cma-client-browser";
import { InboundLink } from "./link";
import { getProductPath, getCategoryPath } from "../utils/path";
import ChevronRightIcon from "../assets/img/icons/chevron-right.inline.svg";
import ChevronLeftIcon from "../assets/img/icons/chevron-left.inline.svg";
import { GatsbyImage } from "gatsby-plugin-image";
import ProductThumb from "./productThumb";
import ContentLoader from "react-content-loader";
import PlaceholderImage from "../assets/img/placeholder-image.png";

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
        "*": {
          minWidth: "unset",
          ".rf-productnav-card-content": {
            width: "290px",
            height: small ? "290px" : productThumbnail ? "500px" : "390px",
            minWidth: "290px",
          },
          ".rf-cards-scroller-crop": {
            overflow: "hidden",
            paddingBottom: "26px",
          },
          ".rf-cards-scroller-crop,.rf-cards-scroller-itemview": {
            height: small ? "290px" : productThumbnail ? "500px" : "390px",
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
                              width: "290px",
                              height: small
                                ? "290px"
                                : productThumbnail
                                ? "500px"
                                : "390px",
                              minWidth: "290px",
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
                                      p: [3],
                                      minHeight: "120px",
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
                                  {(item.image && item.image.length > 0) ||
                                  (item.images && item.images.length > 0) ? (
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
                              </Flex>
                            </>
                          </Box>
                        </InboundLink>
                      ) : (
                        <Box
                          as="div"
                          className="rf-productnav-card-content"
                          sx={{
                            width: "290px",
                            height: small
                              ? "290px"
                              : productThumbnail
                              ? "500px"
                              : "390px",
                            minWidth: "290px",
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
          {console.log("offsetWidth", offsetWidth)}
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
        <ContentLoader
          backgroundColor="#d9d9d9"
          foregroundColor="#ededed"
          viewBox="0 0 1280 400"
          width={1280}
        >
          <rect
            x="0"
            y="20"
            rx="8"
            ry="8"
            width="290"
            height={small ? "290px" : productThumbnail ? "500px" : "390px"}
          />
          <rect
            x="310"
            y="20"
            rx="8"
            ry="8"
            width="290"
            height={small ? "290px" : productThumbnail ? "500px" : "390px"}
          />
          <rect
            x="620"
            y="20"
            rx="8"
            ry="8"
            width="290"
            height={small ? "290px" : productThumbnail ? "500px" : "390px"}
          />
          <rect
            x="940"
            y="20"
            rx="8"
            ry="8"
            width="290"
            height={small ? "290px" : productThumbnail ? "500px" : "390px"}
          />
        </ContentLoader>
      </Container>
    </Box>
  );
};

export default CustomCarousel;
