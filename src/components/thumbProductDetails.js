import React from "react";
import { Box, Text } from "theme-ui";
import { i18nContext } from "../hooks/i18nContext";

const ThumbProductDetails = ({ item, children }) => {
  return (
    item && (
      <i18nContext.Consumer>
        {(t) => (
          <>
            <Box
              as="table"
              sx={{
                tr: {
                  p: [0],
                  "td:first-child": {
                    textAlign: "left",
                    verticalAlign: "middle",
                    color: "lightBorder",
                  },
                  td: {
                    fontSize: [1, 2],
                    fontWeight: "400",
                    pb: [2],
                  },
                },
              }}
            >
              {children}
              {item.brand && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.brand}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{item.brand}</Box>
                  </Box>
                </Box>
              )}

              {item.size && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.size}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{item.size}</Box>
                  </Box>
                </Box>
              )}

              {item.pallet && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.pallet}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{item.pallet}</Box>
                  </Box>
                </Box>
              )}

              {(item.glove_type ||
                item.gloveType) && (
                  <Box as="tr">
                    <Box as="td" sx={{ textAlign: "left" }}>
                      <Box>{t.gloveType}</Box>
                    </Box>
                    <Box as="td">
                      <Box sx={{ ml: [4] }}>
                        {item.glove_type || item.gloveType}
                      </Box>
                    </Box>
                  </Box>
                )}

              {item.pack && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.pack}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{item.pack}</Box>
                  </Box>
                </Box>
              )}

              {item.ecolabel && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.ecolabel}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{item.ecolabel}</Box>
                  </Box>
                </Box>
              )}

              {item.biodegradable && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.biodegradable}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{item.biodegradable}</Box>
                  </Box>
                </Box>
              )}

              {item.sanitizer && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.sanitizer}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{item.sanitizer}</Box>
                  </Box>
                </Box>
              )}

              {item.haccp && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.haccp}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>{item.haccp}</Box>
                  </Box>
                </Box>
              )}

              {(item.detergent_type || item.detergentType) && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.detergentType}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>
                      {item.detergent_type || item.detergentType}
                    </Box>
                  </Box>
                </Box>
              )}

              {(item.detergent_usage || item.detergentUsage) && (
                <Box as="tr">
                  <Box as="td" sx={{ textAlign: "left" }}>
                    <Box>{t.detergentUsage}</Box>
                  </Box>
                  <Box as="td">
                    <Box sx={{ ml: [4] }}>
                      {item.detergent_usage || item.detergentUsage}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </>
        )}
      </i18nContext.Consumer>
    )
  );
};

export default ThumbProductDetails;
