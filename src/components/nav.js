import { Link } from "gatsby";
import React from "react";
import { Box } from "theme-ui";
import LoginButton from "./loginLink";
import LogoutButton from "./logoutButton";
import UserIcon from "./userIcon";

const Nav = () => {
  return (
    <Box>
      <Link to="/">Home</Link>
      <UserIcon />
      <LoginButton />
      <LogoutButton />
    </Box>
  );
};

export default Nav;
