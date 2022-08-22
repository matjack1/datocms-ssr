import React, { useContext, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Input,
  Text,
  Textarea,
  Label,
  Button,
} from "theme-ui";
import CustomerTokenContext from "../../hooks/customerTokenContext";
import Nav from "../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../link";

const Settings = () => {
  return (
    <Box>
      <Heading as="h1">Impostazioni</Heading>
      
    </Box>
  );
};

export default Settings;
