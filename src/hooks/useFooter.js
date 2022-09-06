import React from "react";
import { useStaticQuery, graphql } from "gatsby";

export const useFooter = () => {
  const menu = useStaticQuery(graphql`
    query FooterQuery {
      allDatoCmsFooter {
        nodes {
          id
          locale
          content {
            ... on DatoCmsTextBlock {
              title
              body {
                blocks
                value
              }
              model {
                apiKey
              }
            }
            ... on DatoCmsImageGallery {
              title
              images { 
                url
                gatsbyImageData(placeholder: BLURRED, forceBlurhash: false)
              }
              model {
                apiKey
              }
            }
          }
          copyright
          policies {
            ... on DatoCmsInternalLink {
              id
              anchor
              locale
              model {
                apiKey
              }
              link {
                ... on DatoCmsPage {
                  root
                  model {
                    apiKey
                  }
                  _allSlugLocales {
                    locale
                    value
                  }
                }
              }
            }
            ... on DatoCmsExternalLink {
              id
              anchor
              url
              model {
                apiKey
              }
            }
          }
        }
      }
    }
  `);

  const locale = "it";

  const i18nFooter = menu.allDatoCmsFooter.nodes.filter(
    (link) => link.locale === locale
  );

  return i18nFooter[0];
};
