import React, { useContext } from "react";
import { Box, Flex, Heading, Text } from "theme-ui";
import { InboundLink } from "./link";
import CustomerContext from "../hooks/customerContext";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { getColor } from "@theme-ui/color";
import theme from "../gatsby-plugin-theme-ui";
import LoginButton from "./loginLink";
import LogoutButton from "./logoutButton";
import CloseIcon from "../assets/img/icons/close.inline.svg";

const AccountSideBarMobile = ({ open, closed, sideBarData }) => {
  const { customer } = useContext(CustomerContext);
  const dark = getColor(theme, "dark");
  
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
          right: "0",
          top: "0",
          backgroundColor: "#ffffff",
          py: [4, 4, 11],
          pl: [3, 3, 13],
          pr: [3, 3, 12],
          overflow: "auto",
          zIndex: 2147483636,
          transition: "transform 200ms 0s",
          transitionProperty: "transform,visibility,width",
          transform: open ? "translateX(0)" : "translateX(100%)",
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
        <Box
          sx={{
            position: "absolute",
            right: [3],
            svg: {
              width: "18px",
              height: "auto",
            },
          }}
          onClick={closed}
        >
          <CloseIcon />
        </Box>
        <Flex sx={{ flexDirection: "column" }}>
          <Heading
            as="h2"
            variant="h3"
            color="primary"
            sx={{ fontSize: [5], my: [0] }}
          >
            Benvenuto
            <br />
            {customer.email}
          </Heading>
          <Box sx={{ pt: [5] }}>
            <Box>
              <Box>
                <Text sx={{ fontSize: [1], fontWeight: "600" }}>Ordini</Text>
              </Box>
              <Box
                sx={{
                  pt: [6],
                  ".active": {
                    svg: {
                      display: "none",
                    },
                  },
                }}
              >
                <InboundLink
                  onClick={closed}
                  sx={{ color: "text", textDecoration: "none" }}
                  to={"/account/orders"}
                >
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text as="span">Tutti gli ordini</Text>
                  </Flex>
                </InboundLink>
              </Box>
            </Box>
            <Box
              sx={{
                borderBottom: "1px solid",
                mb: [6],
                pt: [6],
                borderColor: "lightBorder",
              }}
            />
            <Box>
              <Box>
                <Text sx={{ fontSize: [1], fontWeight: "600" }}>
                  Il mio account
                </Text>
              </Box>
              <Box sx={{ pt: [6] }}>
                <InboundLink
                  onClick={closed}
                  sx={{ color: "text", textDecoration: "none" }}
                  to={"/account/addresses"}
                >
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text as="span">I tuoi indirizzi</Text>
                  </Flex>
                </InboundLink>
              </Box>
              <Box sx={{ pt: [3] }}>
                <InboundLink
                  onClick={closed}
                  sx={{ color: "text", textDecoration: "none" }}
                  to={"/account/payment"}
                >
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text as="span">Metodi di pagamento</Text>
                  </Flex>
                </InboundLink>
              </Box>
              <Box sx={{ pt: [3] }}>
                <InboundLink
                  onClick={closed}
                  sx={{ color: "text", textDecoration: "none" }}
                  to={"/account/billinginfo"}
                >
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text as="span">Dati aziendali</Text>
                  </Flex>
                </InboundLink>
              </Box>
              {/* <Box sx={{ pt: [3] }}>
                <InboundLink
                  onClick={closed}
                  sx={{ color: "text", textDecoration: "none" }}
                  to={"/account/settings"}
                >
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text as="span">Impostazioni</Text>
                    
                  </Flex>
                </InboundLink> */}
              {/* </Box> */}
              <Box sx={{ pt: [3], button: { fontSize: [1] } }}>
                <LogoutButton />
              </Box>
            </Box>
            <Box
              sx={{
                borderBottom: "1px solid",
                mb: [6],
                pt: [6],
                borderColor: "lightBorder",
              }}
            />
            <Box>
              <Box>
                <Text sx={{ fontWeight: "600", fontSize: [1] }}>
                  Hai bisogno di aiuto?
                </Text>
              </Box>
              <Box sx={{ pt: [6] }}>
                <InboundLink
                  onClick={closed}
                  sx={{ color: "text", textDecoration: "none" }}
                  to={"/account/support"}
                >
                  <Flex
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text as="span">Assistenza</Text>
                  </Flex>
                </InboundLink>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default AccountSideBarMobile;
