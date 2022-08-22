import React, { useEffect, useState } from "react";
import { Box, Checkbox, Label, Radio, Text, Button } from "theme-ui";

const ProductFilters = ({
  handleFiltersChange,
  handleClearFilters,
  filters,
}) => {
  const [checkAll, setCheckAll] = useState(null);
  const [checkedCounter, setCheckedCounter] = useState(0)

  useEffect(() => {
    if (checkedCounter === 0) setCheckAll(null);
  }, [checkedCounter]);

  return (
    <Box sx={{ py: [3] }}>
      {checkedCounter > 0 && (
        <Box>
          <Button
            onClick={() => {
              setCheckAll(false);
              setCheckedCounter(0);
              handleClearFilters();
            }}
          >
            Clear filters
          </Button>
        </Box>
      )}

      <Box>Filtra per</Box>
      <Box>
        {filters &&
          Object.keys(filters) &&
          Object.keys(filters).length > 0 &&
          Object.keys(filters).map((key, index) => (
            <>
              {filters[key] && Array.isArray(filters[key]) && (
                <>
                  <strong>{key}</strong>
                  {filters[key].map((filter) => (
                    <LabeledCheckbox
                      defaultChecked={checkAll}
                      checkedCheckbox={(e) => {
                        let o = {};
                        o[key] = filter;
                        e ? setCheckedCounter( checkedCounter + 1) : setCheckedCounter( checkedCounter - 1)
                        handleFiltersChange(e, o);
                      }}
                      required={true}
                    >
                      {filter}
                    </LabeledCheckbox>
                  ))}
                </>
              )}
            </>
          ))}
      </Box>
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
          color: "secondaryText",
        },
        svg: {
          color: "secondaryText",
        },
      }}
    >
      <Checkbox
        sx={{
          color: "dark",
          "input:checked~&": {
            color: "primary",
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
