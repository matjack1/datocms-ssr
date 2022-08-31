import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Label,
  Radio,
  Text,
  Button,
  Heading,
  Flex,
} from "theme-ui";
import Modal from "react-modal";
import { useClSdk } from "../hooks/useClSdk";
import { navigate } from "gatsby";
import { toast } from "react-toastify";

Modal.defaultStyles.overlay.zIndex = 99999;
Modal.defaultStyles.overlay.backgroundColor = "rgba(255, 255, 255, 0.65)";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    border: "1px solid",
    borderColor: "dark",
    borderRadius: "unset",
    zIndex: 9999,
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#___gatsby");

const CustomerAddress = ({ address, updateAddresses }) => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const customerAddressId = address.id;
  const addressId = address.address.id;
  const cl = useClSdk();

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  const {
    id,
    company,
    line_1,
    line_2,
    zip_code,
    city,
    state_code,
    country_code,
    phone,
    full_name,
  } = address.address;

  
  const handleDeleteAddress = async (id) => {
    const handleError = (e) => {
      console.log("error", e);
      if (e.errors[0].code === "INVALID_TOKEN") {
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    let deletedCustomerAddress = await cl.customer_addresses
      .delete(id)
      .catch(handleError);

    let deletedAddress = await cl.addresses
      .delete(addressId)
      .catch(handleError);

    console.log(
      "deletedAddress,deletedCustomerAddress",
      deletedAddress,
      deletedCustomerAddress
    );

    console.log("toast.success");
    toast.success("Indirizzo cancellato", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });

    updateAddresses(true);
    closeModal();
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        height: "100%",
        borderColor: "dark",
        px: [4],
        py: [6],
      }}
    >
      {full_name && (
        <Box sx={{ pb: [5] }}>
          <Heading as="h2" variant="h5" sx={{ my: [0] }}>
            {full_name}
          </Heading>
        </Box>
      )}
      <Box sx={{ pb: [6] }}>
        {line_1 && <Box>{line_1}</Box>}
        {line_2 && <Box>{line_2}</Box>}
        <Box>
          {zip_code && zip_code} {city && city} {state_code && state_code}{" "}
          {country_code && `(${country_code})`}{" "}
        </Box>
        <Box>{phone && phone}</Box>
      </Box>

      <Button onClick={openModal} variant="buttons.primary">
        Elimina
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Box sx={{ pb: [5] }}>
          <Text>Confermi di eliminare l'indirizzo selezionato?</Text>
        </Box>
        <Box sx={{ pb: [6] }}>
          {full_name && (
            <Box sx={{ pb: [5] }}>
              <Heading as="h2" variant="h5" sx={{ my: [0] }}>
                {full_name}
              </Heading>
            </Box>
          )}
          <Box>
            {line_1 && <Box>{line_1}</Box>}
            {line_2 && <Box>{line_2}</Box>}
            <Box>
              {zip_code && zip_code} {city && city} {state_code && state_code}{" "}
              {country_code && `(${country_code})`}{" "}
            </Box>
            <Box>{phone && phone}</Box>
          </Box>
        </Box>
        <Box>
          <Button
            sx={{ cursor: "pointer" }}
            onClick={() => handleDeleteAddress(customerAddressId)}
          >
            Elimina
          </Button>
          <Button sx={{ cursor: "pointer", ml: [2] }} onClick={closeModal}>
            Annulla
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomerAddress;
