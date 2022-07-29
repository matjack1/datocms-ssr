import React from "react";
import { Box, Flex, Image } from "theme-ui";
import CartIcon from "./cartIcon";
import { InboundLink } from "./link";
import LoginButton from "./loginLink";
import LogoutButton from "./logoutButton";
import UserIcon from "./userIcon";
import Logo from "../assets/img/logo.svg";
import { BiBookmark } from "react-icons/bi";

const Nav = () => {
  return (
    <Box>
      <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <InboundLink to="/">
            <Image src={Logo} sx={{ minHeight: "80px" }} />
          </InboundLink>
        </Box>
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ mx: [2] }}>
            <UserIcon />
          </Box>
          <Box sx={{ mx: [2] }}>
            <InboundLink to="/account/favourites">
              <BiBookmark size={24} />
            </InboundLink>
          </Box>
          <Box sx={{ mx: [2] }}>
            <CartIcon />
          </Box>
          <LoginButton />
          <LogoutButton />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Nav;
