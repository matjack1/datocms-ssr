import React, { useContext, useState, useEffect } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import {
  Box,
  Container,
  Heading,
  Label,
  Input,
  Text,
  Checkbox,
  Textarea,
  Button,
  Flex,
  Grid,
} from "theme-ui";
import CustomerTokenContext from "../../../../hooks/customerTokenContext";
import Nav from "../../../nav";
import { navigate } from "gatsby";
import { InboundLink } from "../../../link";
import { useParams } from "@reach/router";
import { useClSdk } from "../../../../hooks/useClSdk";
import CustomerContext from "../../../../hooks/customerContext";
import CustomBreadcrumbs from "../../../customBreadcrumbs";
import ProductThumb from "../../../productThumb";
import CustomInput from "../../../customInput";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

const CustomerOrderReturn = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [customerMetadata, setCustomerMetadata] = useState();
  const [order, setOrder] = useState();
  const [orderId, setOrderId] = useState(useParams().orderId);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    customer: "",
    message: "",
    order: "",
    products: [],
  });

  const cl = useClSdk();

  const getOrder = async (id) => {
    const handleError = (e) => {
      console.log("invalid token", e);
    };

    const order = await cl.orders
      .retrieve(id, { include: ["line_items"], filters: { status: "draft" } })
      .catch(handleError);

    if (order) {
      console.log("order", order);
      setOrder(order);
    }
  };

  const handleReturnMail = async (event) => {
    const form = event.target;
    event.preventDefault();

    const data = formData;

    axios
      .post("/.netlify/functions/returnMail", data)
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

  useEffect(() => {
    if (customer && customer.metadata) {
      setCustomerMetadata(customer.metadata);
      const nextFormState = {
        ...formData,
        customer: customer.email,
      };
      setFormData(nextFormState);
    }
  }, [customer]);

  useEffect(() => {
    getOrder(orderId);
    const nextFormState = {
      ...formData,
      order: orderId,
    };
    setFormData(nextFormState);
    setTimeout(() => {
      setShowSkeleton(false);
    }, 300);
  }, [orderId]);

  const handleReturnSkus = (e, item) => {
    let tmpProducts = JSON.parse(JSON.stringify(formData.products));

    e.target.checked
      ? tmpProducts.push({
          name: item.name,
          sku_code: item.sku_code,
        })
      : (tmpProducts = tmpProducts.filter(
          (value) => value.sku_code != item.sku_code
        ));

    let nextFormState = {
      ...formData,
      products: tmpProducts,
    };

    setFormData(nextFormState);
  };

  const onUpdateField = (e) => {
    const nextFormState = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(nextFormState);
  };

  return (
    <Box>
      <Container>
        {order && !showSkeleton ? (
          <>
            <CustomBreadcrumbs
              data={{
                pages: [
                  {
                    slug: "/",
                    title: "Home",
                  },
                  {
                    slug: "/account/orders",
                    title: "Ordini",
                  },
                ],
                current: {
                  title: "Dettaglio ordine",
                },
              }}
            />
            <Heading as="h1" variant="h2" sx={{ color: "primary" }}>
              Richiedi un reso
            </Heading>
            <Grid columns={[".7fr .3fr"]} gap={[12]}></Grid>
            <Box as="form" onSubmit={handleReturnMail}>
              <Box sx={{ pb: [7] }}>Seleziona articoli</Box>
              <Grid sx={{ gridTemplateRows: "auto" }} gap={[8]}>
                {order.line_items.map(
                  (item, index) =>
                    item.sku_code && (
                      <Box>
                        <Label
                          sx={{
                            pb: [3],
                            display: "flex",
                            alignItems: "start",
                            color: "dark",
                            svg: {
                              color: "lightBorder",
                            },
                            "input:checked ~ svg": {
                              color: "secondary",
                              outlineColor: "secondary",
                            },
                            "input:focus ~ svg": {
                              color: "secondary",
                            },
                          }}
                        >
                          <Checkbox
                            sx={{
                              color: "dark",
                              "input:checked~&": {
                                color: "secondary",
                                outlineColor: "secondary",
                              },
                            }}
                            name={"item" + (index - 2)}
                            onChange={(e) => {
                              handleReturnSkus(e, item);
                            }}
                          />
                          <Box
                            sx={{
                              pl: [4],
                              'a[aria-current="page"]': {
                                pointerEvents: "none",
                              },
                            }}
                          >
                            <ProductThumb sku={item} horizontal={true} />
                          </Box>
                        </Label>
                      </Box>
                    )
                )}
              </Grid>
              {formData.products.length > 0 && (
                <>
                  <Box
                    sx={{
                      borderBottom: "1px solid",
                      borderColor: "lightBorder",
                      pt: [6],
                      mb: [6],
                    }}
                  />
                  <Box>
                    <Heading
                      as="h2"
                      variant="h2"
                      sx={{ fontWeight: "400", mb: [7] }}
                    >
                      Motivazione della richiesta
                    </Heading>
                    <CustomInput
                      id="reason"
                      label="Motivo del reso"
                      onChange={onUpdateField}
                      type="textarea"
                      name="message"
                      placeholder="Motivo del reso (min.250 caratteri)"
                      variant="inputs.dark"
                      rows={8}
                      minLength={250}
                      required
                    />
                  </Box>
                  <Box sx={{ pb: [9], pt: [7] }}>
                    La richiesta di reso verrà esaminata dal nostro servizio
                    clienti per accettazione.
                  </Box>

                  <Box>
                    <Button
                      sx={{
                        textAlign: "center",
                        fontSize: [3],
                        fontWeight: "600",
                        borderRadius: "unset",
                        p: [3],
                        px: [11],
                      }}
                      type="submit"
                      variant="buttons.primary"
                    >
                      Inoltra la richiesta di reso
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Skeleton width={"50%"} />
              <Skeleton width={"40%"} />
            </Box>
            <Box sx={{ my: 4 }}>
              <Grid
                sx={{
                  gridTemplateColumns: ["168px 1fr"],
                }}
                gap={[10]}
              >
                <Skeleton width={"100%"} height={"168px"} />
                <Flex
                  sx={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box>
                      <Skeleton width={"100%"} />
                    </Box>
                    <Box>
                      <Skeleton width={"100%"} />
                    </Box>
                    <Box>
                      <Skeleton width={"100%"} />
                    </Box>
                    <Box>
                      <Skeleton width={"100%"} />
                    </Box>
                    <Box>
                      <Skeleton width={"100%"} />
                    </Box>
                  </Box>
                </Flex>
              </Grid>
              <Box sx={{ my: 5 }}>
                <Box sx={{ pb: [5] }}>
                  <Skeleton width={"40%"} />
                </Box>
                <Box sx={{ pb: [5] }}>
                  <Skeleton width={"100%"} height={"200px"} />
                </Box>
                <Box sx={{ pb: [5] }}>
                  <Skeleton width={"30%"} />
                </Box>
                <Skeleton width={"30%"} />
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CustomerOrderReturn;
