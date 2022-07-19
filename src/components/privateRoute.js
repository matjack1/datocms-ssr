import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { navigate } from "gatsby";
import CustomerTokenContext from "../hooks/customerTokenContext";

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  
  useEffect(() => {
    if (!customerToken && location.pathname !== `/login`) {
      // If we’re not logged in, redirect to the home page.
      navigate(`/login`);
    }
  }, [customerToken]);

  return customerToken && <Component {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

export default PrivateRoute;
