import React from "react";
import { graphql } from "gatsby";
import ProductCollection from "../components/productCollection";
import Layout from "../components/layout";
import { Helmet } from "react-helmet";

const CategoryPage = ({
  data: { category, childCategories, siblingCategories, skus },
}) => {
  const categories =
    childCategories.nodes.length > 0
      ? childCategories.nodes
      : siblingCategories.nodes;

  return (
    <Layout>
      <Helmet>
        <title>{category && category.name} | Socaf</title>
      </Helmet>
      <ProductCollection
        category={category}
        categories={categories}
        skus={skus.nodes}
      />
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
        ecolabel
        biodegradable
        haccp
        sanitizer
        detergentType
        detergentUsage
        ranking
        pack
        brand
        material
        images {
          url(imgixParams: { ar: "1:1", fit: "crop", w: "600", h: "600" })
          gatsbyImageData(
            width: 800
            height: 800
            placeholder: BLURRED
            forceBlurhash: false
            imgixParams: { ar: "1:1", fit: "crop" }
          )
        }
      }
    }
  }

  fragment CategoryDetails on DatoCmsCategory {
    id
    name
    position
    slug
    locale
    image {
      url
      gatsbyImageData(
        width: 500
        height: 500
        placeholder: BLURRED
        forceBlurhash: false
      )
    }
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
