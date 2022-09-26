import React, { useContext, useEffect, useState } from "react";
import { Box, Flex } from "theme-ui";
import CartIcon from "./cartIcon";
import { InboundLink } from "./link";
import LoginButton from "./loginLink";
import LogoutButton from "./logoutButton";
import UserIcon from "./userIcon";
import { HeaderMenuContext } from "../hooks/headerMenuContext";
import { getCategoryPath } from "../utils/path";
import SideBar from "./sidebar";

const SecondaryNav = () => {
  const menu = useContext(HeaderMenuContext);
  const [menuData, setMenuData] = useState();
  const [sideBarData, setSideBarData] = useState();

  // STATE TO TRACK IF SIDEDRAWER IS OPEN OR CLOSED
  const [showSideDrawer, setshowSideDrawer] = useState(false);

  //  FUNCTION TO HANDLE CLOSE ACTION ON SIDEDRAWER/MODAL
  const sideDrawerClosedHandler = () => {
    setshowSideDrawer(false);

    // Unsets Background Scrolling to use when SideDrawer/Modal is closed
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "unset";
    }
    
  };

  // FUNCTION TO HANDLE OPEN ACTION ON SIDEDRAWER/MODAL
  const showSidebar = (sidebarLinks,parent) => {
    setshowSideDrawer(true);

    let allData = [parent].concat(sidebarLinks);

    setSideBarData(allData);

    // Disables Background Scrolling whilst the SideDrawer/Modal is open
    if (typeof window != "undefined" && window.document) {
      // document.body.style.overflow = "hidden";
    }
  };


  return (
    <>
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
              {menuItem.treeChildren.length > 0 ? (
                <Box sx={{
                  "&:hover":{
                    color:"primary",
                    cursor:"pointer"
                  }
                }} onClick={() => showSidebar(menuItem.treeChildren,menuItem)}>
                  {menuItem.link.link.name}
                </Box>
              ) : (
                <Box>
                  <InboundLink
                    to={getCategoryPath(menuItem.link.link, menuItem.locale)}
                  >
                    {menuItem.link.link.name}
                  </InboundLink>
                </Box>
              )}
            </Box>
          ))}
      </Flex>
      <SideBar open={showSideDrawer} sideBarData={sideBarData} closed={sideDrawerClosedHandler} />
    </>
  );
};

export default SecondaryNav;
