import React from "react";
import { Box, Flex } from "@theme-ui/components";
import { InboundLink, OutboundLink } from "./link";
import {
  getArticleCategoryPath,
  getNewsPath,
  getHomePath,
  getCategoryPath,
  getReferencesPath,
  getPagePath,
  getCategoryFamilyPath,
} from "../utils/path";

const Breadcrumbs = ({
  page,
  productCategory = undefined,
  familyCategory = undefined,
  familyCategories = undefined,
  pageContext = undefined,
}) => {
  function renderSwitch(page) {
    switch (page.model.apiKey) {
      case "sku":
        return <ProductBreadcrumbs page={page} />;
      case "category":
        return <CategoryBreadcrumbs page={page} />;
      case "service":
        return <ServiceBreadcrumbs page={page} />;
      case "sector":
        return <SectorBreadcrumbs page={page} />;
      case "article":
        return <ArticleBreadcrumbs page={page} />;
      case "reference":
        return <ReferenceBreadcrumbs page={page} />;
      default:
        return <PageBreadcrumbs page={page} />;
    }
  }

  const ProductBreadcrumbs = ({ page }) => {
    const familyCategory = page.category.treeParent;
    const pageCategory = page.category;

    return (
      <List>
        <Item>
          <InboundLink color="secondary" to={getHomePath(page.locale)}>
            Home
          </InboundLink>
        </Item>
        {familyCategory && (
          <Item>
            <InboundLink to={getCategoryPath(familyCategory)}>
              {familyCategory.name}
            </InboundLink>
          </Item>
        )}
        {pageCategory && (
          <Item>
            <InboundLink color="secondary" to={getCategoryPath(pageCategory)}>
              {pageCategory.name}
            </InboundLink>
          </Item>
        )}
      </List>
    );
  };

  const CategoryBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink color="secondary" to={getHomePath(page.locale)}>
          Home
        </InboundLink>
      </Item>
      {page.treeParent && page.treeParent.treeParent && (
        <Item>
          <InboundLink to={getCategoryPath(page.treeParent)}>
            {page.treeParent.name}
          </InboundLink>
        </Item>
      )}
      <Item color="primary">{page.name}</Item>
    </List>
  );

  const ServiceBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink color="primary" to={getHomePath(page.locale)}>
          Home
        </InboundLink>
      </Item>
      <Item>Servizi</Item>
      <Item color="primary">{page.title}</Item>
    </List>
  );

  const SectorBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink color="primary" to={getHomePath(page.locale)}>
          Home
        </InboundLink>
      </Item>
      <Item>Settori</Item>
      <Item color="primary">{page.title}</Item>
    </List>
  );

  const NewsBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink color="primary" to={getHomePath(page.locale)}>
          Home
        </InboundLink>
      </Item>
      <Item color="primary">{page.title}</Item>
    </List>
  );

  const PageBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink color="primary" to={getHomePath(page.locale)}>
          Home
        </InboundLink>
      </Item>
      {page.treeParent && page.treeParent.treeParent && (
        <Item>
          <InboundLink to={getPagePath(page.treeParent.treeParent)}>
            {page.treeParent.treeParent.title ||
              page.treeParent.treeParent.name}
          </InboundLink>
        </Item>
      )}
      {page.treeParent && (
        <Item>
          <InboundLink to={getPagePath(page.treeParent)}>
            {page.treeParent.title}
          </InboundLink>
        </Item>
      )}
      <Item color="primary">{page.title}</Item>
    </List>
  );

  const ArticleBreadcrumbs = ({ page, pageContext }) => (
    <List>
      <Item>
        <InboundLink to={getHomePath(page.locale)}>Home</InboundLink>
      </Item>
      <Item>
        <InboundLink to={getNewsPath(page.locale)}>News</InboundLink>
      </Item>
      {page.category && (
        <Item>
          <InboundLink to={getArticleCategoryPath(page.category, page.locale)}>
            {page.category.title}
          </InboundLink>
        </Item>
      )}
    </List>
  );

  const ReferenceBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink to={getHomePath(page.locale)}>Home</InboundLink>
      </Item>
      <Item>
        <InboundLink to={getReferencesPath(page.locale)}>Referenze</InboundLink>
      </Item>
    </List>
  );

  return renderSwitch(page);
};

const List = (props) => {
  return (
    <Flex
      {...props}
      sx={{
        flexDirection: ["column", "row"],
        margin: 0,
        padding: 0,
        listStyle: "none",
        a: {
          textDecoration: "none",
          color: "primary",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      }}
      as="ul"
    />
  );
};

const Item = (props) => {
  return (
    <Box
      {...props}
      sx={{
        marginRight: 2,
        "&::after": {
          content: '"/"',
          color: "primary",
          marginLeft: 2,
          display: ["inline"],
        },
        "&:last-child": {
          marginRight: 0,
          "&::after": {
            display: "none",
          },
        },
      }}
      as="li"
    />
  );
};

export default Breadcrumbs;
