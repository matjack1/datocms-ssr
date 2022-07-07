import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { Link as ThemeUiLink, NavLink as ThemeUiNavLink } from "theme-ui";

const AsLink = (props) => {
  return <GatsbyLink {...props} activeClassName="active" />;
};

const InboundLink = (props) => {
  return <ThemeUiLink as={AsLink} {...props} />;
};

export { InboundLink };
