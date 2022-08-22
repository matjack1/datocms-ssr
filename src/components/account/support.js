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

const Support = () => {
  return (
    <Box>
      <Heading as="h1">Hai bisogno di aiuto?</Heading>
      <Box as="form">
        <Textarea placeholder="Inserisci la tua richiesta per ricevere assistenza." />
        <Label>
          Verrai ricontattato al più presto per aiutarti a risolvere il problema
        </Label>
        <Button>Invia richiesta</Button>
      </Box>
      <Box>
        <Text>Supporto telefonico</Text>
        <br/>
        <a href="tel:80048110">800 480110</a>
        <br/>
        Numero verde gratuito attivo lunedi - venerdi dalle 10:00 alle 17:00
      </Box>
    </Box>
  );
};

export default Support;
