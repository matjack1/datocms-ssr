import React, { useContext, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Label,
  Input,
  Text,
  Flex,
  Button,
  Image,
} from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";
import Nav from "../components/nav";
import { navigate } from "gatsby";
import { InboundLink } from "../components/link";
import Logo from "../assets/img/logo.svg";
import Layout from "../components/layout";
import CustomInput from "../components/customInput";
import EmailIcon from "../assets/img/icons/email.inline.svg";
import PasswordIcon from "../assets/img/icons/password.inline.svg";

const LoginPage = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    getToken();
  };

  const handleError = (e) => {
    setLoginError(e);
  };

  const handleChange = (e) => {
    console.log(e.target.name);
    const name = e.target.name === "email" ? "username" : e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const getToken = async () => {
    const clToken = await getCustomerToken(
      {
        clientId: "Sq41WaprqH4zFc3a0OyWGpU4zH82Nabx_Z5CzMnzoi4",
        endpoint: "https://socaf-s-p-a.commercelayer.io",
        scope: "market:10247",
      },
      data
    ).catch(handleError);

    if (clToken) {
      console.log("logging")
      setCustomerToken(clToken.data);
      navigate("/");
      setLoginError("");
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
          display: ["none", "none", "block", "block"],
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
            Accedi
          </Heading>
          <Box as="form" onSubmit={(e) => handleSubmit(e)}>
            <Box sx={{ pb: [4] }}>
              <CustomInput
                id="email"
                label="Email"
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Email"
                variant="inputs.dark"
                autocomplete="email"
                required
                icon={true}
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
            <Box sx={{ pb: [4] }}>
              <CustomInput
                id="password"
                label="Password"
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Password"
                autocomplete="password"
                variant="inputs.dark"
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
            {loginError && (
              <Box>
                <Text sx={{ color: "primary" }}>Errore di autenticazione</Text>
              </Box>
            )}

            <Button
              variant="buttons.primary"
              type="submit"
              value="Accedi"
              sx={{
                opacity: 1,
                width: "100%",
                height: "100%",
                textAlign: "center",
                fontSize: [3],
                fontWeight: "600",
                borderRadius: "unset",
                p: [3],
              }}
            >
              Accedi
            </Button>
            <Box sx={{ textAlign: "center", py: [6] }}>
              <InboundLink to={"/forgot-password"}>
                Password dimenticata?
              </InboundLink>
            </Box>
            <Box sx={{ textAlign: "center", color: "lightBorder" }}>
              Non riesci ad accedere al servizio? <br /> Contattaci al 800
              480110
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
