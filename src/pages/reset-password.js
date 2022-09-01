import React, { useEffect, useState } from "react";
import { InboundLink } from "../components/link";
import {
  Box,
  Input,
  Text,
  Heading,
  Button,
  Label,
  Flex,
  Image,
  Container,
} from "theme-ui";
import Nav from "../components/nav";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { navigate } from "gatsby";
import validator from "validator";
import Layout from "../components/layout";
import Logo from "../assets/img/logo.svg";
import CustomInput from "../components/customInput";
import BouncingDotsLoader from "../components/bouncingDotsLoader";
import PasswordIcon from "../assets/img/icons/password.inline.svg";

const ResetPassword = ({ history }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [params, setParams] = useState({
    password: "",
    confirm_password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const onUpdateField = (e) => {
    const nextFormState = {
      ...params,
      [e.target.name]: e.target.value,
    };
    setParams(nextFormState);
  };
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

    const result = await executeRecaptcha("dynamicAction");

    setLoading(true);

    if (
      result &&
      errorMessage === "" &&
      params.password === params.confirm_password
    )
      axios
        .post("/.netlify/functions/resetPassword", {
          password: params.password,
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
      if (!result && params.password !== params.confirm_password) {
        setErrorMessage("Le password non combaciano");
      } else {
        setSuccess(false);
        setLoading(false);
      }
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
            <Box as="form" onSubmit={sendResetPassword}>
              <Box sx={{ pb: [6] }}>
                <CustomInput
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  variant="inputs.dark"
                  onChange={(e) => setParams(e)}
                  icon={true}
                  required
                >
                  <Flex
                    sx={{
                      minWidth: "26px",
                      width: "fit-content!important",
                      position: "absolute",
                      left: [2],
                      top: "50%",
                      justifyContent: "center",
                      justifyItems: "center",
                      transform: "translateY(-50%)",
                      svg: {
                        width: "24px",
                      },
                    }}
                  >
                    <PasswordIcon />
                  </Flex>
                </CustomInput>
              </Box>
              <Box sx={{ pb: [6] }}>
                <CustomInput
                  id="confirm_password"
                  label="Confirm password"
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm password"
                  variant="inputs.dark"
                  onChange={(e) => setParams(e)}
                  icon={true}
                  required
                >
                  <Flex
                    sx={{
                      minWidth: "26px",
                      width: "fit-content!important",
                      position: "absolute",
                      left: [2],
                      top: "50%",
                      justifyContent: "center",
                      justifyItems: "center",
                      transform: "translateY(-50%)",
                      svg: {
                        width: "24px",
                      },
                    }}
                  >
                    <PasswordIcon />
                  </Flex>
                </CustomInput>
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
              <Box>
                <Label>
                  minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1,
                  minSymbols: 1
                </Label>
              </Box>
              {errorMessage && <Box>{errorMessage}</Box>}
            </Box>
          ) : success === true ? (
            <Flex sx={{ maxWidth: "600px" }}>
              <Heading sx={{ my: [4], color: "dark" }} as="h5">
                Password cambiata! Esegui il login con la nuova password
              </Heading>
              <InboundLink to="/login">login</InboundLink>
            </Flex>
          ) : (
            success === false && (
              <Flex sx={{ maxWidth: "600px" }}>
                <Heading sx={{ my: [4], color: "dark" }} as="h5">
                  Qualcosa è andato storto! Probabilmente questo link non è più
                  valido!
                </Heading>
              </Flex>
            )
          )}
        </Box>
      </Container>
    </>
  );
};

export default ResetPassword;
