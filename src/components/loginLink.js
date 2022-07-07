import React, { useContext } from "react";
import CustomerTokenContext from "../hooks/customerTokenContext";
import { InboundLink } from "./link";

const LoginButton = () => {
  const { customerToken } = useContext(CustomerTokenContext);
  return (
    <>{!customerToken && <InboundLink to="/login/">Accedi</InboundLink>}</>
  );
};

export default LoginButton;
