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

const Accordion = ({ title, items }) => {
  const [selectedItem, setSelectedItem] = useState(0);

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
        allowMultipleExpanded={false}
        allowZeroExpanded={false}
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
                            <Grid columns={["30px 5fr"]} gap={[1]}>
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
                                <Text variant="h5" sx={{ my: [0] }}>
                                  {item.title}
                                </Text>
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
                          gap={32}
                          sx={{
                            borderTop: "1px solid",
                            borderColor: "lightGrey",
                            paddingTop: [2, 5],
                          }}
                        >
                          <Text variant="h4" sx={{ mt: 0 }}>
                            {item.subtitle}
                          </Text>
                          <RichContentStructuredText text={item.body} />
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
