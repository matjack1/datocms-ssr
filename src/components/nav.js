import React from "react";
import { Box, Flex, Image } from "theme-ui";
import CartIcon from "./cartIcon";
import { InboundLink } from "./link";
import LoginButton from "./loginLink";
import LogoutButton from "./logoutButton";
import Logo from "../assets/img/logo.svg";
import { BiBookmark } from "react-icons/bi";
import { getColor } from "@theme-ui/color";
import theme from "../gatsby-plugin-theme-ui";
import FavouritIcon from "../assets/img/icons/preferiti.inline.svg";
import UserIcon from "./userIcon";

const Nav = () => {
  const dark = getColor(theme, "dark");
  return (
    <Box>
      <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <InboundLink to="/">
            <Image
              src={Logo}
              sx={{
                height: ["30px", "80px"],
                maxHeight: ["30px", "80px"],
                minHeight: ["30px", "80px"],
              }}
            />
          </InboundLink>
        </Box>
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Flex
            sx={{
              mx: [2],
            }}
          >
            <UserIcon />
          </Flex>
          <Box sx={{ mx: [2] }}>
            <InboundLink
              to="/account/favourites"
              sx={{
                display: "flex",
                alignItems: "flex-end",
                mb: ["1px"],

                svg: {
                  height: "20px",
                  width: "auto",
                  color: "dark",
                },
              }}
            >
              <FavouritIcon />
            </InboundLink>
          </Box>
          <Box sx={{ mx: [2] }}>
            <CartIcon />
          </Box>
          <LoginButton />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Nav;
