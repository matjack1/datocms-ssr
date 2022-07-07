import React from "react";
import { Box, Flex } from "theme-ui";
import CartIcon from "./cartIcon";
import { InboundLink } from "./link";
import LoginButton from "./loginLink";
import LogoutButton from "./logoutButton";
import UserIcon from "./userIcon";

const Nav = () => {
  return (
    <Box>
      <Flex sx={{ justifyContent: "space-between" }}>
        <InboundLink to="/">Home</InboundLink>
        <UserIcon />
        <CartIcon />
        <LoginButton />
        <LogoutButton />
      </Flex>
    </Box>
  );
};

export default Nav;
