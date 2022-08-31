import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Input, Label, Select, Textarea } from "theme-ui";

const CustomInput = (props) => {
  const [focused, setFocused] = useState(false);
  const {
    id,
    onChange,
    validateField,
    name,
    rows,
    value,
    validate,
    placeholder,
    label = "",
    type = "text",
    variant,
    required,
    pattern,
    autocomplete = false,
    events = {},
  } = props;

  const handleChange = (event) => {
    if (typeof onChange === "function") {
      onChange(event);
    }
  };

  useEffect(() => {
    if (value !== undefined) {
      validateField(id);
    }
  }, [value, id]);

  const fieldProps = {
    id,
    name,
    type,
    value,
    validate,
    placeholder,
    variant,
    required,
    pattern,
    autocomplete,
    onChange: handleChange,
  };

  if (type === "textarea") {
    delete fieldProps.type;
    delete fieldProps.value;

    fieldProps.defaultValue = value;
    fieldProps.rows = rows || 2;
  }

  return id ? (
    <Box sx={{ width: "100%" }}>
      <Flex
        sx={{
          width: "100%",
          flexDirection: "column",
        }}
      >
        <Label
          sx={{
            width: "fit-content",
            px: [2],
            py: [1],
            fontSize: [1],
            border: "1px solid",
            borderColor: "dark",
            mb: ["-1px"],
            color: focused ? "light" : "dark",
            backgroundColor: focused ? "dark" : "light",
            "-webkit-transition":
              "background-color .2s linear,color .2s linear",
            "-ms-transition": "background-color .2s linear,color .2s linear",
            transition: "background-color .2s linear,color .2s linear",
          }}
          for={fieldProps.id}
        >
          {label}
        </Label>
        {console.log("type", type)}
        <Flex
          sx={{
            width: "100%",
            "input,select,textare": { width: "100%" },
            "& > div": { width: "100%" },
          }}
        >
          {type === "textarea" ? (
            <Textarea
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              {...fieldProps}
            />
          ) : type === "text" || type=== "password" || type==="email" ? (
            <Input
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              {...fieldProps}
            />
          ) : (
            <Select
              sx={{ width: "100%", minHeight:"54px" }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              {...fieldProps}
            >
              {props.children}
            </Select>
          )}
        </Flex>
      </Flex>
    </Box>
  ) : (
    ""
  );
};

export default CustomInput;
