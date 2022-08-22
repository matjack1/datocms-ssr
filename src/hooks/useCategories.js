import React from "react";
import { useStaticQuery, graphql } from "gatsby";
// import { LanguageSwitcherContext } from "../context/languageSwitcherContext";

export const useCategories = () => {
  const menu = useStaticQuery(graphql`
    query MenuCategory {
      categories: allDatoCmsCategory(
        filter: { root: { eq: true } }
        sort: { order: ASC, fields: position }
      ) {
        nodes {
          ...CategoryDetails
          treeChildren {
            ...CategoryDetails
          }
        }
      }
    }
  `);

  // const locale = React.useContext(LanguageSwitcherContext).activeLocale;

  const i18nMenu = menu.categories.nodes.filter(
    (link) => link.locale === "it"
  );

  return i18nMenu;
};
