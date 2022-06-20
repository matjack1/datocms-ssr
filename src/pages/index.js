import React from "react";
import { Box, Heading } from "theme-ui";
import Nav from "../components/nav";

const IndexPage = () => {
  return (
    <Box>
      <Nav />
      <Heading as="h1">Home</Heading>
    </Box>
  );
};

export default IndexPage;
