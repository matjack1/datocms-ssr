import React, { useContext, useEffect, useState } from "react";
import { Box, Flex } from "theme-ui";
import CustomerTokenContext from "../hooks/customerTokenContext";
import CustomerContext from "../hooks/customerContext";
import { useClSdk } from "../hooks/useClSdk";
import { InboundLink } from "./link";
import AccountSideBar from "./accountSidebar";
import { navigate } from "gatsby";
import UserIconSVG from "../assets/img/icons/login.inline.svg";
import AccountSideBarMobile from "./accountSidebarMobile";
import { useResponsiveValue, useBreakpointIndex } from "@theme-ui/match-media";

const UserIcon = () => {
  const { customerToken, setCustomerToken } = useContext(CustomerTokenContext);
  const { customer, setCustomer } = useContext(CustomerContext);
  const cl = useClSdk();
  const mediaIndex = useBreakpointIndex();

  const getCostumer = async () => {
    const handleError = (e) => {
      if (e.errors[0].code === "INVALID_TOKEN") {
        setCustomerToken(null);
        navigate("/login");
        // console.log("invalid token", e);
      }
    };

    const customer = await cl.customers
      .retrieve(customerToken.owner_id, {
        include: ["orders", "orders.shipping_address", "orders.line_items"],
      })
      .catch(handleError);

    const draftOrder = customer.orders.find((x) => x.status === "draft");

    if (draftOrder && customer.email !== draftOrder.customer_email) {
      
      const order = await cl.orders
        .update({
          id: draftOrder.id,
          customer_email: customer.email,
        })
        .catch(handleError);
    }

    if (customer) {
      setCustomer(customer);
    }
  };

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
  const showSidebar = (sidebarLinks, parent) => {
    setshowSideDrawer(true);

    // Disables Background Scrolling whilst the SideDrawer/Modal is open
    if (typeof window != "undefined" && window.document) {
      // document.body.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    if (customerToken) {
      getCostumer(customerToken.owner_id);
    }
  }, [customerToken]);

  return (
    <>
      {customer && (
        <>
          <Box>
            <Box
              sx={{
                cursor: "pointer",
              }}
              onClick={() => showSidebar()}
            >
              <Flex
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Box sx={{ fontSize: [1, 3] }}>
                  {customer.metadata.company
                    ? customer.metadata.company
                    : customer.email}
                </Box>
                <Box
                  sx={{
                    ml: [2],
                    svg: {
                      height: "20px",
                      width: "auto",
                    },
                    "svg *": {
                      stroke: "dark",
                      fill:"transparent"
                    },
                  }}
                >
                  <UserIconSVG />
                </Box>
              </Flex>
            </Box>
          </Box>
          {mediaIndex > 2 ? (
            <AccountSideBar
              open={showSideDrawer}
              closed={sideDrawerClosedHandler}
            />
          ) : (
            <AccountSideBarMobile
              open={showSideDrawer}
              closed={sideDrawerClosedHandler}
            />
          )}
        </>
      )}
    </>
  );
};

export default UserIcon;
