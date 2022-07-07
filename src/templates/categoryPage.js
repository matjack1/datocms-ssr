import React from "react";
import { graphql } from "gatsby";
import { Box, Heading } from "theme-ui";
import Nav from "../components/nav";
import ProductCollection from "../components/productCollection";
import CategoriesTabLink from "../components/categoriesTabLink";

const CategoryPage = ({
  data: { category, childCategories, siblingCategories, skus },
}) => {
  const categories =
    childCategories.nodes.length > 0
      ? childCategories.nodes
      : siblingCategories.nodes;

  console.log(skus.nodes);

  return (
    <Box>
      <Nav />
      <Heading as="h1">{category.name}</Heading>
      <CategoriesTabLink categories={categories} />
      <ProductCollection skus={skus.nodes} />
    </Box>
  );
};

export default CategoryPage;

export const query = graphql`
  query CategoryPageQuery($id: String!, $parentId: String!) {
    category: datoCmsCategory(id: { eq: $id }) {
      ...CategoryDetails
    }
    childCategories: allDatoCmsCategory(
      filter: { treeParent: { id: { eq: $id } } }
      sort: { order: ASC, fields: position }
    ) {
      nodes {
        ...CategoryDetails
      }
    }
    siblingCategories: allDatoCmsCategory(
      filter: { treeParent: { id: { eq: $parentId } } }
      sort: { order: ASC, fields: position }
    ) {
      nodes {
        ...CategoryDetails
      }
    }
    skus: allDatoCmsSku(
      filter: { category: { id: { eq: $id } } }
      sort: { fields: code, order: ASC }
    ) {
      nodes {
        id
        code
        name
        slug
        locale
      }
    }
  }

  fragment CategoryDetails on DatoCmsCategory {
    id
    name
    position
    slug
  }
`;