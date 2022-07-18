import React, { useContext, useState } from "react";
import { getCustomerToken } from "@commercelayer/js-auth";
import { Box, Container, Heading, Label, Input, Text } from "theme-ui";
import { navigate } from "gatsby";
import { InboundLink } from "../components/link";
import { Router } from "@reach/router";
import Layout from "../components/layout";
import PrivateRoute from "../components/privateRoute";
import CustomerOrders from "../components/account/orders";
import Addresses from "../components/account/addresses";
import Payments from "../components/account/payment";
import BillingInfo from "../components/account/billinginfo";
import Support from "../components/account/support";
import CustomerOrder from "../components/account/orders/order";
import CustomerOrderReturn from "../components/account/orders/order/return";
import CustomerAccount from "../components/account"

const AccountPage = () => {
  return (
    <Box>
      <Layout>
        <Router>
          <PrivateRoute path="/account/" component={CustomerAccount} />
          <PrivateRoute path="/account/orders" component={CustomerOrders} />
          <PrivateRoute
            path="/account/orders/:orderId"
            component={CustomerOrder}
          />
          <PrivateRoute
            path="/account/orders/:orderId/return"
            component={CustomerOrderReturn}
          />
          <PrivateRoute path="/account/addresses" component={Addresses} />
          <PrivateRoute path="/account/payment" component={Payments} />
          <PrivateRoute path="/account/billinginfo" component={BillingInfo} />
          <PrivateRoute path="/account/support" component={Support} />
        </Router>
      </Layout>
    </Box>
  );
};

export default AccountPage;
