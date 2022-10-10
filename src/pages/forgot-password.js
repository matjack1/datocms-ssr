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
  Grid,
} from "theme-ui";
import Nav from "../components/nav";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import Layout from "../components/layout";
import Logo from "../assets/img/logo.svg";
import CustomInput from "../components/customInput";
import BouncingDotsLoader from "../components/bouncingDotsLoader";
import EmailIcon from "../assets/img/icons/email.inline.svg";
import { useForm } from "react-hook-form";
import OutsideNav from "../components/outsideNav";
import { Helmet } from "react-helmet";

const ForgotPassword = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const sendMail = async (event) => {
    const result = await executeRecaptcha("dynamicAction");

    setLoading(true);

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
      <Helmet>
        <title>Password dimenticata | SOCAF</title>
      </Helmet>
      <OutsideNav />
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
            <Box as="form" onSubmit={handleSubmit(sendMail)}>
              <Box>
                <Box sx={{ pb: [6] }}>
                  <CustomInput
                    id="email"
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    variant="inputs.dark"
                    icon={true}
                    register={register}
                    errors={errors}
                    validationSchema={{
                      required: "Questo campo è obbligatorio.",
                      onChange: (e) => setEmail(e.target.value),
                    }}
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
                      <EmailIcon />
                    </Flex>
                  </CustomInput>
                </Box>
                <Box>
                  <Box sx={{ pb: [5] }}>
                    <Button
                      sx={{
                        minHeight: "55px",
                        width: ["100%"],
                        textAlign: "center",
                        fontSize: [3],
                        fontWeight: "600",
                        borderRadius: "unset",
                        p: [3],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
            <Flex sx={{ maxWidth: "600px", flexDirection: "column" }}>
              <Heading sx={{ my: [4], color: "dark" }} as="h5">
                Richiesta inviata! Riceverai un'email con un link per resettare
                la tua password!
              </Heading>
              <InboundLink to={"/login"} className="btn btn-link">
                Torna al login
              </InboundLink>
            </Flex>
          ) : (
            success === false && (
              <Flex sx={{ maxWidth: "600px", flexDirection: "column" }}>
                <Heading sx={{ my: [4], color: "dark" }} as="h5">
                  Qualcosa è andato storto
                </Heading>
                <InboundLink to={"/login"} className="btn btn-link">
                  Torna al login
                </InboundLink>
              </Flex>
            )
          )}
        </Box>
      </Container>
    </>
  );
};

export default ForgotPassword;
