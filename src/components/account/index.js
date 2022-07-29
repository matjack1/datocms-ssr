import React from "react";
import Layout from "../layout";
import { InboundLink } from "../link";
import { Box } from "theme-ui";

const CustomerAccount = () => {
  return (
    <Box>
      <Box>
        <InboundLink to={"/account/orders"}>Tutti gli ordini</InboundLink>
      </Box>
      <Box>
        <InboundLink to={"/account/addresses"}>I tuoi indirizzi</InboundLink>
      </Box>
      <Box>
        <InboundLink to={"/account/payment"}>Metodi di pagamenti</InboundLink>
      </Box>
      <Box>
        <InboundLink to={"/account/billinginfo"}>
          Dati aziendali
        </InboundLink>
      </Box>
      <Box>
        <InboundLink to={"/account/settings"}>Impostazioni</InboundLink>
      </Box>
      <Box>
        <InboundLink to={"/account/support"}>Assistenza</InboundLink>
      </Box>
    </Box>
  );
};

export default CustomerAccount;
