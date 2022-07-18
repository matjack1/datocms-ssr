import React, { useContext, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import { Box, Container, Heading, Label, Input, Text } from "theme-ui";
import CustomerTokenContext from "../../hooks/customerTokenContext";
import Nav from "../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../link";

const Payments = () => {
  return (
    <Box>
      <Heading as="h1">I tui metodi di pagamento</Heading>
    </Box>
  );
};

export default Payments;
