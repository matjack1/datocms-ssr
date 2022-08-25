import React from "react";
import { graphql } from "gatsby";
import { Box, Heading, Container } from "theme-ui";
import Nav from "../components/nav";
import ProductCollection from "../components/productCollection";
import CategoriesTabLink from "../components/categoriesTabLink";
import Breadcrumbs from "../components/breadcrumbs";
import Layout from "../components/layout";

const CategoryPage = ({
  data: { category, childCategories, siblingCategories, skus },
}) => {
  const categories =
    childCategories.nodes.length > 0
      ? childCategories.nodes
      : siblingCategories.nodes;

  return (
    <Layout>
      <Container>
        <Breadcrumbs page={category} />
        <ProductCollection
          category={category}
          categories={categories}
          skus={skus.nodes}
        />
      </Container>
    </Layout>
  );
};

export default CategoryPage;

export const query = graphql`
  query CategoryPageQuery($id: String!, $parentId: String!, $ids: [String]!) {
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
      filter: { category: { id: { in: $ids } } }
      sort: { fields: code, order: ASC }
    ) {
      nodes {
        id
        code
        name
        slug
        locale
        size
        gloveType
        pallet
        packaging
        ecolabel
        biodegradable
        haccp
        sanitizer
        detergentType
        detergentUsage
      }
    }
  }

  fragment CategoryDetails on DatoCmsCategory {
    id
    name
    position
    slug
    locale
    model {
      apiKey
    }
    treeChildren {
      id
      treeChildren {
        id
      }
    }
    root
    treeParent {
      id
      name
      slug
      root
      locale
      treeParent {
        id
        name
        slug
        root
        locale
      }
    }
  }
`;
