import React, { useEffect, useState, useContext } from "react";
import { Link } from "gatsby";
import { Heading, Container, Text, Box } from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";
import { Helmet } from "react-helmet";
import Layout from "../components/layout";
import { OutboundLink } from "../components/link";

const NotFoundPage = () => {
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  const [hasHeaderFooter, setHasHeaderFooter] = useState(null);

  useEffect(() => {
    if (
      !customerToken &&
      typeof window != "undefined" &&
      (window.location.pathname !== `/login` ||
        window.location.pathname !== `/forgot-password` ||
        window.location.pathname !== `/reset-password`)
    ) {
      setHasHeaderFooter(false);
    } else setHasHeaderFooter(true);
  }, []);

  return hasHeaderFooter != null && hasHeaderFooter ? (
    <Layout>
      <Helmet>
        <title>404 | Socaf</title>
      </Helmet>
      <Content />
    </Layout>
  ) : hasHeaderFooter != null  &&(
    <>
      <Helmet>
        <title>404 | Socaf</title>
      </Helmet>
      <Box sx={{
        height:"100vh"
      }}>
      <Content />
      </Box>
    </>
  );
};

const Content = () => {
  return (
    <Container
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height:"100%",
        py:[10,14]
      }}
    >
      <Heading
        as="h1"
        variant="h1"
        sx={{
          fontSize: ["80px", "100px"],
          pb: [4],
          color:"primary",
          fontWeight:"400"
        }}
      >
        404
      </Heading>
      <Heading
        variant="h3"
        as="h2"
        sx={{
          pb: [10],
        }}
      >
        Non abbiamo trovato quello che stavi cercando.
      </Heading>

      <Box sx={{width:"100%"}}>
        <OutboundLink
          href={`/`}
          target="_self"
          variant="buttons.primary"
          sx={{
            width:"100%",
            maxWidth:"370px",
            display: "inline-block",
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: [3],
            fontWeight: "600",
            borderRadius: "unset",
            p: [3],
          }}
        >
          Torna alla home
        </OutboundLink>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
