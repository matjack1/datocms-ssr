import React, { useEffect } from "react";
import { Box, Container, Heading } from "theme-ui";
import Header from "./header";
import { MenuContext } from "../hooks/menuContext";
import { useMenu } from "../hooks/useMenu";

const Layout = ({ title, children }) => {
  const menu = useMenu();

  return (
    <Box>
      {menu && menu.length > 0 && (
        <MenuContext.Provider value={{menu : menu}}>
          <Header />
          {children}
        </MenuContext.Provider>
      )}
    </Box>
  );
};

export default Layout;
