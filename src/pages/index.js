import React from "react";
import Skeleton from "react-loading-skeleton";
import { getCustomerToken } from "@commercelayer/js-auth";
import fetch from "node-fetch";

const IndexPage = () => {
  return (
    <div>
      <h1>Welcome to my Gatsby site!</h1>
      <p>This is a bare page.</p>
    </div>
  );
};

export default IndexPage;
