import React from "react";
import { Box, Text } from "theme-ui";

const ThumbProductDetails = ({ item, children }) => {
  return (
    item && (
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
        {item.size && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>Taglia</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.size}</Box>
            </Box>
          </Box>
        )}

        {item.pallet && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>Pallet</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.pallet}</Box>
            </Box>
          </Box>
        )}

        {item.glove_type && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>Guanto</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.glove_type}</Box>
            </Box>
          </Box>
        )}

        {item.pack && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>Confezione</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.pack}</Box>
            </Box>
          </Box>
        )}

        {/* {item.packaging && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>Imballaggio</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.packaging}</Box>
            </Box>
          </Box>
        )} */}

        {item.ecolabel && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>Ecolabel</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.ecolabel}</Box>
            </Box>
          </Box>
        )}

        {item.biodegradable && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>BIOdegradabile</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.biodegradable}</Box>
            </Box>
          </Box>
        )}

        {item.sanitizer && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>Disinfettante</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.sanitizer}</Box>
            </Box>
          </Box>
        )}

        {item.haccp && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>HACCP</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.haccp}</Box>
            </Box>
          </Box>
        )}

        {item.detergent_type && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>Tipo di detergente</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.detergent_type}</Box>
            </Box>
          </Box>
        )}

        {item.detergent_usage && (
          <Box as="tr">
            <Box as="td" sx={{ textAlign: "left" }}>
              <Box>Uso del detergente</Box>
            </Box>
            <Box as="td">
              <Box sx={{ ml: [4] }}>{item.detergent_usage}</Box>
            </Box>
          </Box>
        )}
      </Box>
    )
  );
};

export default ThumbProductDetails;
