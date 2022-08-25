import React, { useEffect, useState } from "react";
import { Box, Container, Heading } from "theme-ui";
import Header from "./header";
import { HeaderMenuContext } from "../hooks/headerMenuContext";
import { useMenu } from "../hooks/useMenu";
import Footer from "./footer";

const Layout = ({ title, children }) => {
  const menu = useMenu();

  return (
    <Box>
      <HeaderMenuContext.Provider value={menu}>
        <Header title={title} />
        {children}
        <Footer />
      </HeaderMenuContext.Provider>
    </Box>
  );
};

export default Layout;
