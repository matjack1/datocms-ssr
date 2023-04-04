import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Input, Label, Select, Textarea } from "theme-ui";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import ErrorIcon from "../assets/img/icons/closed-circle.inline.svg";
import { InboundLink } from "./link";

const CustomInput = (props) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [focused, setFocused] = useState(false);
  const {
    id,
    forgotPassword = false,
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
    autocomplete = "off",
    events = {},
    icon,
    register,
    validationSchema,
    errors,
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
    register,
    validationSchema,
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
        <Flex
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Label
            sx={{
              width: "fit-content",
              px: [2],
              py: [1],
              fontSize: [1],
              border: "1px solid",
              borderColor:
                errors && Object.keys(errors).length > 0 ? "primary" : "dark",
              mb: ["-1px"],
              color:
                errors && Object.keys(errors).length > 0
                  ? "light"
                  : focused
                  ? "light"
                  : "dark",
              backgroundColor:
                errors && Object.keys(errors).length > 0
                  ? "primary"
                  : focused
                  ? "dark"
                  : "light",
              "-webkit-transition":
                "background-color .2s linear,color .2s linear",
              "-ms-transition": "background-color .2s linear,color .2s linear",
              transition: "background-color .2s linear,color .2s linear",
            }}
            for={fieldProps.id}
          >
            {label}
          </Label>
          {forgotPassword && (
            <Box sx={{ textAlign: "center" }}>
              <InboundLink sx={{ fontSize: [1, 1] }} to={"/forgot-password"}>
                Password dimenticata?
              </InboundLink>
            </Box>
          )}
        </Flex>

        <Flex
          sx={{
            width: "100%",
            "input,select,textare": {
              pl: icon && [8],
              width: "100%",
              pr: type === "password" && [7],
            },
            "& > div": { width: "100%" },
            position: "relative",
          }}
        >
          {icon && props.children}
          {type === "textarea" ? (
            <>
              <Textarea
                {...fieldProps}
                {...register(name, validationSchema)}
                variant={
                  errors && Object.keys(errors).length > 0
                    ? "inputs.error"
                    : fieldProps.variant
                }
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </>
          ) : type === "text" || type === "password" || type === "email" ? (
            <>
              
              <Input
                {...fieldProps}
                {...register(name, validationSchema)}
                type={
                  type === "password" && passwordShown
                    ? "text"
                    : type === "password"
                    ? "password"
                    : type
                }
                variant={
                  errors && Object.keys(errors).length > 0
                    ? "inputs.error"
                    : fieldProps.variant
                }
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
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
              {...fieldProps}
              {...register(name, validationSchema)}
              variant={
                errors && Object.keys(errors).length > 0
                  ? "inputs.error"
                  : fieldProps.variant
              }
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            >
              {props.children}
            </Select>
          )}
        </Flex>
        <>
          {errors && errors[name]?.type === "required" && (
            <Flex sx={{ my: [2], color: "primary", alignItems: "center" }}>
              <Flex sx={{ mr: 1, alignItems: "center" }}>
                <ErrorIcon />
              </Flex>
              <span className="error">{errors[name]?.message}</span>
            </Flex>
          )}
          {errors && errors[name]?.type === "minLength" && (
            <Flex sx={{ my: [2], color: "primary", alignItems: "center" }}>
              <Flex sx={{ mr: 1, alignItems: "center" }}>
                <ErrorIcon />
              </Flex>
              <span className="error">{errors[name]?.message}</span>
            </Flex>
          )}
          {errors && errors[name]?.type === "validate" && (
            <Flex sx={{ my: [2], color: "primary", alignItems: "center" }}>
              <Flex sx={{ mr: 1, alignItems: "center" }}>
                <ErrorIcon />
              </Flex>
              <span className="error">{errors[name]?.message}</span>
            </Flex>
          )}
        </>
      </Flex>
    </Box>
  ) : (
    ""
  );
};

export default CustomInput;
