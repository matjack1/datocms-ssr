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

const CustomerOrderReturn = () => {
  const { customer, setCustomer } = useContext(CustomerContext);
  const [customerMetadata, setCustomerMetadata] = useState();
  const [order, setOrder] = useState();
  const [orderId, setOrderId] = useState(useParams().orderId);
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

  useEffect(() => {
    console.log("customer", customer);
    if (customer && customer.metadata) setCustomerMetadata(customer.metadata);
  }, [customer]);

  useEffect(() => {
    console.log("useParams()", orderId);
    getOrder(orderId);
  }, [orderId]);

  const handleAskReturn = (e) => {
    e.preventDefault();

    let obj = {
      products: [],
      message: e.target.reason.value,
    };

    order.line_items.map((item, index) => {
      if (
        e.target["item" + (index - 2)] &&
        e.target["item" + (index - 2)].checked
      )
        obj.products.push(item);

      return item;
    });

    console.log(obj, e.target);
  };

  const onUpdateField = (e) => {
  
    // const nextFormState = {
    //   ...formData,
    //   [e.target.name]: e.target.value,
    // };
    // setFormData(nextFormState);
  };

  return (
    <Box>
      <Container>
        {order && (
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
            <Box as="form" onSubmit={handleAskReturn}>
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
                          />
                          <Box sx={{ pl: [4] }}>
                            <ProductThumb sku={item} horizontal={true} />
                          </Box>
                        </Label>
                      </Box>
                    )
                )}
              </Grid>
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
                  name="reason"
                  placeholder="Motivo del reso (min.250 caratteri)"
                  variant="inputs.dark"
                  rows={8}
                  minLength={250}
                  required
                />
              </Box>
              <Box sx={{ pb: [9], pt: [7] }}>
                La richiesta di reso verrà esaminata dal nostro servizio clienti
                per accettazione.
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
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CustomerOrderReturn;
