import React from "react";
import { Box, Container, Flex, Heading } from "theme-ui";
import { GatsbyImage } from "gatsby-plugin-image";
import ArrowRight from "../assets/img/arrow-right.inline.svg";
import { InboundLink } from "./link";
import { getProductPath } from "../utils/path";

const FeaturedProduct = ({ data }) => {
  return (
    <Box sx={{ backgroundColor: "secondary" }}>
      <Container sx={{ pt: [9, 9], pb: [0, 0, 0] }}>
        <Flex sx={{ justifyContent: "space-between" }}>
          <Box>
            <Heading
              as="h2"
              variant="h2"
              color="white"
              sx={{ mt: [4], mb: [0], lineHeight: [1.2] }}
            >
              {data.title}
            </Heading>
            <Heading
              as="div"
              sx={{
                h2: {
                  my: [0],
                  fontSize: [4, 5],
                  fontFamily: "heading",
                  lineHeight: [1.2],
                  fontWeight: "400",
                  color: "light",
                  my: 0,
                },
              }}
              dangerouslySetInnerHTML={{ __html: data.productName }}
            />
            <InboundLink to={getProductPath(data.product)} sx={{ textDecoration:"none" }}>
              <Flex
                sx={{ alignItems: "center", alignContent: "center", mt: [9] }}
              >
                <Flex
                  sx={{
                    alignItems: "center",
                    alignContent: "center",
                    color: "light",
                  }}
                  mr={[3]}
                >
                  Scopri di più
                </Flex>
                <Flex
                  variant="svg.arrow.light"
                  sx={{
                    alignItems: "center",
                    alignContent: "center",
                    width: "24px",
                    height: "24px",
                  }}
                >
                  <ArrowRight />
                </Flex>
              </Flex>
            </InboundLink>
          </Box>
          <Flex sx={{ justifyItems: "baseline" }}>
            <Box>
              {data.images && data.images.length > 0 ? (
                <GatsbyImage
                  image={data.images[0].gatsbyImageData}
                  alt={data.images[0].gatsbyImageData}
                />
              ) : (
                <Box
                  sx={{
                    minWidth: "340px",
                    minHeight: "340px",
                    backgroundColor: "light",
                  }}
                />
              )}
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default FeaturedProduct;
