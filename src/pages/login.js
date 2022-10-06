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
  Grid,
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
import { useForm } from "react-hook-form";
import OutsideNav from "../components/outsideNav";

const LoginPage = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (e) => {
    const clToken = await getCustomerToken(
      {
        clientId: "nr6l5bKbn2tV-iMgkgS0z4KTsvrv_5eu6Dfm5E2fATE",
        endpoint: "https://socaf-s-p-a.commercelayer.io",
        scope: "market:11461",
      },
      { username: e.email, password: e.password }
    ).catch(handleError);

    if (clToken) {
      console.log("logging");
      setCustomerToken(clToken.data);
      navigate("/");
      setLoginError("");
    }
  };

  const handleError = (e) => {
    setLoginError(e);
  };

  const handleChange = (e) => {
    console.log("changing");
    const name = e.target.name === "email" ? "username" : e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  return (
    <>
      <OutsideNav />
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
            Accedi
          </Heading>
          <Box as="form" onSubmit={handleSubmit(handleFormSubmit)}>
            <Box sx={{ pb: [4] }}>
              <CustomInput
                id="email"
                label="Email"
                type="email"
                name="email"
                placeholder="Email"
                variant="inputs.dark"
                autocomplete="email"
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Questo campo è obbligatorio.",
                  onChange: (e) => handleChange(e),
                }}
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
                type="password"
                name="password"
                placeholder="Password"
                autocomplete="password"
                variant="inputs.dark"
                icon={true}
                register={register}
                errors={errors}
                validationSchema={{
                  required: "Questo campo è obbligatorio.",
                  onChange: (e) => handleChange(e),
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
              <InboundLink sx={{ fontSize: [1, 2] }} to={"/forgot-password"}>
                Password dimenticata?
              </InboundLink>
            </Box>
            <Box
              sx={{
                textAlign: "center",
                color: "lightBorder",
                fontSize: [1, 2],
              }}
            >
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
