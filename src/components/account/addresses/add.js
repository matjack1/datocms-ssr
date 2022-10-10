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
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";

const AddAddress = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const { customerToken } = useContext(CustomerTokenContext);
  const [addresses, setAddresses] = useState();
  const cl = useClSdk();
  const provinces = getProvinces();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [formData, setFormData] = useState({
    business: true,
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
    setLoading(true);

    if (customer) {
      const createdAddress = await cl.addresses
        .create(formData)
        .catch((error) => {
          toast.error("Qualcosa è andato storto", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
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
            toast.error("Qualcosa è andato storto", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });
            setSubmitStatus(false);
            console.log(error);
          });
        if (createdCustomerAddress) {
          setLoading(false);
          toast.success("Indirizzo aggiunto", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          setSubmitStatus(true);
        }
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <Box>
      <Helmet>
        <title>Aggiungi indirizzo | SOCAF</title>
      </Helmet>
      <Container>
        <Heading as="h1" variant="h2" sx={{ fontWeight: "400", my: [5] }}>
          Aggiungi un nuovo indirizzo di spedizione
        </Heading>
        {submitStatus === null && !loading ? (
          <Box
            as="form"
            onSubmit={handleSubmit(handleCreateAddress)}
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
                  label="Ragione sociale di destinazione *"
                  type="text"
                  name="company"
                  placeholder="Ragione sociale *"
                  variant="inputs.dark"
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Questo campo è obbligatorio.",
                    onChange: (e) => onUpdateField(e),
                  }}
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
                  type="text"
                  name="line_1"
                  placeholder="Indirizzo"
                  variant="inputs.dark"
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Questo campo è obbligatorio.",
                    onChange: (e) => onUpdateField(e),
                  }}
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
                    type="text"
                    name="city"
                    placeholder="Città"
                    variant="inputs.dark"
                    register={register}
                    errors={errors}
                    validationSchema={{
                      required: "Questo campo è obbligatorio.",
                      onChange: (e) => onUpdateField(e),
                    }}
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
                    type="select"
                    name="state_code"
                    placeholder="Provincia"
                    variant="inputs.dark"
                    register={register}
                    errors={errors}
                    validationSchema={{
                      required: "Questo campo è obbligatorio.",
                      onChange: (e) => onUpdateField(e),
                    }}
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
                    width: ["100%", "35%"],
                  }}
                >
                  <CustomInput
                    id="CAP"
                    label="CAP"
                    type="text"
                    name="zip_code"
                    pattern="(^\d{5}$)|(^\d{5}-\d{4}$)"
                    placeholder="CAP"
                    variant="inputs.dark"
                    register={register}
                    errors={errors}
                    validationSchema={{
                      required: "Questo campo è obbligatorio.",
                      onChange: (e) => onUpdateField(e),
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    pl: [0, 1, 1, 1],
                    pb: [3, 3, 3, 3],
                    width: ["100%", "65%"],
                  }}
                >
                  <CustomInput
                    id="nazione"
                    label="Nazione"
                    type="select"
                    name="country_code"
                    placeholder="Nazione"
                    variant="inputs.dark"
                    register={register}
                    errors={errors}
                    validationSchema={{
                      required: "Questo campo è obbligatorio.",
                      onChange: (e) => onUpdateField(e),
                    }}
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
                  type="text"
                  name="phone"
                  placeholder="Numero di telefono"
                  variant="inputs.dark"
                  register={register}
                  errors={errors}
                  validationSchema={{
                    required: "Questo campo è obbligatorio.",
                    onChange: (e) => onUpdateField(e),
                  }}
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
          <>
            <Box sx={{ pb: [6] }}>Indirizzo aggiunto</Box>
            <InboundLink to="/account/addresses">
              Visualizza i tuoi indirizzi
            </InboundLink>
          </>
        ) : (
          <Box>Errore</Box>
        )}
      </Container>
    </Box>
  );
};

export default AddAddress;
