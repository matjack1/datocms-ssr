import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Flex,
} from "@theme-ui/components";
import RichContentStructuredText from "../components/richContentStructuredText";
import {
  Accordion as AccordionWrapper,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import DeliveryIcon from "../assets/img/icons/spedizione.inline.svg";
import PayIcon from "../assets/img/icons/pagamento.inline.svg";
import HelpIcon from "../assets/img/icons/help.inline.svg";
import SocafIcon from "../assets/img/icons/socaf.inline.svg";
import CartIcon from "../assets/img/icons/shopping.inline.svg";
import { VscQuestion } from "react-icons/vsc";
import { fontSizes, transforms } from "@theme-ui/preset-tailwind";
import ChevronRightIcon from "../assets/img/icons/chevron-right.inline.svg";

const Accordion = ({ title, items }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectScrollActivate = (index) => {
    setSelectedItem(index);
  };

  return (
    <Box
      mb={[3, 5]}
      sx={{
        backgroundColor: "light",
      }}
    >
      <AccordionWrapper
        allowMultipleExpanded={true}
        allowZeroExpanded={true}
        onChange={(e) => handleSelectScrollActivate(e[0])}
      >
        {items &&
          items.map((item, index) => (
            <>
              {item.title && (
                <Box
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "lightGrey",
                  }}
                >
                  <AccordionItem key={index} uuid={index} name={index}>
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        <Box
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "lightBackground",
                            },
                          }}
                        >
                          <Container
                            sx={{
                              borderBottom:
                                index !== selectedItem && "1px solid",
                              borderColor: "dark",
                            }}
                          >
                            <Grid columns={["30px 5fr 1fr"]} gap={[1]}>
                              <Flex
                                sx={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  svg: {
                                    color: "dark",
                                    "*": {
                                      stroke: "dark",
                                    },
                                    stroke: "dark",
                                  },
                                }}
                              >
                                {item.title === "Hai bisogno di aiuto?" ? (
                                  <VscQuestion size={24} />
                                ) : item.title === "Compra facile" ? (
                                  <CartIcon />
                                ) : item.title === "Socaf" ? (
                                  <SocafIcon />
                                ) : item.title === "Modalità di pagamento" ? (
                                  <PayIcon />
                                ) : (
                                  <DeliveryIcon />
                                )}
                              </Flex>
                              <Flex
                                sx={{
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  variant="h5"
                                  as="h2"
                                  sx={{ my: [0], fontWeight: "600" }}
                                >
                                  {item.title}
                                </Text>
                              </Flex>
                              <Flex
                                sx={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  svg: {
                                    height: "15px",
                                  },
                                  "svg *": {
                                    fill: "dark",
                                  },
                                  transform:
                                    index == selectedItem && "rotate(90deg)",
                                }}
                              >
                                <ChevronRightIcon />
                              </Flex>
                            </Grid>
                          </Container>
                        </Box>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <Container
                        sx={{
                          paddingTop: [0, 0, 0],
                          borderBottom: "1px solid",
                          borderColor: "dark",
                        }}
                      >
                        <Grid
                          columns={[1, 1, "2fr 3fr"]}
                          gap={[0]}
                          sx={{
                            borderTop: "1px solid",
                            borderColor: "lightGrey",
                            paddingTop: [0,2, 5],
                          }}
                        >
                          {item.subtitle && (
                            <Text variant="h4" sx={{ mt: 0 }}>
                              {item.subtitle}
                            </Text>
                          )}
                          {item.body && (
                            <Box
                              sx={{
                                p: {
                                  color: "dark",
                                  fontSizes: [1],
                                },
                                a: {
                                  color: "dark",
                                },
                              }}
                            >
                              <RichContentStructuredText
                                text={item.body}
                                theme={"dark"}
                              />
                            </Box>
                          )}
                        </Grid>
                      </Container>
                    </AccordionItemPanel>
                  </AccordionItem>
                </Box>
              )}
            </>
          ))}
      </AccordionWrapper>
    </Box>
  );
};

export default Accordion;
