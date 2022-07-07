import React from "react";
import { Box } from "theme-ui";
import { InboundLink } from "./link";

const CategoriesTabLink = ({ categories }) => {
  // console.log(categories);
  return (
    <Box>
      {categories.map((category) => (
        <Box key={category.id}>
          <InboundLink to={category.slug}>{category.name}</InboundLink>
        </Box>
      ))}
    </Box>
  );
};

export default CategoriesTabLink;
