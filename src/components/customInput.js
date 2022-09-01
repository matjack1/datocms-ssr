import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Input, Label, Select, Textarea } from "theme-ui";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const CustomInput = (props) => {
  const [passwordShown, setPasswordShown] = useState(false);
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
    icon,
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
        <Flex
          sx={{
            width: "100%",
            "input,select,textare": {
              pl: icon && [8],
              width: "100%",
              pr: type === "password" && [7]
            },
            "& > div": { width: "100%" },
            position: "relative",
          }}
        >
          {icon && props.children}
          {type === "textarea" ? (
            <Textarea
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              {...fieldProps}
            />
          ) : type === "text" || type === "password" || type === "email" ? (
            <>
              <Input
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                {...fieldProps}
                type={
                  type === "password" && passwordShown ? "text" : type === "password" ? "password" : type
                }
              />
              {type === "password" && (
                <Flex
                  onClick={() => setPasswordShown(!passwordShown)}
                  sx={{
                    minWidth: "26px",
                    width: "fit-content!important",
                    position: "absolute",
                    right: [2],
                    top: "50%",
                    justifyContent: "center",
                    justifyItems: "center",
                    transform: "translateY(-50%)",
                    svg: {
                      width: "24px",
                    },
                  }}
                >
                  {!passwordShown ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </Flex>
              )}
            </>
          ) : (
            <Select
              sx={{ width: "100%", minHeight: "54px" }}
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
