import React, { useContext } from "react";
import { Box, Flex } from "theme-ui";
import CartIcon from "./cartIcon";
import { InboundLink } from "./link";
import LoginButton from "./loginLink";
import LogoutButton from "./logoutButton";
import UserIcon from "./userIcon";
import { MenuContext } from "../hooks/MenuContext";
import { getCategoryPath } from "../utils/path";

const SecondaryNav = () => {
  const menu = useContext(MenuContext);

  return (
    <Flex>
      {menu &&
        menu.length > 0 &&
        menu.map((menuItem) => (
          <Box
            sx={{
              mr: [10],
              a: { fontWeight: "600", fontSize: [2], textDecoration: "none" },
            }}
            key={menuItem.id}
          >
            <InboundLink to={getCategoryPath(menuItem, menuItem.locale)}>
              {menuItem.name}
            </InboundLink>
          </Box>
        ))}
    </Flex>
  );
};

export default SecondaryNav;
