import React, { useEffect, useState } from "react";
import { InboundLink } from "../components/link";
import { Box, Input, Heading, Button, Flex } from "theme-ui";
import Nav from "../components/nav";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import Layout from "../components/layout";

const ForgotPassword = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  useEffect(() => {}, []);

  const sendMail = async (event) => {
    event.preventDefault();

    const result = await executeRecaptcha("dynamicAction");
    const email = event.target.email.value;

    setLoading(true);

    if (result)
      axios
        .post("/.netlify/functions/forgotPassword", { email: email })
        .then(function (response) {
          console.log(response)
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
          console.log(error)
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
        Forgot Password
      </Heading>
      {success === null && !loading ? (
        <Box as="form" onSubmit={sendMail}>
          <Box>
            <Box>
              <Input name="email" type="text" placeholder="Email" required />
            </Box>
            <Box>
              <Box>
                <Button type="submit" className="btn btn-primary">
                  Submit
                </Button>
              </Box>
              <Box>
                <InboundLink to={"/login"} className="btn btn-link">
                  Cancel
                </InboundLink>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : success === true ? (
        <Flex sx={{ maxWidth: "600px" }}>
          <Heading sx={{ my: [4], color: "secondary" }} as="h4">
            Richiesta inviata! Riceverai un'email con un link per
            resettare la tua password!
          </Heading>
        </Flex>
      ) : success === false ? (
        <Flex sx={{ maxWidth: "600px" }}>
          <Heading sx={{ my: [4], color: "secondary" }} as="h4">
            Qualcosa è andato storto
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

export default ForgotPassword;
