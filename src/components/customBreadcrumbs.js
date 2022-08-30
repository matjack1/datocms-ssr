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

const CustomBreadcrumbs = ({ data }) => {
  function renderSwitch(data) {
    if (data.pages.length > 0) {
      return <PageBreadcrumbs data={data} />;
    }
  }

  const PageBreadcrumbs = ({ data }) => (
    <List>
      {data.pages.map((page) => (
        <Item>
          <InboundLink color="dark" to={page.slug}>
            {page.title}
          </InboundLink>
        </Item>
      ))}
      <Item color="lightBorder">{data.current.title}</Item>
    </List>
  );

  return renderSwitch(data);
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

export default CustomBreadcrumbs;
