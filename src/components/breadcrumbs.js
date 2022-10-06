import React from "react";
import { Box, Flex } from "@theme-ui/components";
import { InboundLink } from "./link";
import { getHomePath, getCategoryPath, getPagePath } from "../utils/path";

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
      <Item color="lightBorder">{page.name}</Item>
    </List>
  );

  const ServiceBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink color="dark" to={getHomePath(page.locale)}>
          Home
        </InboundLink>
      </Item>
      <Item>Servizi</Item>
      <Item color="lightBorder">{page.title}</Item>
    </List>
  );

  const SectorBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink color="dark" to={getHomePath(page.locale)}>
          Home
        </InboundLink>
      </Item>
      <Item>Settori</Item>
      <Item color="lightBorder">{page.title}</Item>
    </List>
  );

  const NewsBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink color="dark" to={getHomePath(page.locale)}>
          Home
        </InboundLink>
      </Item>
      <Item color="lightBorder">{page.title}</Item>
    </List>
  );

  const PageBreadcrumbs = ({ page }) => (
    <List>
      <Item>
        <InboundLink color="dark" to={getHomePath(page.locale)}>
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
      <Item color="lightBorder">{page.title}</Item>
    </List>
  );

  return renderSwitch(page);
};

const List = (props) => {
  return (
    <Flex
      {...props}
      sx={{
        flexDirection: ["row", "row", "row"],
        flexWrap: "wrap",
        margin: 0,
        padding: 0,
        listStyle: "none",
        a: {
          textDecoration: "none",
          color: "dark",
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
        a: {
          fontWeight: "600",
        },
        marginRight: 2,
        "&::after": {
          content: '">"',
          color: "dark",
          fontWeight: "600",
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
