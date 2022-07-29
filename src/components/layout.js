import React, { useEffect, useState } from "react";
import { Box, Container, Heading } from "theme-ui";
import Header from "./header";
import { HeaderMenuContext } from "../hooks/headerMenuContext";
import { useMenu } from "../hooks/useMenu";

const Layout = ({ title, children }) => {
  const menu = useMenu();

  return (
    <Box>
      <HeaderMenuContext.Provider value={menu}>
        <Header />
        {children}
      </HeaderMenuContext.Provider>
    </Box>
  );
};

export default Layout;
