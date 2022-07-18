import React from "react";
import { Box, Heading } from "theme-ui";
import Nav from "./nav";

const Layout = ({ title, children }) => {
  return (
    <Box>
      <Nav />
      {children}
    </Box>
  );
};

export default Layout
