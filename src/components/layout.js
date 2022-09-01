import React, { useEffect, useState, useContext } from "react";
import { Box, Container, Heading, Flex } from "theme-ui";
import Header from "./header";
import { HeaderMenuContext } from "../hooks/headerMenuContext";
import { useMenu } from "../hooks/useMenu";
import Footer from "./footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerTokenContext from "../hooks/customerTokenContext";
import { navigate } from "gatsby";

const Layout = ({ title, children }) => {
  const menu = useMenu();
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);

  console.log(
    "location.pathname",window.location.pathname
  );

  useEffect(() => {
    if (
      !customerToken &&
      typeof window != "undefined" &&
      (window.location.pathname !== `/login` ||
        window.location.pathname !== `/forgot-password` ||
        window.location.pathname !== `/reset-password`)
    ) {
      // If we’re not logged in, redirect to the home page.
      navigate(`/login`);
    }
  }, [customerToken]);

  return (
    customerToken && (
      <Box>
        <HeaderMenuContext.Provider value={menu}>
          <Flex
            sx={{
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "100vh",
            }}
          >
            <Header title={title} />
            <Box as="main">{children}</Box>
            <Footer />
          </Flex>
        </HeaderMenuContext.Provider>
        <ToastContainer />
      </Box>
    )
  );
};

export default Layout;
