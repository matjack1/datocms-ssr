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

const AddAddress = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken } = useContext(CustomerTokenContext);
  const [addresses, setAddresses] = useState();
  const cl = useClSdk();
  const provinces = getProvinces();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setLoading(true);
    let tmpData = {
      business: true,
      company: formData.get("company"),
      line_1: formData.get("address"),
      city: formData.get("city"),
      zip_code: formData.get("zipcode"),
      state_code: formData.get("province"),
      country_code: formData.get("nation"),
      phone: formData.get("phone"),
    };

    if (customer) {
      const createdAddress = await cl.addresses
        .create(tmpData)
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
                <Input
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
                <Input
                  type="text"
                  name="address"
                  placeholder="Indirizzo *"
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
                  <Input
                    type="text"
                    name="city"
                    placeholder="Città*"
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
                  <Select
                    name="province"
                    placeholder="Provincia*"
                    variant="inputs.dark"
                    required
                  >
                    <option value="" selected disabled>
                      Provincia*
                    </option>
                    {Object.keys(provinces).map((key, index) => (
                      <option value={key}>{provinces[key]}</option>
                    ))}
                  </Select>
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
                  <Input
                    type="text"
                    // pattern="/^[0-9]{5}$/"
                    name="zipcode"
                    placeholder="CAP"
                    variant="inputs.dark"
                  />
                </Box>
                <Box
                  sx={{
                    pl: [0, 1, 1, 1],
                    pb: [3, 3, 3, 3],
                    width: ["100%", "70%"],
                  }}
                >
                  <Select name="nation" variant="inputs.dark">
                    <option selected disabled value="">
                      Nazione*
                    </option>
                    <option value="IT">
                      Italia
                    </option>
                  </Select>
                </Box>
              </Flex>
              <Box
                sx={{
                  pb: [3, 3, 3, 3],
                  width: ["100%", "100%"],
                }}
              >
                <Input
                  // pattern="^(\((00|\+)39\)|(00|\+)39)?(38[890]|34[7-90]|36[680]|33[3-90]|32[89])\d{7}$"
                  input="text"
                  name="phone"
                  placeholder="Numero di telefono"
                  variant="inputs.dark"
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
