import { Router } from "@reach/router";
import { graphql } from "gatsby";
import React from "react";
import { Box, Heading } from "theme-ui";
import CategoriesTabLink from "../components/categoriesTabLink";
import Nav from "../components/nav";
import ForgotPassword from "./forgot-password.js";
import ResetPassword from "./reset-password.js";
import RecentlyViewedSkus from "../components/recentlyViewedSkus";
import Layout from "../components/layout";
import LatestOrders from "../components/latestOrders";
import FeaturedProduct from "../components/featuredProduct";

const IndexPage = ({ data: { page, categories } }) => {
  console.log(categories);
  return (
    <Layout>
      <LatestOrders />
      <RecentlyViewedSkus />
      {page.content.map((block) => (
        <Box as="section" key={block.id}>
          {block.model.apiKey === "featured_product" && (
            <FeaturedProduct data={block} />
          )}
        </Box>
      ))}
      <CategoriesTabLink categories={categories.nodes[0].treeChildren} />
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query HomePageQuery {
    page: datoCmsHomePage {
      content {
        ... on DatoCmsFeaturedProduct {
          id
          title
          productName
          product {
            id
            slug
            name
            images {
              gatsbyImageData(
                placeholder: NONE
                forceBlurhash: false
                imgixParams: {
                  blendColor: "#212C30"
                  blendMode: "multiply"
                  blendAlpha: 30
                }
              )
            }
          }
          model {
            apiKey
          }
        }
      }
    }
    categories: allDatoCmsCategory(
      filter: { root: { eq: true } }
      sort: { order: ASC, fields: position }
    ) {
      nodes {
        ...CategoryDetails
        treeChildren {
          ...CategoryDetails
          treeChildren {
            ...CategoryDetails
          }
        }
      }
    }
  }
`;
