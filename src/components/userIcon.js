import React, { useContext, useEffect } from "react";
// import CommerceLayer from "@commercelayer/sdk/lib/cjs/commercelayer";
import CommerceLayer from "@commercelayer/sdk/lib/cjs/commercelayer";
import { Box } from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";

const UserIcon = () => {
  const { customerToken } = useContext(CustomerTokenContext);
  console.log(customerToken);

  const getCostumer = async () => {
    const cl = CommerceLayer({
      organization: "socaf-s-p-a.commercelayer.io",
      accessToken: customerToken.access_token,
    });

    console.log(cl);

    const handleError = (e) => {
      console.log(e);
    };

    const customer = await cl.skus.retrieve("ZdplSqQRkk").catch(handleError);
    console.log(customer);

    // if (customer) {
    //   console.log("Success", customer);
    // }
  };

  useEffect(() => {
    if (customerToken) {
      getCostumer(customerToken.owner_id);
    }
  }, [customerToken]);
  return (
    <>
      {customerToken && (
        <Box>
          <Box>{JSON.stringify(customerToken, null, 4)}</Box>
        </Box>
      )}
    </>
  );
};

export default UserIcon;
