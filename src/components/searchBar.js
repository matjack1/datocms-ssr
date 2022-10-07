import React, { useRef, useState, useEffect } from "react";
import { Box, Button} from "theme-ui";
import { getColor } from "@theme-ui/color";
import themeUiTheme from "../gatsby-plugin-theme-ui";
import Search from "../assets/img/icons/nessun-risultato.inline.svg";
import { i18nContext } from "../hooks/i18nContext";
import BouncingDotsLoader from "../components/bouncingDotsLoader";
import { connectSearchBox } from "react-instantsearch-dom";
import { navigate } from "@reach/router";

const CustomSearchBox = ({
  currentRefinement,
  isSearchStalled,
  refine,
  submit,
}) => {
  const [currentDefaultQuery, setCurrentDefaultQuery] = useState(null);
  const inputReference = useRef();

  useEffect(() => {
    inputReference.current.focus();
    if (currentRefinement) {
      setCurrentDefaultQuery(currentRefinement);
    }
  }, []);
  const dark = getColor(themeUiTheme, `dark`);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    refine();
    setTimeout(() => {
      refine(e.target.search_input.value);
    }, 100);
  };

  return (
    <Box
      as="form"
      noValidate
      action=""
      role="search"
      name="search-form-page"
      sx={{ position: "relative", height: "100%", width: "100%" }}
      onSubmit={handleFormSubmit}
    >
      <Button
        type="submit"
        variant="buttons.primaryTransparent"
        sx={{
          position: "absolute",
          px: [3],
          top: "50%",
          zIndex: 222,
          right: [0],
          transform: "translateY(-50%)",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          backgroundColor:"transparent",
          color:"dark",
          svg: {
            height: "24px!important",
          },
        }}
        disabled={isSearchStalled}
      >
        {isSearchStalled ? (
          <BouncingDotsLoader color={"primary"} />
        ) : (
          <Search color={dark} />
        )}
      </Button>
      <i18nContext.Consumer>
        {(t) => (
          <Box
            as="input"
            type="text"
            name="search_input"
            placeholder={"Ricerca"}
            sx={{
              "&::placeholder, &:-ms-input-placeholder,&::-ms-input-placeholder":
                {
                  color: "dark",
                },
              width: "100%",
              fontSize: [1, 2],
              py: [2],
              pl: [7],
              pr: [9],
              border: "unset",
              borderRight: "1px solid",
              borderColor: "dark",
              background: "transparent",
              color: "dark",
              position: "relative",
              ":focus": {
                outline: "none",
              },
            }}
            ref={inputReference}
            defaultValue={currentDefaultQuery}
            required
          />
        )}
      </i18nContext.Consumer>
    </Box>
  );
};

const CustomSearchBoxWrapper = connectSearchBox(CustomSearchBox);

const SearchBar = ({ title }) => {
  return (
    <Box sx={{ width: "100%", minWidth: ["80%", "350px"], height: "100%" }}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          form: {
            display: "flex",
          },
        }}
      >
        {title === "cerca" || title === "search" ? (
          <CustomSearchBoxWrapper
            reset={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 18 18"
              >
                <g
                  fill="none"
                  fillRule="evenodd"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.67"
                  transform="translate(1 1)"
                >
                  <circle cx="7.11" cy="7.11" r="7.11" />
                  <path d="M16 16l-3.87-3.87" />
                </g>
              </svg>
            }
            submit={"SUBMIT"}
          />
        ) : (
          <ExternalSearchBox />
        )}
      </Box>
    </Box>
  );
};

const ExternalSearchBox = ({}) => {
  const inputReference = useRef();

  useEffect(() => {
    // inputReference.current.focus();
  }, []);
  const dark = getColor(themeUiTheme, `dark`);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate(
      `/cerca/?page=1&query=${encodeURIComponent(e.target.search_input.value)}`
    );
  };

  return (
    <Box
      as="form"
      noValidate
      action=""
      role="search"
      name="search-form-page"
      sx={{ position: "relative", height: "100%", width: "100%" }}
      onSubmit={handleFormSubmit}
    >
      <Box
        sx={{
          position: "absolute",
          px: [3],
          top: "50%",
          zIndex: 222,
          right: [0],
          transform: "translateY(-50%)",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          svg: {
            height: "24px!important",
          },
        }}
      >
        <Search color={dark} />
      </Box>
      <i18nContext.Consumer>
        {(t) => (
          <Box
            as="input"
            type="text"
            name="search_input"
            placeholder={"Ricerca"}
            sx={{
              "&::placeholder, &:-ms-input-placeholder,&::-ms-input-placeholder":
                {
                  color: "dark",
                },
              width: "100%",
              fontSize: [1, 2],
              py: [2],
              pl: [7],
              pr: [9],
              border: "unset",
              borderRight: "1px solid",
              borderColor: "dark",
              background: "transparent",
              color: "dark",
              position: "relative",
              ":focus": {
                outline: "none",
              },
            }}
            ref={inputReference}
            required
          />
        )}
      </i18nContext.Consumer>
    </Box>
  );
};

export default SearchBar;
