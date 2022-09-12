import React, { useEffect } from "react";
import { Box, Flex } from "theme-ui";
import { InboundLink } from "./link";
import { getCategoryPath } from "../utils/path";

const ProductCollectionCategories = ({ categories }) => {
  useEffect(() => {
    if (typeof window != "undefined" && window.document && document.querySelector(".css-1rhieuf-Box.active")) {
      document.querySelector(".css-1rhieuf-Box.active").scrollIntoView({
        block: "nearest",
        inline: "center",
      });
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          my: [3],
          top: "0",
          zIndex: 999999,
          // position: "sticky",
          display: ["flex", "flex", "none", "none"],
          overflow: "auto",
          scrollSnapType: "x mandatory",
          ".item": {
            flexShrink: 0,
            scrollSnapAlign: "start",
          },
          "&::-webkit-scrollbar": {
            width: "1em",
          },

          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0)",
            outline: "1px solid rgba(0, 0, 0, 0)",
          },
        }}
      >
        {categories.map((category, index) => (
          <Box className="item">
            <InboundLink
              to={getCategoryPath(category, category.locale)}
              variant="links.badge.category"
              sx={{
                fontWeight: "600",
                textDecoration: "none",
                color: "dark",
                mx: [4],
                "&.active": {
                  textDecoration: "underline",
                },
              }}
            >
              {category.name}
            </InboundLink>
          </Box>
        ))}
      </Box>

      <Box
        as="ul"
        variant="ul"
        sx={{
          display: ["none", "none", "block", "block"],
          listStyle: "none",
          pl: [0],
        }}
      >
        {categories.map((category, index) => (
          <Box
            as="li"
            key={category.id}
            sx={{
              pb: [3],
            }}
          >
            <InboundLink
              to={getCategoryPath(category, category.locale)}
              sx={{
                fontWeight: "600",
                textDecoration: "none",
                color: "dark",
                "&.active": {
                  textDecoration: "underline",
                },
              }}
            >
              {category.name}
            </InboundLink>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          borderBottom: ["1px solid", "1px solid", "1px solid"],
          borderColor: "lightBorder",
          pt: [1],
          mb: [4],
        }}
      />
    </>
  );
};

export default ProductCollectionCategories;
