import React from "react";
import { Box, Flex, Grid, Text, Container, Image } from "theme-ui";
import Logo from "../assets/img/logo.svg";

const OutsideNav = () => {
  return (
    <>
      <Box
        sx={{
          display: ["none", "block"],
          backgroundColor: "dark",
        }}
      >
        <Container sx={{ py: [1, 1], display: ["none", "block"] }}>
          <Grid
            columns={["1fr 1fr 1fr"]}
            sx={{ justifyContent: "space-between" }}
          >
            <Box>
              <Text sx={{ color: "white", fontWeight: "600", fontSize: [1] }}>
                14 GIORNI PER IL RESO
              </Text>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Text sx={{ color: "white", fontWeight: "600", fontSize: [1] }}>
                Spedizione gratuita per ordini superiori a €250
              </Text>
            </Box>
            <Box></Box>
          </Grid>
        </Container>
      </Box>
      <Flex
        sx={{
          display: ["flex", "none"],
          justifyContent: "center",
          alignItems: "center",
          minHeight: "65px",
          borderBottom: "1px solid",
          borderColor: "dark",
        }}
      >
        <Image
          src={Logo}
          sx={{ height: ["30px"], maxHeight: "30px", minHeight: "30px" }}
        />
      </Flex>
    </>
  );
};

export default OutsideNav;
