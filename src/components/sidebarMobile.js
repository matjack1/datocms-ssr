import React from "react";
import { Box, Flex, Image, Text } from "theme-ui";
import { keyframes } from "@emotion/react";
import { InboundLink } from "./link";
import { getCategoryPath } from "../utils/path";
import Logo from "../assets/img/logo.svg";
import { GrClose } from "react-icons/gr";
import CloseIcon from "../assets/img/icons/close.inline.svg";
import ChevronRightIcon from "../assets/img/icons/chevron-right.inline.svg";
import ChevronLeftIcon from "../assets/img/icons/chevron-left.inline.svg";

const SidebarMobile = ({
  open,
  closed,
  handleOpenSecondary,
  sideBarData,
  mobile = false,
  closeBar,
}) => {
  return (
    <>
      <Box
        onClick={closed}
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
          width: ["290px"],
          maxWidth: "70%",
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
          transform: open ? "translateX(0)" : "translateX(-470px)",
          visibility: open ? "" : "hidden",
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
          {mobile && (
            <Box
              sx={{
                display: handleOpenSecondary && "flex",
                justifyContent: "space-between",
                justifyItems: "center",
                width: "100%",
              }}
            >
              {!handleOpenSecondary && (
                <Flex
                  sx={{
                    justifyItems: "center",
                    fontSize: [1],
                    cursor: "pointer",
                  }}
                  onClick={() => closeBar()}
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
                  Indietro
                </Flex>
              )}
              {handleOpenSecondary && (
                <Text sx={{ fontWeight: "600", fontSize: [1] }}>Articoli</Text>
              )}
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              left: !mobile && [6],
              right: mobile && [3],
              top: mobile && [5],
              svg: {
                width: !mobile ? "18px" : "16px",
                height: "auto",
              },
              display: "flex",
              alignItems: "center",
            }}
            onClick={closed}
          >
            <CloseIcon />
          </Box>
        </Flex>
        {!mobile && (
          <Box>
            <InboundLink to="/">
              <Image src={Logo} sx={{ maxHeight: "80px" }} />
            </InboundLink>
          </Box>
        )}
        <Flex sx={{ flexDirection: "column", pt: !mobile && [12] }}>
          {sideBarData && sideBarData.length > 0 ? (
            sideBarData.map((menuItem, index) =>
              index === 0 ? (
                <>
                  <Box sx={{ pb: [8] }}></Box>
                  <Box sx={{ pb: [5], a: {} }}>
                    <Box
                      sx={{
                        cursor: "pointer",
                        color: "text",
                        textDecoration: "none",
                        "&:hover": {
                          color: "primary",
                          "svg *": {
                            fill: "primary",
                          },
                        },
                        fontSize: [1],
                      }}
                      onClick={() => handleOpenSecondary(menuItem)}
                    >
                      <Flex
                        sx={{
                          justifyItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {menuItem.link.link.name}
                        <Flex
                          sx={{
                            svg: {
                              height: "14px",
                              width: "auto",
                            },
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ChevronRightIcon />
                        </Flex>
                      </Flex>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box sx={{ pb: [5], a: {} }}>
                  <Box
                    sx={{
                      cursor: "pointer",
                      color: "text",
                      textDecoration: "none",
                      "&:hover": {
                        color: "primary",
                        "svg *": {
                          fill: "primary",
                        },
                      },
                      fontSize: [1],
                    }}
                    onClick={() => handleOpenSecondary(menuItem)}
                  >
                    <Flex
                      sx={{
                        justifyItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {menuItem.link.link.name}
                      <Flex
                        sx={{
                          svg: {
                            height: "14px",
                            width: "auto",
                          },
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ChevronRightIcon />
                      </Flex>
                    </Flex>
                  </Box>
                </Box>
              )
            )
          ) : (
            <>
              {sideBarData &&
                sideBarData.treeChildren.map((menuItem, index) =>
                  index === 0 ? (
                    <>
                      <Box sx={{ pb: [8] }}></Box>
                      <Box sx={{ pb: [5], a: {} }}>
                        <Box
                          sx={{
                            color: "text",
                            fontWeight: "600",
                            textDecoration: "none",
                            fontSize: [1],
                          }}
                        >
                          <Flex
                            sx={{
                              justifyItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {sideBarData.link.link.name}
                          </Flex>
                        </Box>
                      </Box>
                      <Box sx={{ pb: [5], a: {} }}>
                        <InboundLink
                          sx={{
                            color: "text",
                            textDecoration: "none",
                            "&:hover": {
                              color: "primary",
                            },
                          }}
                          to={getCategoryPath(
                            sideBarData.link.link,
                            sideBarData.locale
                          )}
                        >
                          <Flex
                            sx={{
                              justifyItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            Scopri tutti gli articoli
                          </Flex>
                        </InboundLink>
                      </Box>
                      <Box sx={{ pb: [5], a: {} }}>
                        <InboundLink
                          sx={{
                            color: "text",
                            textDecoration: "none",
                            "&:hover": {
                              color: "primary",
                            },
                          }}
                          to={getCategoryPath(
                            menuItem.link.link,
                            menuItem.locale
                          )}
                        >
                          {menuItem.link.link.name}
                        </InboundLink>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ pb: [4], a: {} }}>
                      <InboundLink
                        sx={{
                          color: "text",
                          textDecoration: "none",
                          "&:hover": {
                            color: "primary",
                          },
                        }}
                        to={getCategoryPath(
                          menuItem.link.link,
                          menuItem.locale
                        )}
                      >
                        {menuItem.link.link.name}
                      </InboundLink>
                    </Box>
                  )
                )}
            </>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default SidebarMobile;
