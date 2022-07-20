import { Router } from "@reach/router";
import { graphql } from "gatsby";
import React from "react";
import { Box, Heading } from "theme-ui";
import CategoriesTabLink from "../components/categoriesTabLink";
import Nav from "../components/nav";
import ForgotPassword from "./forgot-password.js"
import ResetPassword from "./reset-password.js"

const IndexPage = ({ data: { categories } }) => {
  console.log(categories);
  return (
    <Box>
        <Nav />
        <Heading as="h1">Home</Heading>
        <CategoriesTabLink categories={categories.nodes[0].treeChildren} />
    </Box>
  );
};

export default IndexPage;

export const query = graphql`
  query HomePageQuery {
    categories: allDatoCmsCategory(
      filter: { root: { eq: true } }
      sort: { order: ASC, fields: position }
    ) {
      nodes {
        ...CategoryDetails
        treeChildren {
          ...CategoryDetails
        }
      }
    }
  }
`;
