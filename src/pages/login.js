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
  Image,
} from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";
import Nav from "../components/nav";
import { navigate } from "gatsby";
import { InboundLink } from "../components/link";
import Logo from "../assets/img/logo.svg";
import Layout from "../components/layout";

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
    const name = e.target.name;
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
      setCustomerToken(clToken.data);
      setLoginError("");
      navigate("/");
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
                SPEDIZIONE E RESO GRATUITI*
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
          display: ["none", "none", "none", "block"],
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
          <Box>
            <Heading as="h1">Accedi</Heading>
          </Box>
          <Box as="form" onSubmit={(e) => handleSubmit(e)} >
            <Label htmlFor="username">Indirizzo email</Label>
            <Input
              name="username"
              id="username"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
              autocomplete="email"
            />
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              id="password"
              placeholder="Password"
              type="password"
              autocomplete="password"
              minLength="6"
              required
              onChange={handleChange}
            />
            <Box>
              <InboundLink to={"/forgot-password"}>
                Password dimenticata?
              </InboundLink>
            </Box>
            <Input type="submit" value="Accedi" />
            {loginError && (
              <Box>
                <Text sx={{ color: "primary" }}>Errore di autenticazione</Text>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
