import { graphql } from "gatsby";
import React, { useContext } from "react";
import { Box } from "theme-ui";
import CategoriesTabLink from "../components/categoriesTabLink";
import RecentlyViewedSkus from "../components/recentlyViewedSkus";
import Layout from "../components/layout";
import LatestOrders from "../components/latestOrders";
import FeaturedProduct from "../components/featuredProduct";
import CustomerContext from "../hooks/customerContext";
import { Helmet } from "react-helmet";

const IndexPage = ({ data: { page, categories } }) => {
  console.log(categories);
  const customer = useContext(CustomerContext);
  // console.log(user);
  return (
    <Layout>
      <Helmet>
        <title>Home | SOCAF</title>
      </Helmet>
      <LatestOrders />
      <RecentlyViewedSkus />
      {/* {page.content.map((block) => (
        <Box as="section" key={block.id}>
          {block.model.apiKey === "featured_product" && (
            <FeaturedProduct data={block} />
          )}
        </Box>
      ))} */}
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
                  ar: "1:1"
                  fit: "crop"
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
