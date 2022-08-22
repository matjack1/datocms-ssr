import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Container, Heading } from "theme-ui";
import CustomerContext from "../hooks/customerContext";
import { buildClient } from "@datocms/cma-client-browser";
import { InboundLink } from "./link";
import { getProductPath } from "../utils/path";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const RecentlyViewedSkus = () => {
  const client = buildClient({ apiToken: "7f672cb51a4f9c2dce0c59b466b8c6" });
  const { customer, setCustomer } = useContext(CustomerContext);
  const [skus, setSkus] = useState([]);
  const [current, setCurrent] = useState(1);

  //TODO FIX
  const handleArrowIndex = (index) => {
    console.log("console",(current + 1) % skus.length)
    if (index > 0) {
      setCurrent((current + 1) % skus.length);
      return;
    }
    setCurrent((current - 1) % skus.length);
  };

  useEffect(() => {
    const selector = `.recently-viewed-box:nth-child(${current + 1})`;
    const box = document.querySelector(selector);
    if (box)
      box.scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
  }, [current]);

  const handleGetSkus = async () => {
    console.log("customer", customer);
    const records = await client.items.list({
      filter: {
        type: "313716",
        fields: {
          code: {
            in: customer.metadata.recentlyViewed,
          },
        },
      },
    });

    records.sort(function (a, b) {
      return (
        customer.metadata.recentlyViewed.indexOf(a.code) -
        customer.metadata.recentlyViewed.indexOf(b.code)
      );
    });

    setSkus(records);
  };

  useEffect(() => {
    if (customer) handleGetSkus();
  }, [customer]);

  return skus.length > 0 ? (
    <Box>
      <Container>
        <Heading as="h2" variant="h2" sx={{ my: [0], fontWeight: "600" }}>
          Continua ad acquistare
        </Heading>
      </Container>
      {/* to do hide on first one */}
      <Button
        sx={{ backgroundColor: current != 1 ? "black" : "red" }}
        onClick={() => handleArrowIndex(-1)}
      >
        <FiChevronLeft color={"white"} />
      </Button>
      <Box
        sx={{
          mt: [6],
          display: "flex",
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
        <Box
          sx={{
            width: "100%",
            verticalAlign: "top",
            display: "inline-flex",
            paddingTop: "10px",
            paddingBottom: "40px",
          }}
        >
          {skus.map((sku, index) => (
            <Box
              className={`recently-viewed-box`}
              sx={{
                scrollSnapCoordinate: "left",
                scrollSnapAlign: "start",
                maxHeight: ["290px"],
                minWidth: ["290px"],
                minHeight: ["290px"],
                minWidth: ["290px"],
                mr: [3],
              }}
            >
              <Box
                sx={{
                  backgroundColor: "Grey",
                  maxHeight: ["290px"],
                  minWidth: ["290px"],
                  minHeight: ["290px"],
                  minWidth: ["290px"],
                  width: "290px",
                  display: "flex",
                  mr: [3],
                  transform: "translateX(calc(max(1280px, 100vw)/2 - 605px))",
                }}
              >
                <InboundLink
                  to={getProductPath(sku)}
                  sx={{
                    display: "inline-block",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {sku.code}
                </InboundLink>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      {/* to do hide on last one */}
      <Button
        sx={{ backgroundColor: current != skus.length ? "black" : "red" }}
        onClick={() => handleArrowIndex(1)}
      >
        <FiChevronRight color={"white"} />
      </Button>
    </Box>
  ) : null;
};

export default RecentlyViewedSkus;
