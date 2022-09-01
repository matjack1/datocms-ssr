import React, { useEffect, useState } from "react";
import { InboundLink } from "../components/link";
import { Box, Input, Text, Heading, Button, Label, Flex, Image, Container } from "theme-ui";
import Nav from "../components/nav";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { navigate } from "gatsby";
import validator from "validator";
import Layout from "../components/layout";
import Logo from "../assets/img/logo.svg";

const ResetPassword = ({ history }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [params, setParams] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("id") && query.get("token"))
      setParams({
        id: query.get("id"),
        token: query.get("token"),
      });
    else navigate("/login");
  }, []);

  const validate = (value) => {
    if (
      !validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    )
      setErrorMessage("Is Not Strong Password");
  };

  const sendResetPassword = async (event) => {
    event.preventDefault();

    console.log(event.target.password.value);
    console.log(validate(event.target.password.value));

    const result = await executeRecaptcha("dynamicAction");
    const password = event.target.password.value;

    setLoading(true);

    console.log(errorMessage);

    if (result && errorMessage === "")
      axios
        .post("/.netlify/functions/resetPassword", {
          ...params,
          password: password,
        })
        .then(function (response) {
          console.log("response");
          setSuccess(true);
          setLoading(false);

          if (typeof window !== "undefined" && window.dataLayer !== undefined) {
            window.dataLayer = window.dataLayer || [];

            window.dataLayer.push({
              event: "formSubmission",
              formType: "Contact",
            });
          }
        })
        .catch(function (error) {
          console.log("error", error);
          setSuccess(false);
          setLoading(false);
        });
    else {
      setSuccess(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "dark",
        }}
      >
        <Container sx={{ py: [1, 1] }}>
          <Flex sx={{ justifyContent: "space-between" }}>
            <Box>
              <Text sx={{ color: "white", fontWeight: "600", fontSize: [1] }}>
                14 GIORNI PER IL RESO
              </Text>
            </Box>
            <Box>
              <Text sx={{ color: "white", fontWeight: "600", fontSize: [1] }}>
                Spedizione gratuita da 250 €
              </Text>
            </Box>
            <Box>
              <InboundLink
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: [1],
                  textDecoration: "none",
                }}
                href="/help"
              >
                Aiuto
              </InboundLink>
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container
        sx={{
          pt: [5, 5],
          pb: [4, 4],
          display: ["block", "block", "block", "block"],
        }}
      >
        <Box>
          <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <InboundLink to="/">
                <Image
                  src={Logo}
                  sx={{ maxHeight: "80px", minHeight: "80px" }}
                />
              </InboundLink>
            </Box>
            <Box></Box>
          </Flex>
        </Box>
      </Container>

      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box sx={{ maxWidth: "413px", width: ["413px"] }}>
          <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
            Resetta la password
          </Heading>
          {success === null && !loading ? (
            <Box as="form" onSubmit={sendResetPassword}>
              <Box>
                <Input type="password" name="password" required />
              </Box>
              <Box>
                <Label>
                  minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1,
                  minSymbols: 1
                </Label>
              </Box>
              {errorMessage && <Box>{errorMessage}</Box>}
              <Box>
                <Button type="submit" className="btn btn-primary">
                  Cambia password
                </Button>
              </Box>
            </Box>
          ) : success === true ? (
            <Flex sx={{ maxWidth: "600px" }}>
              <Heading sx={{ my: [4], color: "secondary" }} as="h4">
                Password cambiata! Esegui il login con la nuova password
              </Heading>
              <InboundLink to="/login">login</InboundLink>
            </Flex>
          ) : success === false ? (
            <Flex sx={{ maxWidth: "600px" }}>
              <Heading sx={{ my: [4], color: "secondary" }} as="h4">
                Qualcosa è andato storto! Probabilmente questo link non è più
                valido!
              </Heading>
            </Flex>
          ) : (
            loading === true && <Box>LOADING</Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default ResetPassword;
