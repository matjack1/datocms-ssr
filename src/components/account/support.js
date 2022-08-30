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
  Grid,
} from "theme-ui";
import CustomerTokenContext from "../../hooks/customerTokenContext";
import Nav from "../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../link";
import CustomBreadcrumbs from "../customBreadcrumbs";

const Support = () => {
  return (
    <Box>
      <Container>
        <CustomBreadcrumbs
          data={{
            pages: [
              {
                slug: "/",
                title: "Home",
              },
            ],
            current: {
              title: "Assistenza",
            },
          }}
        />
        <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
          Ciao, come posso aiutarti?
        </Heading>
        <Grid columns={[".7fr .3fr"]} gap={[12]}>
          <Box as="form">
            <Box sx={{ pb: [6] }}>
              <Textarea
                rows={4}
                sx={{
                  fontFamily: "body",
                }}
                variant="inputs.dark"
                placeholder="Inserisci la tua richiesta per ricevere assistenza. Verrai ricontattato al più presto per aiutarti a risolvere il problema"
                minr
              />
            </Box>
            <Button
              sx={{
                width: ["100%", "50%"],
                textAlign: "center",
                fontSize: [3],
                fontWeight: "600",
                borderRadius: "unset",
                p: [3],
              }}
              variant="buttons.primary"
            >
              Invia richiesta
            </Button>
          </Box>
          <Box>
            <Box
              sx={{
                border: "1px solid",
                height: "100%",
                borderColor: "status.approved",
                px: [4],
                py: [6],
              }}
            >
              <Box
                sx={{
                  pb:[4],
                  fontSize: [6],
                  fontWeight: "600",
                  textAlign: "center",
                  color: "status.approved",
                  a: { color: "status.approved", textDecoration: "none" },
                }}
              >
                <Text>Supporto telefonico</Text>
                <br />
                <a href="tel:80048110">800 480110</a>
              </Box>
              <Box sx={{
                fontSize:[2]
              }}>
                Numero verde gratuito attivo:
                <br/>
                lunedi - venerdi dalle 10:00 alle
                17:00
              </Box>
            </Box>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default Support;
