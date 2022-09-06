import {
  Box,
  Container,
  Flex,
  Grid,
  Text,
  Image,
  Heading,
} from "@theme-ui/components";
import React from "react";
import { useFooter } from "../hooks/useFooter";
import { MagicLink } from "../utils/magicLink";
import { i18nContext } from "../hooks/i18nContext";
import Logo from "../assets/img/logo.svg";
import DeliveryIcon from "../assets/img/icons/spedizione.inline.svg";
import PayIcon from "../assets/img/icons/pagamento.inline.svg";
import HelpIcon from "../assets/img/icons/help.inline.svg";
import SocafIcon from "../assets/img/icons/socaf.inline.svg";
import CartIcon from "../assets/img/icons/shopping.inline.svg";
import { VscQuestion } from "react-icons/vsc";
import RichContentStructuredText from "../components/richContentStructuredText";
import { GatsbyImage } from "gatsby-plugin-image";

const Footer = () => {
  const footer = useFooter();

  return (
    <Box
      className="footer"
      as="footer"
      sx={{
        backgroundColor: "dark",
        py: 6,
        mt: [8],
        position: "relative",
        color: "light",
        minHeight: "516px",
      }}
    >
      <i18nContext.Consumer>
        {(t) => (
          <>
            <Container>
              <Grid
                columns={[1, `repeat(3,1fr)`]}
                sx={{ columnGap: [15], rowGap: [6] }}
              >
                {footer.content.map((block, index) => (
                  <Box as="section" key={block.id} sx={{}}>
                    {block.model.apiKey === "text_block" && (
                      <Box>
                        <Flex
                          sx={{
                            pb: [5],
                          }}
                        >
                          <Flex
                            sx={{
                              justifyContent: "start",
                              alignItems: "center",
                              svg: {
                                "*": {
                                  stroke: "light",
                                },
                              },
                            }}
                          >
                            {block.title === "Hai bisogno di aiuto?" ? (
                              <VscQuestion size={24} />
                            ) : block.title === "Compra facile" ? (
                              <CartIcon />
                            ) : (
                              block.title && <SocafIcon />
                            )}
                          </Flex>
                          <Box sx={{ pl: 2 }}>
                            <Heading
                              as="h2"
                              variant="h5"
                              sx={{
                                color: "light",
                                my: [0],
                                fontWeight: "600",
                              }}
                            >
                              {block.title}
                            </Heading>
                          </Box>
                        </Flex>
                        <Box
                          sx={{
                            a: {
                              fontSize: [1],
                              color: block.title === "Socaf" && "light",
                            },
                            p: {
                              fontSize: [1],
                            },
                          }}
                        >
                          <RichContentStructuredText text={block.body} />
                        </Box>
                      </Box>
                    )}
                    {block.model.apiKey === "image_gallery" && (
                      <Box>
                        <Flex
                          sx={{
                            pb: [5],
                            justifyContent: "start",
                            alignItems: "center",
                          }}
                        >
                          <Flex
                            sx={{
                              justifyContent: "start",
                              alignItems: "center",
                              svg: {
                                "*": {
                                  stroke: "light",
                                },
                              },
                            }}
                          >
                            {block.title === "Modalità di pagamento" ? (
                              <PayIcon />
                            ) : (
                              <DeliveryIcon />
                            )}
                          </Flex>
                          <Box sx={{ pl: 2 }}>
                            <Heading
                              as="h2"
                              variant="h5"
                              sx={{
                                color: "light",
                                my: [0],
                                fontWeight: "600",
                              }}
                            >
                              {block.title}
                            </Heading>
                          </Box>
                        </Flex>
                        <Grid columns={["1fr 1fr 1fr 1fr"]}>
                          {block.images &&
                            block.images.length > 0 &&
                            block.images.map((image) => (
                              <GatsbyImage
                                image={image.gatsbyImageData}
                                alt={image.gatsbyImageData}
                              />
                            ))}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                ))}
              </Grid>
              <Flex sx={{ pt: [12], justifyContent: "space-between" }}>
                <Flex
                  sx={{
                    justifyContent: "flex-start",
                    a: {
                      textDecoration:"none"
                    }
                  }}
                >
                  {footer.policies.map((link, index) => (
                    <>
                      <MagicLink item={link} variant="links.light" />
                      {index !== footer.policies.length - 1 && (
                        <Box sx={{ px: [1] }}>|</Box>
                      )}
                    </>
                  ))}
                </Flex>
              </Flex>
            </Container>
          </>
        )}
      </i18nContext.Consumer>
    </Box>
  );
};

const List = (props) => {
  return (
    <Box
      {...props}
      sx={{
        p: 0,
        columns: 2,
        listStyle: "none",
        a: {
          fontSize: [0],
          color: "light",
          fontWeight: "400",
          textDecoration: "none",
          "&.active": {
            color: "light",
          },
          "&:hover": {
            textDecoration: "underline",
          },
        },
      }}
      as="ul"
    />
  );
};

const Item = (props) => {
  return <Box {...props} as="li" sx={{ "&:last-child": { mb: 0 } }} />;
};

export default Footer;
