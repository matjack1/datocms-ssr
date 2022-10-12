import React, { useEffect, useState } from "react";
import { InboundLink } from "../components/link";
import { Box, Heading, Button, Label, Flex, Image, Container } from "theme-ui";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { navigate } from "gatsby";
import validator from "validator";
import Logo from "../assets/img/logo.svg";
import CustomInput from "../components/customInput";
import BouncingDotsLoader from "../components/bouncingDotsLoader";
import PasswordIcon from "../assets/img/icons/password.inline.svg";
import { useForm } from "react-hook-form";
import OutsideNav from "../components/outsideNav";
import { Helmet } from "react-helmet";

const ResetPassword = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [params, setParams] = useState({
    id: "",
    token: "",
    password: "",
    confirm_password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get("id") && query.get("token"))
      setParams({
        id: query.get("id"),
        token: query.get("token"),
      });
    else navigate("/login");
  }, []);

  const onUpdateField = (e) => {
    const nextFormState = {
      ...params,
      [e.target.name]: e.target.value,
    };
    setParams(nextFormState);
  };

  const sendResetPassword = async (event) => {
    const result = await executeRecaptcha("dynamicAction");

    setLoading(true);

    console.log(params);

    if (
      result &&
      errorMessage === "" &&
      params.password === params.confirm_password
    )
      axios
        .post("/.netlify/functions/resetPassword", params)
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
      <Helmet>
        <title>Reset password | Socaf</title>
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
                  sx={{
                    height: ["30px", "80px"],
                    maxHeight: "80px",
                    minHeight: "80px",
                  }}
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
            <Box as="form" onSubmit={handleSubmit(sendResetPassword)}>
              <Box sx={{ pb: [6] }}>
                <CustomInput
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  variant="inputs.dark"
                  autocomplete="off"
                  icon={true}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Questo campo è obbligatorio.",
                    onChange: (e) => onUpdateField(e),
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
                  autocomplete="off"
                  icon={true}
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Questo campo è obbligatorio.",
                    onChange: (e) => onUpdateField(e),
                    validate: (val) => {
                      if (watch("password") != val) {
                        return "Le password non combaciano!";
                      }
                    },
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
                <Label>Lunghezza minima 8 caratteri</Label>
              </Box>
              {errorMessage && <Box>{errorMessage}</Box>}
            </Box>
          ) : success === true ? (
            <Flex sx={{ maxWidth: "600px", flexDirection: "column" }}>
              <Heading sx={{ my: [4], color: "dark" }} as="h5">
                Password cambiata! Esegui il login con la nuova password
              </Heading>
              <InboundLink to={"/login"} className="btn btn-link">
                Torna al login
              </InboundLink>
            </Flex>
          ) : (
            success === false && (
              <Flex sx={{ maxWidth: "600px", flexDirection: "column" }}>
                <Heading sx={{ my: [4], color: "dark" }} as="h5">
                  Qualcosa è andato storto! Probabilmente questo link non è più
                  valido!
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

export default ResetPassword;
