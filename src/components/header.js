import React, { useEffect, useState, useContext } from "react";
import { Box, Container, Text, Flex } from "@theme-ui/components";
import Nav from "./nav";
import SecondaryNav from "./secondaryNav";
import MobileNav from "./mobileNav";
import { HeaderMenuContext } from "../hooks/headerMenuContext";
import { InboundLink } from "./link";

const Header = ({ color }) => {
  const [isSticky, setIsSticky] = useState("");
  
  // Sticky Menu Area
  useEffect(() => {
    window.addEventListener("scroll", handleIsSticky);
    return () => {
      window.removeEventListener("scroll", handleIsSticky);
    };
  });

  /* Method that will fix header after a specific scrollable */
  const handleIsSticky = (e) => {
    const header = document.querySelector(".header-section");
    const scrollTop = window.scrollY;
    scrollTop >= 250 ? setIsSticky("is-sticky") : setIsSticky("");
  };

  return (
    <Box
      as="header"
      sx={{
        position: "relative",
        width: "100%",
        zIndex: "9999",
      }}
    >
      <Box
        sx={{
          backgroundColor: "dark",
        }}
      >
        <Container sx={{ py: [1, 1] }}>
          <Flex sx={{ justifyContent: "space-between" }}>
            <Box>
              <Text sx={{ color: "white", fontWeight: "600", fontSize: [1] }}>
                14 GIORNI PER IL RESO
              </Text>
            </Box>
            <Box>
              <Text sx={{ color: "white", fontWeight: "600", fontSize: [1] }}>
                SPEDIZIONE E RESO GRATUITI*
              </Text>
            </Box>
            <Box>
              <InboundLink
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: [1],
                  textDecoration: "none",
                }}
                href="/help"
              >
                Aiuto
              </InboundLink>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container
        sx={{ pt: [5, 5], pb:[4,4], display: ["none", "none", "none", "block"] }}
      >
        <Nav color={color} />
      </Container>
      <Box sx={{borderTop: "1px solid", borderBottom:"1px solid"}}>
        <Container
          className={isSticky}
          sx={{
            ".isSticky": {
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              zIndex: "999",
              boxShadow: "0 2px 24px 0 rgb(0 0 0 / 15%)",
              backgroundColor: "#ffffff !important",
              animation:
                "500ms ease-in-out 0s normal none 1 running fadeInDown",
            },
            display: ["none", "none", "none", "block"],
          }}
        >
          <SecondaryNav color={color} />
        </Container>
      </Box>
      <Box sx={{ display: ["block", "block", "block", "none"] }}>
        <MobileNav theme={"light"} />
      </Box>
    </Box>
  );
};

export default Header;
