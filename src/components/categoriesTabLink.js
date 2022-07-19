import React from "react";
import { Box } from "theme-ui";
import { InboundLink } from "./link";
import { getCategoryPath } from "../utils/path";

const CategoriesTabLink = ({ categories }) => {
  // console.log(categories);
  return (
    <Box>
      {categories.map((category) => (
        <Box key={category.id}>
          <InboundLink to={getCategoryPath(category,category.locale)}>{category.name}</InboundLink>
        </Box>
      ))}
    </Box>
  );
};

export default CategoriesTabLink;
