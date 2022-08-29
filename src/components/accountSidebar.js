import React, { useContext } from "react";
import { Box, Flex, Heading, Text } from "theme-ui";
import { InboundLink } from "./link";
import { GrClose } from "react-icons/gr";
import CustomerContext from "../hooks/customerContext";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { getColor } from "@theme-ui/color";
import theme from "../gatsby-plugin-theme-ui";
import LoginButton from "./loginLink";
import LogoutButton from "./logoutButton";

const AccountSideBar = ({ open, closed, sideBarData }) => {
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
          py: [11],
          pr: [13],
          pl: [6],
          overflow: "auto",
          zIndex: 2147483636,
          transition: "transform 200ms 0s",
          transitionProperty: "transform,visibility,width",
          transform: open ? "translateX(0)" : "translateX(100%)",
          visibility: open ? "" : "hidden",
        }}
      >
        <Box sx={{ position: "absolute", right: [13] }} onClick={closed}>
          <GrClose size={24} />
        </Box>
        <Flex sx={{ flexDirection: "column", pt: [10] }}>
          <Heading as="h2" variant="h3" color="primary">
            Benvenuto
            <br />
            {customer.email}
          </Heading>
          <Box sx={{ pt: [11] }}>
            <Box>
              <Box>
                <Text sx={{ fontWeight: "600" }}>Ordini</Text>
              </Box>
              <Box
                sx={{
                  pt: [3],
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
                    <FiChevronRight color={dark} size={25} />
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
                <Text sx={{ fontWeight: "600" }}>Il mio account</Text>
              </Box>
              <Box sx={{ pt: [3] }}>
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
                    <FiChevronRight color={dark} size={25} />
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
                    <Text as="span">Metodi di pagamenti</Text>
                    <FiChevronRight color={dark} size={25} />
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
                    <FiChevronRight color={dark} size={25} />
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
                    <FiChevronRight color={dark} size={25} />
                  </Flex>
                </InboundLink> */}
              {/* </Box> */}
              <Box sx={{ pt: [3] }}>
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
                <Text sx={{ fontWeight: "600" }}>Hai bisogno di aiuto?</Text>
              </Box>
              <Box sx={{ pt: [3] }}>
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
                    <FiChevronRight color={dark} size={25} />
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

export default AccountSideBar;
