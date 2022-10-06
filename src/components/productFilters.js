import React, { useEffect, useState } from "react";
import { Box, Checkbox, Label, Radio, Text, Button } from "theme-ui";
import { i18nContext } from "../hooks/i18nContext";
import { useResponsiveValue, useBreakpointIndex } from "@theme-ui/match-media";

const ProductFilters = ({
  handleFiltersChange,
  handleClearFilters,
  filters,
}) => {
  const mediaIndex = useBreakpointIndex();
  const [checkAll, setCheckAll] = useState(null);
  const [checkedCounter, setCheckedCounter] = useState(0);
  useEffect(() => {
    if (checkedCounter === 0) setCheckAll(null);
  }, [checkedCounter]);

  return (
    <Box>
      <Box>
        {filters &&
          Object.keys(filters) &&
          Object.keys(filters).length > 0 &&
          Object.keys(filters).map((key, index) => (
            <>
              {filters[key] && Array.isArray(filters[key]) && (
                <>
                  <Box sx={{ pb: [3] }}>
                    <Text
                      sx={{
                        fontWeight: "600",
                        textDecoration: "none",
                        color: "dark",
                      }}
                    >
                      <i18nContext.Consumer>
                        {(t) => t[key]}
                      </i18nContext.Consumer>
                    </Text>
                  </Box>
                  {filters[key].map((filter) => (
                    <LabeledCheckbox
                      defaultChecked={checkAll}
                      checkedCheckbox={(e) => {
                        let o = {};
                        o[key] = filter;
                        e
                          ? setCheckedCounter(checkedCounter + 1)
                          : setCheckedCounter(checkedCounter - 1);
                        handleFiltersChange(e, o);
                      }}
                      required={true}
                    >
                      {filter}
                    </LabeledCheckbox>
                  ))}
                  <Box
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "lightBorder",
                      pt: [4],
                      mb: [4],
                    }}
                  />
                </>
              )}
            </>
          ))}
      </Box>
      {checkedCounter > 0 && (
        <Box
          sx={{
            position: mediaIndex < 2 && ["absolute", "absolute", "relative"],
            right: mediaIndex < 2 && [4],
            display: mediaIndex < 2 && "flex",
            alignItems: mediaIndex < 2 && "center",
            top: mediaIndex < 2 && [4],
          }}
        >
          <Button
            onClick={() => {
              setCheckAll(false);
              setCheckedCounter(0);
              handleClearFilters();
            }}
          >
            Reset filtri
          </Button>
        </Box>
      )}
    </Box>
  );
};

const LabeledCheckbox = ({
  children,
  defaultChecked,
  checkedCheckbox,
  ...props
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    if (defaultChecked === false) {
      setChecked(defaultChecked);
    }
  }, [defaultChecked]);

  return (
    <Label
      sx={{
        display: "flex",
        alignItems: "center",
        color: "dark",
        "input:checked~.css-kydphz": {
          color: "lightBorder",
        },
        svg: {
          color: "lightBorder",
        },
      }}
    >
      <Checkbox
        sx={{
          color: "dark",
          "input:checked~&": {
            color: "secondary",
            outlineColor: "secondary",
          },
        }}
        checked={checked}
        onChange={() => {
          checkedCheckbox(!checked);
          setChecked(!checked);
        }}
        {...props}
      />
      {children}
    </Label>
  );
};

export default ProductFilters;
