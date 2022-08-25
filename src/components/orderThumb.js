import React from "react";
import { Box, Flex, Grid, Heading, Text } from "theme-ui";
import { InboundLink } from "./link";
import { GatsbyImage } from "gatsby-plugin-image";

const OrderThumb = ({ order }) => {
  return (
    <Box>
      <InboundLink
        sx={{
          color: "dark",
          display: "inline-block",
          textDecoration: "none",
          borderColor: "lightBorder",
          width: "100%",
        }}
        to={`/account/orders/${order.id}`}
      >
        <Grid gap={[10]} columns={["167px auto"]}>
          <Box sx={{ border: "1px solid", minWidth:"166px", minHeight:"166px", borderColor: "lightBorder" }}>
            {(order.image && order.image.length > 0) ||
            (order.images && order.images.length > 0) ? (
              <GatsbyImage
                image={
                  order.image
                    ? order.image.gatsbyImageData
                    : order.images[0].gatsbyImageData
                }
                alt={
                  order.image
                    ? order.image.gatsbyImageData
                    : order.images[0].gatsbyImageData
                }
              />
            ) : (
              <Box
                sx={{
                  backgroundColor: "light",
                }}
              />
            )}
          </Box>

          <Box>
            <Flex
              sx={{
                alignItems: "start",
                justifyContent: "space-between",
                pb: [5],
              }}
            >
              <Box>
                <Text sx={{ fontSize: [4] }}>
                  Ordine{" "}
                  <Box as="span" sx={{ fontWeight: 600 }}>
                    #{order.number}
                  </Box>
                </Text>
              </Box>
              <Box
                sx={{
                  fontSize: [4],
                  alignItems: "center",
                  fontWeight: "600",
                }}
              >
                <Box>{order.formatted_total_amount_with_taxes}</Box>
              </Box>
            </Flex>
            <Box sx={{ fontSize: [2], pb:[5],color: "lightBorder" }}>
              {new Date(order.placed_at).toLocaleDateString("it-IT", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Box>
            <Grid
              columns={["20px auto"]}
              gap={[0]}
              sx={{
                fontSize: [2],
                alignItems: "center",
                color: "lightBorder",
              }}
            >
              <Flex sx={{ alignItems: "center", justifyContent: "start" }}>
                <Box
                  sx={{
                    borderRadius: "50%",
                    backgroundColor: "green",
                    width: "7px",
                    height: "7px",
                  }}
                />
              </Flex>
              {order.status}
            </Grid>
          </Box>
        </Grid>
      </InboundLink>
    </Box>
  );
};

export default OrderThumb;