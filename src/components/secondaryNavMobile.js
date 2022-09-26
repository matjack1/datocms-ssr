import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Flex, Grid } from "theme-ui";
import CartIcon from "./cartIcon";
import { InboundLink } from "./link";
import LoginButton from "./loginLink";
import LogoutButton from "./logoutButton";
import UserIcon from "./userIcon";
import { HeaderMenuContext } from "../hooks/headerMenuContext";
import { getCategoryPath } from "../utils/path";
import SidebarMobile from "./sidebarMobile";
import { RiMenu2Line } from "react-icons/ri";

const SecondaryNavMobile = () => {
  const menu = useContext(HeaderMenuContext);
  const [menuData, setMenuData] = useState();
  const [sideBarData, setSideBarData] = useState();
  const [openSecondary, setOpenSecondary] = useState(null);

  // STATE TO TRACK IF SIDEDRAWER IS OPEN OR CLOSED
  const [showSideDrawer, setshowSideDrawer] = useState(false);

  //  FUNCTION TO HANDLE CLOSE ACTION ON SIDEDRAWER/MODAL
  const sideDrawerClosedHandler = () => {
    setshowSideDrawer(false);
    setOpenSecondary(null);

    // Unsets Background Scrolling to use when SideDrawer/Modal is closed
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "unset";
    }
  };

  const handleOpenSecondary = (menuItem) => {
    setOpenSecondary(menuItem);

    // Disables Background Scrolling whilst the SideDrawer/Modal is open
    if (typeof window != "undefined" && window.document) {
      // document.body.style.overflow = "hidden";
    }
  };

  // FUNCTION TO HANDLE OPEN ACTION ON SIDEDRAWER/MODAL
  const showSidebar = (sidebarLinks, parent) => {
    setshowSideDrawer(true);

    // Disables Background Scrolling whilst the SideDrawer/Modal is open
    if (typeof window != "undefined" && window.document) {
      // document.body.style.overflow = "hidden";
    }
  };

  return (
    <>
      <Grid columns={["auto 1fr"]} gap={[0]}>
        <Flex
          sx={{ alignItems: "center", px: [3] }}
          onClick={() => showSidebar(true)}
        >
          <RiMenu2Line size={24} />
        </Flex>
        <Box
          sx={{ py: [5], borderLeft: "1px solid", borderColor: "dark" }}
        ></Box>
      </Grid>
      {menu && menu.length > 0 && (
        <>
          <SidebarMobile
            open={showSideDrawer}
            mobile={true}
            sideBarData={menu}
            closed={sideDrawerClosedHandler}
            handleOpenSecondary={handleOpenSecondary}
          />
          <SidebarMobile
            open={openSecondary ? true : false}
            mobile={true}
            sideBarData={openSecondary}
            closed={sideDrawerClosedHandler}
            closeBar={() => setOpenSecondary(null)}
          />
        </>
      )}
    </>
  );
};

export default SecondaryNavMobile;
