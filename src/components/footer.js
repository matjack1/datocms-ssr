import {
  Box,
  Container,
  Flex,
  Grid,
  Text,
  Image,
  Heading,
} from "@theme-ui/components";
import React from "react";
import { useFooter } from "../hooks/useFooter";
import { MagicLink } from "../utils/magicLink";
import { i18nContext } from "../hooks/i18nContext";
import Logo from "../assets/img/logo.svg";

const Footer = () => {
  const footer = useFooter();

  footer.map((footerItem) => {
    footerItem.treeChildren.sort((a, b) => a.position - b.position);
    footerItem.treeChildren.map((footerItem) => {
      if (footerItem.treeChildren.length > 0) {
        footerItem.treeChildren.sort((a, b) => a.position - b.position);
      }
    });
  });

  return (
    <Box
      className="footer"
      as="footer"
      sx={{
        backgroundColor: "dark",
        py: 5,
        position: "relative",
        color: "light",
      }}
    >
      <i18nContext.Consumer>
        {(t) => (
          <>
            <Container>
              <Grid columns={[1, `1fr 2.5fr 1fr `]} gap={[7, 8]}>
                {footer.map((column) => (
                  <List key={column.id}>
                    {column.treeChildren.map((link) => (
                      <Item>
                        <Text sx={{ fontWeight: "400", display: "block" }}>
                          {link.link ? (
                            <MagicLink item={link.link} />
                          ) : (
                            link.anchor
                          )}
                        </Text>
                        {link.treeChildren.length > 0 && (
                          <List key={link.id}>
                            {link.treeChildren.map((link) => (
                              <Item>
                                {link.link ? (
                                  <MagicLink item={link.link} />
                                ) : (
                                  link.anchor
                                )}
                              </Item>
                            ))}
                          </List>
                        )}
                      </Item>
                    ))}
                  </List>
                ))}
              </Grid>
            </Container>
          </>
        )}
      </i18nContext.Consumer>
    </Box>
  );
};

const List = (props) => {
  return (
    <Box
      {...props}
      sx={{
        p: 0,
        columns: 2,
        listStyle: "none",
        a: {
          fontSize: [0],
          color: "light",
          fontWeight: "400",
          textDecoration: "none",
          "&.active": {
            color: "light",
          },
          "&:hover": {
            textDecoration: "underline",
          },
        },
      }}
      as="ul"
    />
  );
};

const Item = (props) => {
  return <Box {...props} as="li" sx={{ "&:last-child": { mb: 0 } }} />;
};

export default Footer;
