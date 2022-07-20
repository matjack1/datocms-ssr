import React, { useContext, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import { Box, Container, Heading, Label, Input, Text } from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";
import Nav from "../components/nav";
import { navigate } from "gatsby";
import { InboundLink } from "../components/link";

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
    <Box>
      <Nav />
      <Box>
        <Heading as="h1">Login</Heading>
      </Box>
      <Container>
        <Box as="form" onSubmit={(e) => handleSubmit(e)}>
          <Label htmlFor="username">Indirizzo email</Label>
          <Input
            name="username"
            id="username"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            id="password"
            placeholder="Password"
            type="password"
            minLength="6"
            required
            onChange={handleChange}
          />
          <Box>
              <InboundLink to={"/forgot-password"}>Password dimenticata?</InboundLink>
          </Box>
          <Input type="submit" value="Accedi" />
          {loginError && (
            <Box>
              <Text sx={{ color: "primary" }}>Errore di autenticazione</Text>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
