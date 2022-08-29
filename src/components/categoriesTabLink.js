import React from "react";
import { Box, Container, Heading } from "theme-ui";
import { InboundLink } from "./link";
import { getCategoryPath } from "../utils/path";
import CustomCarousel from "./customCarousel";

const CategoriesTabLink = ({ categories }) => {
  // console.log(categories);
  return (
    <Box>
      {categories.map((category) => (
        <Box key={category.id}>
          <Container>
            <Heading as="h2" variant="h2" sx={{my:[6]}}>
              <InboundLink to={getCategoryPath(category, category.locale)}>
                {category.name}
              </InboundLink>
            </Heading>
          </Container>
          <CustomCarousel data={category.treeChildren} type="category" />
        </Box>
      ))}
    </Box>
  );
};

export default CategoriesTabLink;
