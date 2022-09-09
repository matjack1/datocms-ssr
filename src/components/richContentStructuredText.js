import React from "react"
import { Box, Text } from "@theme-ui/components"
import { StructuredText } from "react-datocms"
import {
  isHeading,
  isParagraph,
  isList,
  renderRule,
} from "datocms-structured-text-utils"
import { MagicLink } from "../utils/magicLink"

const RichContentStructuredText = ({ text, theme }) => {
  const componentTheme = theme || "light"
  const light = componentTheme === "light" ? "light" : "dark"
  const dark = componentTheme === "light" ? "dark" : "light"
  return (
    <Box
      sx={{
        "*:first-child": {
          marginTop: 0,
        },
        "*:last-child": {
          marginBottom: 0,
        },
      }}
    >
      {text && text.value && (
        <StructuredText
          data={text}
          renderLinkToRecord={({ record }) => {
            switch (record.__typename) {
              case "DatoCmsInternalLink":
                return <MagicLink item={record} lcoale={record.locale} />
              default:
                return null
            }
          }}
          renderInlineRecord={({ record }) => {
            switch (record.__typename) {
              case "DatoCmsInternalLink":
                return <Box>{
                  <MagicLink item={record} lcoale={record.locale} />
                }</Box>
              default:
                return null
            }
          }}
          renderBlock={({ record }) => {
            // console.log(record)
            switch (record.__typename) {
              default:
                return null
            }
          }}
          customRules={[
            renderRule(
              isHeading,
              ({ adapter: { renderNode }, node, children, key }) => {
                return renderNode(
                  () => {
                    return (
                      <Text
                        as={`h${node.level}`}
                        variant={`h${node.level}`}
                        color={"primary"}
                      >
                        {children}
                      </Text>
                    )
                  },
                  { key },
                  children
                )
              }
            ),
            renderRule(
              isParagraph,
              ({ adapter: { renderNode }, node, children, key }) => {
                return renderNode(
                  () => {
                    return (
                      <Text as="p" variant="p" mb={3} >
                        {children}
                      </Text>
                    )
                  },
                  { key },
                  children
                )
              }
            ),
            renderRule(
              isList,
              ({ adapter: { renderNode }, node, children, key }) => {
                return renderNode(
                  () => {
                    return (
                      <Box mt={4}>
                        <Box
                          as={node.style === "numbered" ? "ol" : "ul"}
                          mb={3}
                          sx={{
                            color: dark,
                            listStyle: "none",
                            columns: [1, 1, 1, 2],
                            margin: 0,
                            padding: 0,
                            li: {
                              display: "flex",
                              counterIncrement: "inst",
                              mb: 3,
                              alignItems: "center",
                              "&::before": {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                content: "counter(inst)",
                                marginRight: 4,
                                width: "2rem",
                                height: "2rem",
                                position: "relative",
                                lineHeight: "body",
                                backgroundColor: dark,
                                color: light,
                                borderRadius: "full",
                              },
                              p: {
                                mb: 0,
                              },
                            },
                          }}
                        >
                          {children}
                        </Box>
                      </Box>
                    )
                  },
                  { key },
                  children
                )
              }
            ),
          ]}
        />
      )}
    </Box>
  )
}

export default RichContentStructuredText
