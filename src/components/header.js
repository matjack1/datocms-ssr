import React, { useEffect, useState, useContext } from "react";
import { Box, Container, Text, Flex, Grid } from "@theme-ui/components";
import Nav from "./nav";
import SecondaryNav from "./secondaryNav";
import MobileNav from "./mobileNav";
import { HeaderMenuContext } from "../hooks/headerMenuContext";
import { InboundLink } from "./link";
import SecondaryNavMobile from "../components/secondaryNavMobile";
import SearchBar from "./searchBar";

const Header = ({ color, title }) => {
  const [isSticky, setIsSticky] = useState(null);

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
          display: ["none", "block"],
          backgroundColor: "dark",
        }}
      >
        <Container sx={{ py: [1, 1] }}>
          <Grid
            columns={["1fr 1fr 1fr"]}
            sx={{ display: ["none", "grid"], justifyContent: "space-between" }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Text sx={{ color: "white", fontWeight: "600", fontSize: [1] }}>
              </Text>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Text sx={{ color: "white", fontWeight: "600", fontSize: [1] }}>
                Spedizione gratuita per ordini superiori a €200
              </Text>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <InboundLink
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: [1],
                  textDecoration: "none",
                }}
                href="/account/support"
              >
                Aiuto
              </InboundLink>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Container
        sx={{
          pt: [3, 5],
          pb: [3, 4],
        }}
      >
        <Nav color={color} />
      </Container>
      <Box
        sx={{
          borderTop: "1px solid",
          borderBottom: "1px solid",
          display: ["none", "none", "block", "block"],
        }}
      >
        <Container
          className={isSticky}
          sx={{
            display: "grid",
            gridTemplateColumns: ["1fr 325px", "1fr 355px"],
            gridGap : [0],
            py: [0, 0, 0],
            justifyContent: "space-between",
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
          }}
        >
          <Box
            sx={{
              py: [4, 4, 4],
              borderRight: "1px solid",
              borderColor: "dark",
            }}
          >
            <SecondaryNav color={color} />
          </Box>
          <SearchBar title={title} />
        </Container>
      </Box>
      <Box
        sx={{
          borderTop: "1px solid",
          borderBottom: "1px solid",
          display: ["block", "block", "none", "none"],
        }}
      >
        <Grid
          sx={{
            display: "grid",
            gridGap : [0],
            gridTemplateColumns: ["50px 1fr", "1fr 355px"],
          }}
        >
          <SecondaryNavMobile />
          <SearchBar title={title} />
        </Grid>
      </Box>
      <Box sx={{ display: ["block", "block", "block", "none"] }}>
        <MobileNav theme={"light"} />
      </Box>
    </Box>
  );
};

export default Header;
