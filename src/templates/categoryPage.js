import React from "react";
import { graphql } from "gatsby";
import ProductCollection from "../components/productCollection";
import Layout from "../components/layout";

const CategoryPage = ({
  data: { category, childCategories, siblingCategories, skus },
}) => {
  const categories =
    childCategories.nodes.length > 0
      ? childCategories.nodes
      : siblingCategories.nodes;

  console.log(skus);

  return (
    <Layout>
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
        packaging
        ecolabel
        biodegradable
        haccp
        sanitizer
        detergentType
        detergentUsage
        images {
          url
          gatsbyImageData(
            width: 670
            height: 670
            placeholder: BLURRED
            forceBlurhash: false
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
