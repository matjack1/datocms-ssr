import React, { useEffect, useState } from "react";
import { Box, Checkbox, Label, Radio, Text, Button } from "theme-ui";
import Modal from "react-modal";
import { useClSdk } from "../hooks/useClSdk";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
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
  } = address.address;

  const handleDeleteAddress = async (id) => {
    let deletedCustomerAddress = await cl.customer_addresses
      .delete(id)
      .catch((error) => {
        console.log(error);
      });

    let deletedAddress = await cl.addresses.delete(addressId).catch((error) => {
      console.log(error);
    });

    updateAddresses(true);
    closeModal();
  };

  return (
    <Box sx={{ border: "1px solid", borderColor: "dark" }}>
      {company && (
        <Box>
          <strong>{company}</strong>
        </Box>
      )}
      {line_1 && <Box>{line_1}</Box>}
      {line_2 && <Box>{line_2}</Box>}
      <Box>
        {zip_code && zip_code} {city && city} {state_code && state_code}{" "}
        {country_code && `(${country_code})`}{" "}
      </Box>
      <Box>{phone && phone}</Box>
      <Button onClick={openModal}>Elimina</Button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Box>
          <Text>Confermi di eliminare l'indirizzo selezionato?</Text>
        </Box>
        <Box>
          <Text>{address.name}</Text>
        </Box>
        <Button
          sx={{ cursor: "pointer" }}
          onClick={() => handleDeleteAddress(customerAddressId)}
        >
          Elimina
        </Button>
        <Button sx={{ cursor: "pointer" }} onClick={closeModal}>
          Annulla
        </Button>
      </Modal>
    </Box>
  );
};

export default CustomerAddress;
