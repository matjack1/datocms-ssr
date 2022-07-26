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
        <InboundLink to="/account/favourites">
          <Box
            dangerouslySetInnerHTML={{
              __html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
            }}
          />
        </InboundLink>
        <CartIcon />
        <LoginButton />
        <LogoutButton />
      </Flex>
    </Box>
  );
};

export default Nav;
