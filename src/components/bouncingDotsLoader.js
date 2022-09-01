import React from "react";
import { Box } from "theme-ui";

const BouncingDotsLoader = (props) => {
  return (
    <Box
      className="bouncing-loader"
      sx={{
        minHeight:["21px"],
        display: "flex", justifyContent: "center" ,
        "& > div": {
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "light",
          opacity: 1,
          animation: "bouncing-loader 0.6s infinite alternate",
        },
        "@keyframes bouncing-loader": {
          to: { transform: "translateY(12px)" },
        },
      }}
    >
      <Box></Box>
    </Box>
  );
};

export default BouncingDotsLoader;
