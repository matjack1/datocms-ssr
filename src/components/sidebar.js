import React from "react";
import { Box, Flex, Image, Text } from "theme-ui";
import { keyframes } from "@emotion/react";
import { InboundLink } from "./link";
import { getCategoryPath } from "../utils/path";
import Logo from "../assets/img/logo.svg";
import { GrClose } from "react-icons/gr";
import CloseIcon from "../assets/img/icons/close.inline.svg";

const Sidebar = ({ open, closed, sideBarData }) => {
  return (
    <>
      <Box
        onClick={closed}
        sx={{
          display: "block",
          position: "fixed",
          zIndex: 7999,
          top: "0",
          bottom: "0",
          right: "0",
          left: "0",
          backgroundColor: "#000",
          transition: "all .2s ease",
          opacity: open ? ".25" : "0",
          pointerEvents: open ? "all" : "none",
          willChange: open && "opacity",
        }}
      />
      <Box
        sx={{
          display: "block",
          boxSizing: "border-box",
          position: "fixed",
          width: ["390px", "480px"],
          maxWidth: "70%",
          height: "100%",
          left: "0",
          top: "0",
          backgroundColor: "#ffffff",
          py: [11],
          pl: [13],
          pr: [12],
          overflow: "auto",
          zIndex: 2147483636,
          transition: "transform 200ms 0s",
          transitionProperty: "transform,visibility,width",
          transform: open ? "translateX(0)" : "translateX(-470px)",
          visibility: open ? "" : "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: [6],
            svg: {
              width: "18px",
              height: "auto",
            },
          }}
          onClick={closed}
        >
          <CloseIcon />
        </Box>
        <Box>
          <InboundLink to="/">
            <Image src={Logo} sx={{ maxHeight: "80px" }} />
          </InboundLink>
        </Box>
        <Flex sx={{ flexDirection: "column", pt: [14] }}>
          {console.log(sideBarData)}
          {sideBarData &&
            sideBarData.map((menuItem, index) =>
              index === 0 ? (
                <>
                  <Box sx={{ pb: [7] }}>
                    <Text sx={{ fontWeight: "600" }}>
                      {menuItem.link.link.name}
                    </Text>
                  </Box>
                  <InboundLink
                    sx={{ color: "text", textDecoration: "none" }}
                    to={getCategoryPath(menuItem.link.link, menuItem.locale)}
                  >
                    Scopri tutti gli articoli
                  </InboundLink>
                </>
              ) : (
                <Box sx={{ pt: [5] }}>
                  <InboundLink
                    sx={{ color: "text", textDecoration: "none" }}
                    to={getCategoryPath(menuItem.link.link, menuItem.locale)}
                  >
                    {menuItem.link.link.name}
                  </InboundLink>
                </Box>
              )
            )}
        </Flex>
      </Box>
    </>
  );
};

export default Sidebar;
