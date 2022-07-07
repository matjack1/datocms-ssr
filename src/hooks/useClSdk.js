import CommerceLayer from "@commercelayer/sdk/lib/cjs/commercelayer";
import { useContext } from "react";
import CustomerTokenContext from "./customerTokenContext";

export const useClSdk = () => {
  const { customerToken } = useContext(CustomerTokenContext);

  if (customerToken) {
    return CommerceLayer({
      organization: "socaf-s-p-a",
      accessToken: customerToken.access_token,
    });
  }
};
