import React, { useContext, useEffect, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Label,
  Input,
  Select,
  Text,
  Button,
  Grid,
  Flex,
} from "theme-ui";
import CustomerTokenContext from "../../../hooks/customerTokenContext";
import Nav from "../../../components/nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../link";
import CustomerContext from "../../../hooks/customerContext";
import { useClSdk } from "../../../hooks/useClSdk";
import { getProvinces } from "../../../utils/provinces";
import CustomInput from "../../customInput";

const AddAddress = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken } = useContext(CustomerTokenContext);
  const [addresses, setAddresses] = useState();
  const cl = useClSdk();
  const provinces = getProvinces();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    business: "",
    company: "",
    line_1: "",
    city: "",
    zip_code: "",
    state_code: "",
    country_code: "",
    phone: "",
  });

  const onUpdateField = (e) => {
    console.log("onUpdateField", e);
    const nextFormState = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(nextFormState);
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setLoading(true);

    if (customer) {
      const createdAddress = await cl.addresses
        .create(formData)
        .catch((error) => {
          setSubmitStatus(false);
          console.log(error);
        });

      console.log(createdAddress);

      if (createdAddress) {
        let createdCustomerAddress = await cl.customer_addresses
          .create({
            address: {
              type: "addresses",
              id: createdAddress.id,
            },
            customer: {
              type: "customers",
              id: customer.id,
            },
          })
          .catch((error) => {
            setSubmitStatus(false);
            console.log(error);
          });
        if (createdCustomerAddress) {
          setLoading(false);
          setSubmitStatus(true);
        }
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <Box>
      <Container>
        <Heading as="h1" variant="h2" sx={{ fontWeight: "400", my: [5] }}>
          Aggiungi un nuovo indirizzo di spedizione
        </Heading>
        {submitStatus === null && !loading ? (
          <Box
            as="form"
            onSubmit={handleCreateAddress}
            sx={{ width: ["100%", "100%", "60%"] }}
          >
            <Grid
              sx={{
                flexWrap: "wrap",
                flexDirection: "column",
              }}
              gap={[0, 0, 0, 0]}
            >
              <Box
                sx={{
                  pb: [3, 3, 3, 3],
                  width: ["100%", "100%"],
                }}
              >
                <CustomInput
                  id="company"
                  label="Ragione sociale *"
                  onChange={onUpdateField}
                  type="text"
                  name="company"
                  placeholder="Ragione sociale *"
                  variant="inputs.dark"
                  required
                />
              </Box>
              <Box
                sx={{
                  pb: [3, 3, 3, 3],
                  width: ["100%", "100%"],
                }}
              >
                <CustomInput
                  id="address"
                  label="Indirizzo"
                  onChange={onUpdateField}
                  type="text"
                  name="address"
                  placeholder="Indirizzo"
                  variant="inputs.dark"
                  required
                />
              </Box>
              <Flex sx={{ flexWrap: "wrap" }}>
                <Box
                  sx={{
                    pr: [0, 1, 1, 1],
                    pb: [3, 3, 3, 3],
                    width: ["100%", "50%"],
                  }}
                >
                  <CustomInput
                    id="city"
                    label="Città"
                    onChange={onUpdateField}
                    type="text"
                    name="city"
                    placeholder="Città"
                    variant="inputs.dark"
                    required
                  />
                </Box>
                <Box
                  sx={{
                    pl: [0, 1, 1, 1],
                    pb: [3, 3, 3, 3],
                    width: ["100%", "50%"],
                  }}
                >
                  <CustomInput
                    id="province"
                    label="Provincia"
                    onChange={onUpdateField}
                    type="select"
                    name="province"
                    placeholder="Provincia"
                    variant="inputs.dark"
                    required
                  >
                    <option value="" selected disabled>
                      Seleziona una provincia
                    </option>
                    {Object.keys(provinces).map((key, index) => (
                      <option value={key}>{provinces[key]}</option>
                    ))}
                  </CustomInput>
                </Box>
              </Flex>

              <Flex sx={{ flexWrap: "wrap" }}>
                <Box
                  sx={{
                    pr: [0, 1, 1, 1],
                    pb: [3, 3, 3, 3],
                    width: ["100%", "30%"],
                  }}
                >
                  <CustomInput
                    id="CAP"
                    label="CAP"
                    onChange={onUpdateField}
                    type="text"
                    name="zipcode"
                    pattern="(^\d{5}$)|(^\d{5}-\d{4}$)"
                    placeholder="CAP"
                    variant="inputs.dark"
                    required
                  />
                </Box>
                <Box
                  sx={{
                    pl: [0, 1, 1, 1],
                    pb: [3, 3, 3, 3],
                    width: ["100%", "70%"],
                  }}
                >
                  <CustomInput
                    id="nazione"
                    label="Nazione"
                    onChange={onUpdateField}
                    type="select"
                    name="nazione"
                    placeholder="Nazione"
                    variant="inputs.dark"
                    required
                  >
                    <option selected disabled value="">
                      Seleziona una nazione
                    </option>
                    <option value="IT">Italia</option>
                  </CustomInput>
                </Box>
              </Flex>
              <Box
                sx={{
                  pb: [3, 3, 3, 3],
                  width: ["100%", "100%"],
                }}
              >
                <CustomInput
                  id="phone"
                  label="Numero di telefono"
                  onChange={onUpdateField}
                  type="text"
                  name="phone"
                  placeholder="Numero di telefono"
                  variant="inputs.dark"
                  required
                />
              </Box>
              <Box
                sx={{
                  pl: [0, 1, 1, 1],
                  pb: [3, 3, 3, 3],
                  width: ["100%", "50%"],
                }}
              >
                <Button
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: [3],
                    fontWeight: "600",
                    borderRadius: "unset",
                    p: [3],
                  }}
                  variant="buttons.primary"
                >
                  Usa questo indirizzo
                </Button>
              </Box>
            </Grid>
          </Box>
        ) : loading ? (
          <Box>LOADING</Box>
        ) : submitStatus ? (
          <Box>Indirizzo aggiunto</Box>
        ) : (
          <Box>Errore</Box>
        )}
      </Container>
    </Box>
  );
};

export default AddAddress;
