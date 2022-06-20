import { Link } from "gatsby";
import React, { useContext } from "react";
import CustomerTokenContext from "../hooks/customerTokenContext";

const LoginButton = () => {
  const { customerToken } = useContext(CustomerTokenContext);
  return <>{!customerToken && <Link to="/login/">Accedi</Link>}</>;
};

export default LoginButton;
