import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export const useFooter = () => {
  const menu = useStaticQuery(graphql`
    query FooterQuery {
      allDatoCmsFooter(
        filter: { root: { eq: true }, anchor: { ne: null } }
        sort: { fields: position, order: ASC }
      ) {
        nodes {
          id
          locale
          root
          anchor
          link {
            ... on DatoCmsInternalLink {
              id
              anchor
              locale
              model {
                apiKey
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
          treeChildren {
            id
            locale
            root
            anchor
            position
            link {
              ... on DatoCmsInternalLink {
                id
                anchor
                locale
                model {
                  apiKey
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
            treeChildren {
              id
              locale
              root
              anchor
              link {
                ... on DatoCmsInternalLink {
                  id
                  anchor
                  locale
                  model {
                    apiKey
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
      }
    }
  `)

  const locale = "it"

  const i18nFooter = menu.allDatoCmsFooter.nodes.filter(
    link => link.locale === locale
  )

  return i18nFooter
}
