import React from "react";
import { graphql } from "gatsby";
import ProductCollection from "../components/productCollection";
import Layout from "../components/layout";
import { Helmet } from "react-helmet";
import RichContentStructuredText from "../components/richContentStructuredText";
import Breadcrumbs from "../components/breadcrumbs";
import { Box, Container } from "theme-ui";

const Page = ({ data: { page } }) => {
  return (
    <Layout>
      <Helmet>
        <title>{page.title} | Socaf</title>
      </Helmet>
      <Container>
        <Box sx={{ pb: [4] }}>
          <Breadcrumbs page={page} />
        </Box>
        <RichContentStructuredText />
      </Container>
    </Layout>
  );
};

export default Page;

export const query = graphql`
  query PageQuery($id: String!) {
    site: datoCmsSite {
      locales
    }
    page: datoCmsPage(id: { eq: $id }) {
      title
      shortTitle
      subtitle
      body {
        blocks
        value
      }
      locale
      model {
        apiKey
      }
    }
  }
`;
