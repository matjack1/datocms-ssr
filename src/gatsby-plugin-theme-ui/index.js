const theme = {
  colors: {
    text: "#151515",
    background: "#ffffff",
    lightBackground: "#fafafa",
    primary: "#EA0029",
    secondary: "#0085C7",
    light: "#ffffff",
    lighter: "rgba(255,255,255,0.5)",
    darkBlend: "rgba(19,30,38,0.6)",
    dark: "#151515",
    Grey: "#F2F2F2",
    lightGrey: "#F8F8F9",
  },
  fonts: {
    body: '"bc-novatica-cyr", Arial, system-ui, -apple-system, "Helvetica Neue", sans-serif',
    heading:
      '"bc-novatica-cyr", Arial, system-ui, -apple-system, "Helvetica Neue", sans-serif',
  },
  space: [
    0, 4, 8, 16, 20, 25, 32, 36, 40, 48, 50, 64, 96, 128, 164, 192, 256, 320,
    384, 448, 512,
  ],
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 700,
  },
  lineHeights: {
    body: 1.43,
    heading: 1.125,
  },
  sizes: {
    container: 1280,
  },
  radius: {
    none: "0",
    xs: ".25rem",
    sm: ".5rem",
    md: "1rem",
    lg: "2rem",
    full: "9999px",
  },
  shadows: {
    none: "none",
    default:
      "0 20px 40px -10px rgba(50,50,93,0.15),0 10px 30px -20px rgba(0,0,0,0.15)",
  },
  text: {
    default: {
      lineHeight: "body",
    },
    heading: {
      fontSize: [5],
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: "heading",
      color: "primary",
    },
    h1: {
      fontSize: [5, 7],
      fontFamily: "heading",
      lineHeight: ["heading", "52px"],
      fontWeight: "heading",
      color: "text",
      mb: 3,
    },
    h2: {
      fontSize: [4, 5],
      fontFamily: "heading",
      lineHeight: [1.2, "48px"],
      fontWeight: 300,
      color: "text",
      mb: 3,
      mt: 4,
    },
    h3: {
      fontSize: [4, 5],
      fontFamily: "heading",
      lineHeight: "heading",
      fontWeight: 300,
      color: "text",
      mb: 3,
      mt: 4,
    },
    h4: {
      fontSize: [4],
      fontWeight: 300,
      color: "text",
      mb: 2,
      mt: 4,
    },
    h5: {
      fontSize: 3,
      color: "dark",
      fontWeight: "body",
      lineHeight: "heading",
      mb: 2,
      mt: 4,
    },
    h6: {
      fontSize: 2,
      color: "dark",
      fontWeight: "body",
      lineHeight: "heading",
      mb: 2,
      mt: 4,
    },
    caption: {
      fontSize: 0,
      color: "lightGrey",
      fontWeight: "bold",
    },
    article: {
      fontSize: 3,
      lineHeight: 1.4,
    },
    p: {
      fontWeight: 400,
      fontSize: [2],
      lineHeight: 1.43,
    },
    sectionTitle: {
      "h3,h2": {
        margin: "inherit",
        fontFamily: "heading",
        fontSize: [6],
        lineHeight: "1.2",
        fontWeight: 300,
        em: {
          fontStyle: "normal",
          color: "dark",
        },
        position: "relative",
        pt: [3],
        pb: [4],
        "&::after": {
          content: "''",
          backgroundColor: "primary",
          position: "absolute",
          top: [0],
          left: [0],
          height: "5px",
          width: "25px",
        },
      },
      h3: {
        margin: "inherit",
        fontFamily: "heading",
        fontSize: [4, 5],
        lineHeight: "1.2",
        fontWeight: 300,
        em: {
          fontStyle: "normal",
          color: "dark",
        },
        position: "relative",
        pt: [3],
        pb: [4],
        "&::after": {
          content: "''",
          backgroundColor: "primary",
          position: "absolute",
          top: [0],
          left: [0],
          height: "5px",
          width: "25px",
        },
      },
      "> div": {
        borderBottom: "1px solid",
        borderColor: "dark",
      },
      "> div.light": {
        borderBottom: "1px solid",
        borderColor: "light",
      },
      span: {
        display: "block",
        pb: [3],
      },
      p: {
        margin: "inherit",
        fontSize: [1],
        letterSpacing: "2px",
        lineHeight: "1.4",
        em: {
          fontStyle: "normal",
          color: "primary",
        },
      },
      ul: {
        p: 0,
        listStyleType: "none",
        margin: "inherit",
        fontSize: [1],
        letterSpacing: "2px",
        lineHeight: "1.7",
        em: {
          fontStyle: "normal",
          color: "dark",
        },
        ml: [1],
        li: {
          color: "dark",
          position: "relative",
          "span:before": {
            content: "'//'",
            color: "dark",
            ml: [1],
            position: "absolute",
            left: [-3, -4, -4, -4],
          },
        },
      },
    },
  },
  layout: {
    container: {
      padding: [5, 6],
    },
    sm: {
      maxWidth: "720px",
      padding: [5, 6],
    },
    md: {
      maxWidth: "1020px",
      padding: [5, 6],
    },
    lg: {
      padding: [5, 6],
    },
    fw: {
      maxWidth: "100%",
      padding: [5, 6],
    },
    header: {
      maxWidth: "100%",
    },
    oneSideRight: {
      maxWidth: [
        "calc(((100% - 750px) / 2) + 750px) ",
        "calc(((100% - 970px) / 2) + 970px)",
        "calc(((100% - 1280px) / 2) + 1280px)",
      ],
      mr: ["auto", 0, 0, 0],
      pl: [5, 6],
    },
  },
  svg: {
    arrow: {
      primary: {
        svg: {
          circle: {
            stroke: "primary",
            strokeWidth: "2px",
          },
          use: {
            fill: "primary",
          },
          "g#Group": {
            fill: "primary",
          },
        },
      },
      dark: {
        svg: {
          circle: {
            stroke: "dark",
            strokeWidth: "2px",
          },
          use: {
            fill: "dark",
          },
          "g#Group": {
            fill: "dark",
          },
        },
      },
      light: {
        svg: {
          circle: {
            stroke: "light",
            strokeWidth: "2px",
          },
          use: {
            fill: "light",
          },
          "g#Group": {
            fill: "light",
          },
        },
      },
    },
  },
  buttons: {
    primaryTransparent: {
      px: [3],
      py: [2],
      textDecoration: "none",
      cursor: "pointer",
      color: "light",
      "*": {
        fontSize: [1],
      },
    },
    primary: {
      px: [3],
      py: [2],
      fontSize: [1],
      textDecoration: "none",
      cursor: "pointer",
      color: "light",
      bg: "primary",
      "&:hover": {
        bg: "dark",
      },
    },
    primaryEmpty: {
      px: [3],
      py: [2],
      fontSize: [1],
      textDecoration: "none",
      cursor: "pointer",
      color: "primary",
      // "&:hover": {
      //   bg: "dark",
      // },
    },
    secondary: {
      color: "background",
      bg: "secondary",
    },
    primaryForm: {
      paddingY: 3,
      paddingX: 5,
      cursor: "pointer",
      color: "primary",
      bg: "light",
      borderRadius: "0px",
      border: "1px solid",
      borderColor: "transparent",
      "&:hover": {
        border: "1px solid",
        borderColor: "light",
        color: "light",
        bg: "primary",
        svg: {
          stroke: "light",
        },
      },
    },
    primaryFormEmpty: {
      paddingY: 2,
      paddingX: 3,
      cursor: "pointer",
      color: "light",
      borderRadius: "0px",
      border: "1px solid",
      borderColor: "dark",
      backgroundColor: "dark",
      "&:hover": {
        border: "1px solid",
        borderColor: "light",
        color: "light",
        bg: "primary",
        svg: {
          stroke: "light",
        },
      },
    },
  },
  inputs: {
    primary: {
      borderColor: "light",
      p: [3],
      border: "1px solid",
      borderRadius: "0px!important",
      cursor: "pointer",
      color: "light",
      "&:focus": {
        outline: "none",
        backgroundColor: "light",
        color: "primary",
        border: "1px solid light",
      },
      "::placeholder": {
        /* Chrome, Firefox, Opera, Safari 10.1+ */ color: "light",
        opacity: 1 /* Firefox */,
      },
    },
    dark: {
      borderColor: "dark",
      p: [3],
      border: "1px solid",
      borderRadius: "0px!important",
      cursor: "pointer",
      color: "dark",
      "&:focus": {
        outline: "none",
        backgroundColor: "dark",
        color: "white",
        border: "1px solid dark",
      },
      "::placeholder": {
        /* Chrome, Firefox, Opera, Safari 10.1+ */ color: "dark",
        opacity: 1 /* Firefox */,
      },
    },
  },
  links: {
    nav: {
      paddingX: 3,
      paddingY: 3,
      backgroundColor: "primary",
      "&.active": {
        color: "primary",
      },
    },
    tab: {
      textDecoration: "none",
      mr: 3,
      color: "text",
      "&.active": {
        color: "primary",
        fontWeight: "bold",
      },
    },
  },
  styles: {
    root: {
      "*": {
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
        "text-shadow": "1px 1px 1px rgba(0,0,0,0.004)",
      },
      fontFamily: "body",
      fontWeight: "body",
      "a,button": {
        "-webkit-transition": "background-color .2s linear",
        "-ms-transition": "background-color .2s linear",
        transition: "background-color .2s linear",
        textDecoration: "none",
        color: "primary",
        textDecoration: "underline",
        "&.active": {
          color: "primary",
          //textDecoration: "underline",
        },
        // color: "primary",
        // "&:hover": {
        //   textDecoration: "none",
        // },
      },
      "--swiper-theme-color": "#EA0029",
      ".swiper-container": { pb: 5 },
      ".oneSide": {
        p: [3, 4],
        pr: [0, 0, 0, 0],
        mr: [0, 0, 0, 0],
        ml: [" calc(50vw - 375px)", "calc(50vw - 485px)", "calc(50vw - 640px)"],
      },
    },
  },
};

export default theme;
