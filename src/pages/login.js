import React, { useContext, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import CommerceLayer from "@commercelayer/sdk/lib/cjs/commercelayer";
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
import { Helmet } from "react-helmet";

const LoginPage = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState(null);
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
      const cl = CommerceLayer({
        organization: "socaf-s-p-a",
        accessToken: clToken.data.access_token,
      });
      const getCostumer = async () => {
        console.log("enters");
        const handleError = (e) => {
          if (e.errors[0].code === "INVALID_TOKEN") {
            setCustomerToken(null);
            navigate("/login");
            // console.log("invalid token", e);
          }
        };

        const customer = await cl.customers
          .retrieve(clToken.data.owner_id)
          .catch(handleError);

        if (customer.metadata.enabled === false || customer.metadata.enabled === "false" ) {
          setLoginError("user");
        } else {
          setCustomerToken(clToken.data);
          navigate("/");
          setLoginError("");
        }
      };

      getCostumer();
    }
  };

  const handleError = (e) => {
    setLoginError("error");
  };

  const handleChange = (e) => {
    const name = e.target.name === "email" ? "username" : e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  return (
    <>
      <Helmet>
        <title>Login | Socaf</title>
      </Helmet>
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
              <Box sx={{ pb: 4 }}>
                <Text sx={{ color: "primary" }}>
                  {loginError === "error"
                    ? "L'email o la password che hai inserito non sono corretti"
                    : "Questo account non è autorizzato ad accedere al portale, contattare l'assistenza allo 0354876054"}
                </Text>
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
              Non riesci ad accedere al servizio? <br /> Contattaci allo
              0354876054
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
