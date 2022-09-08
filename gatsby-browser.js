import React from "react";
import { CartProvider } from "./src/hooks/cartContext";
import { CustomerProvider } from "./src/hooks/customerContext";
import { CustomerTokenProvider } from "./src/hooks/customerTokenContext";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import "./src/assets/style/layout.css"

export const wrapRootElement = ({ element }) => (
  <GoogleReCaptchaProvider reCaptchaKey="6LcO1fwcAAAAABy6FQV1uABJKmwgBibKZAQ52Sn3">
    <CustomerTokenProvider>
      <CustomerProvider>
        <CartProvider>{element}</CartProvider>
      </CustomerProvider>
    </CustomerTokenProvider>
  </GoogleReCaptchaProvider>
);
