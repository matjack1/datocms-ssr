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
} from "theme-ui";
import CustomerTokenContext from "../../../hooks/customerTokenContext";
import Nav from "../../../components/nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../link";
import CustomerContext from "../../../hooks/customerContext";
import { useClSdk } from "../../../hooks/useClSdk";
import { getProvinces } from "../../../utils/provinces";

const Add = () => {
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
      <Nav />
      <Heading as="h1">Aggiungi indirizzo</Heading>
      <Container sx={{ maxWidth: "1000px" }}>
        {submitStatus === null && !loading ? (
          <Box as="form" onSubmit={handleCreateAddress}>
            <Input type="text" name="company" placeholder="Ragione sociale" />
            <Input type="text" name="address" placeholder="Indirizzo" />
            <Input type="text" name="city" placeholder="Città" />
            <Select name="province" placeholder="Provincia">
              <option value="" selected disabled>
                Provincia
              </option>
              {Object.keys(provinces).map((key, index) => (
                <option value={key}>{provinces[key]}</option>
              ))}
            </Select>
            <Input
              type="text"
              // pattern="/^[0-9]{5}$/"
              name="zipcode"
              placeholder="CAP"
            />
            <Select name="nation">
              <option selected value="IT">
                Italia
              </option>
            </Select>

            <Input
              // pattern="^(\((00|\+)39\)|(00|\+)39)?(38[890]|34[7-90]|36[680]|33[3-90]|32[89])\d{7}$"
              input="text"
              name="phone"
              placeholder="Numero di telefono"
            />
            <Button>Aggiungi indirizzo</Button>
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

export default Add;
