import React, { useEffect, useState } from "react";
import { InboundLink } from "../components/link";
import { Box, Input, Heading, Button, Label, Flex } from "theme-ui";
import Nav from "../components/nav";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { navigate } from "gatsby";
import validator from "validator";
import Layout from "../components/layout";

const ResetPassword = ({ history }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
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

  const sendMail = async (event) => {
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

            console.log("response")
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
            console.log("error",error)
          setSuccess(false);
          setLoading(false);
        });
    else {
      setSuccess(false);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Heading as="h3" className="card-header">
        Reset Password
      </Heading>
      {success === null && !loading ? (
        <Box as="form" onSubmit={sendMail}>
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
            Qualcosa è andato storto! Probabilmente questo link non è più valido!
          </Heading>
        </Flex>
      ) : loading === true && (
        <Box>
          LOADING
        </Box>
       )}
    </Layout>
  );
};

export default ResetPassword;
