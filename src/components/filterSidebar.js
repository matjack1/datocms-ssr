import React, { useState } from "react";
import { Box, Flex, Image, Text, Container, Button, Heading } from "theme-ui";
import { keyframes } from "@emotion/react";
import { InboundLink } from "./link";
import { getCategoryPath } from "../utils/path";
import Logo from "../assets/img/logo.svg";
import { GrClose } from "react-icons/gr";
import CloseIcon from "../assets/img/icons/close.inline.svg";
import ChevronRightIcon from "../assets/img/icons/chevron-right.inline.svg";
import ChevronLeftIcon from "../assets/img/icons/chevron-left.inline.svg";
import FilterIcon from "../assets/img/icons/gear.inline.svg";

const FilterSidebar = ({
  children,
  skus,
  handleOpenSecondary,
  sideBarData,
  mobile = false,
  closeBar,
}) => {
  // STATE TO TRACK IF SIDEDRAWER IS OPEN OR CLOSED
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  //  FUNCTION TO HANDLE CLOSE ACTION ON SIDEDRAWER/MODAL
  const sideDrawerClosedHandler = () => {
    setShowSideDrawer(false);

    // Unsets Background Scrolling to use when SideDrawer/Modal is closed
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "unset";
    }
  };

  // FUNCTION TO HANDLE OPEN ACTION ON SIDEDRAWER/MODAL
  const showSidebar = (sidebarLinks, parent) => {
    setShowSideDrawer(true);

    let allData = [parent].concat(sidebarLinks);

    // Disables Background Scrolling whilst the SideDrawer/Modal is open
    if (typeof window != "undefined" && window.document) {
      // document.body.style.overflow = "hidden";
    }
  };

  return (
    <>
      <Container sx={{ pt: [0, 0, 6, 6] }}>
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Text sx={{ fontWeight: "600" }}>
              {skus.length} articol{skus.length > 0 ? "i" : "o"}
            </Text>
          </Flex>
          <Box>
            <Button
              onClick={showSidebar}
              variant="buttons.primaryEmpty"
              sx={{
                display: "flex",
                borderColor: "dark",
                color: "dark",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text sx={{ mr: 2 }}>Filtri </Text>
              <FilterIcon />
            </Button>
          </Box>
        </Flex>
      </Container>
      <Box
        onClick={sideDrawerClosedHandler}
        sx={{
          display: "block",
          position: "fixed",
          zIndex: handleOpenSecondary ? 81111 : 7999,
          top: "0",
          bottom: "0",
          right: "0",
          left: "0",
          backgroundColor: "#000",
          transition: "all .2s ease",
          opacity: showSideDrawer ? ".25" : "0",
          pointerEvents: showSideDrawer ? "all" : "none",
          willChange: showSideDrawer && "opacity",
        }}
      />
      <Box
        sx={{
          display: "block",
          boxSizing: "border-box",
          position: "fixed",
          width: ["100%"],
          maxWidth: "100%",
          height: "100%",
          left: "0",
          top: "0",
          backgroundColor: "#ffffff",
          py: [4, 4, 11],
          pl: [3, 3, 13],
          pr: [3, 3, 12],
          overflow: "auto",
          zIndex: 2147483636,
          transition: "transform 200ms 0s",
          transitionProperty: "transform,visibility,width",
          transform: showSideDrawer ? "translateX(0)" : "translateX(-470px)",
          visibility: showSideDrawer ? "" : "hidden",
          a: {
            fontSize: [1],
            "&:hover": {
              color: "primary",
              "svg *": {
                fill: "primary",
              },
            },
          },
        }}
      >
        <Flex>
          <Box
            sx={{
              position: "absolute",
              left: !mobile && [4],
              display: "flex",
              alignItems: "center",
            }}
            onClick={sideDrawerClosedHandler}
          >
            <Flex
              sx={{
                svg: {
                  height: "14px",
                  width: "auto",
                },
                justifyContent: "center",
                alignItems: "center",
                pr: [1],
              }}
            >
              <ChevronLeftIcon />
            </Flex>
            Risultati
          </Box>
        </Flex>
        <Flex sx={{ flexDirection: "column", pt: !mobile && [6] }}>
          <Heading as="h2" variant="h2">
            Filtri
          </Heading>
          {children}
        </Flex>
      </Box>
    </>
  );
};

export default FilterSidebar;
