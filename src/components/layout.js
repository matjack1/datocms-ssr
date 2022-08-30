import React, { useEffect, useState } from "react";
import { Box, Container, Heading, Flex } from "theme-ui";
import Header from "./header";
import { HeaderMenuContext } from "../hooks/headerMenuContext";
import { useMenu } from "../hooks/useMenu";
import Footer from "./footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ title, children }) => {
  const menu = useMenu();

  return (
    <Box>
      <HeaderMenuContext.Provider value={menu}>
        <Flex
          sx={{
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "100vh",
          }}
        >
          <Header title={title} />
          <Box as="main">
            {children}
          </Box>
          <Footer />
        </Flex>
      </HeaderMenuContext.Provider>
      <ToastContainer />
    </Box>
  );
};

export default Layout;
