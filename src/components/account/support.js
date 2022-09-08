import React, { useContext, useEffect, useState } from "react";
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
  Flex,
} from "theme-ui";
import CustomerTokenContext from "../../hooks/customerTokenContext";
import Nav from "../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../link";
import CustomBreadcrumbs from "../customBreadcrumbs";
import CustomInput from "../../components/customInput";
import CustomerContext from "../../hooks/customerContext";
import axios from "axios";
import BouncingDotsLoader from "../../components/bouncingDotsLoader";
import { useForm } from "react-hook-form";

const Support = () => {
  const [formData, setFormData] = useState({
    customer: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { customer } = useContext(CustomerContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleSupportMail = async (event) => {

    const data = formData;

    axios
      .post("/.netlify/functions/supportMail", data)
      .then(function (response) {
        setSuccess(true);
        setLoading(false);
        if (typeof window !== "undefined" && window.gtag !== undefined) {
          window.gtag("event", "Submit", {
            event_category: "Form",
            event_label: "Contact",
          });
        }
      })
      .catch(function (error) {
        setSuccess(false);
        setLoading(false);
      });
  };

  const onUpdateField = (e) => {
    console.log("onUpdateField",e.target.name,e.target.value)
    const nextFormState = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(nextFormState);
  };

  useEffect(() => {
    if (customer) {
      const nextFormState = {
        ...formData,
        customer: customer.email,
      };
      setFormData(nextFormState);
    }
  }, [customer]);

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
          {success === null ? (
            <>
              <Box as="form" onSubmit={handleSubmit(handleSupportMail)}>
                <Box sx={{ pb: [6], textarea: { fontFamily: "body" } }}>
                  <CustomInput
                    id="messaggio"
                    label="Messaggio"
                    type="textarea"
                    name="message"
                    variant="inputs.dark"
                    rows={4}
                    register={register}
                    errors={errors}
                    validationSchema={{
                      required:
                        "Inserisci la tua richiesta per ricevere assistenza.",
                      onChange: (e) => onUpdateField(e),
                    }}
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
                  <Box>
                    {!loading ? (
                      <Text>Invia richiesta</Text>
                    ) : (
                      <BouncingDotsLoader />
                    )}
                  </Box>
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
                      pb: [4],
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
                  <Box
                    sx={{
                      fontSize: [2],
                    }}
                  >
                    Numero verde gratuito attivo:
                    <br />
                    lunedi - venerdi dalle 10:00 alle 17:00
                  </Box>
                </Box>
              </Box>
            </>
          ) : success === true ? (
            <Flex sx={{ maxWidth: "600px" }}>
              <Heading sx={{ my: [4], color: "dark" }} as="h5">
                Richiesta inviata! Ti forniremo assistenza al più presto.
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
        </Grid>
      </Container>
    </Box>
  );
};

export default Support;
