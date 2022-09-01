import React, { useEffect, useState } from "react";
import { InboundLink } from "../components/link";
import {
  Box,
  Input,
  Heading,
  Button,
  Flex,
  Container,
  Text,
  Image,
} from "theme-ui";
import Nav from "../components/nav";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import Layout from "../components/layout";
import Logo from "../assets/img/logo.svg";
import CustomInput from "../components/customInput";
import BouncingDotsLoader from "../components/bouncingDotsLoader";

const ForgotPassword = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {}, []);

  const sendMail = async (event) => {
    event.preventDefault();

    const result = await executeRecaptcha("dynamicAction");

    setLoading(true);

    console.log("email", email);

    if (result && email)
      axios
        .post("/.netlify/functions/forgotPassword", { email: email })
        .then(function (response) {
          console.log(response);
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
          console.log(error);
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
          {success === null ? (
            <Box as="form" onSubmit={sendMail}>
              <Box>
                <Box sx={{ pb: [6] }}>
                  <CustomInput
                    id="email"
                    label="Email"
                    type="text"
                    name="email"
                    placeholder="Email"
                    variant="inputs.dark"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Box sx={{ pb: [5] }}>
                    <Button
                      sx={{
                        width: ["100%"],
                        textAlign: "center",
                        fontSize: [3],
                        fontWeight: "600",
                        borderRadius: "unset",
                        p: [3],
                      }}
                      variant="buttons.primary"
                      type="submit"
                      disabled={loading === true}
                    >
                      {loading === true ? (
                        <BouncingDotsLoader />
                      ) : (
                        "Invia richiesta"
                      )}
                    </Button>
                  </Box>
                  <Box>
                    <InboundLink to={"/login"} className="btn btn-link">
                      Torna al login
                    </InboundLink>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : success === true ? (
            <Flex sx={{ maxWidth: "600px" }}>
              <Heading sx={{ my: [4], color: "dark" }} as="h5">
                Richiesta inviata! Riceverai un'email con un link per resettare
                la tua password!
              </Heading>
            </Flex>
          ) : (
            success === false && (
              <Flex sx={{ maxWidth: "600px" }}>
                <Heading sx={{ my: [4], color: "dark" }} as="h5">
                  Qualcosa è andato storto
                </Heading>
              </Flex>
            )
          )}
        </Box>
      </Container>
    </>
  );
};

export default ForgotPassword;
