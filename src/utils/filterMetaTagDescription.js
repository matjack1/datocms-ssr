const FilterMetaTagDescription = seoMetaTags => {
    const filterMetaArray = {
      tags: seoMetaTags.tags.map((metaTag, index) => {
        if (
          metaTag.attributes &&
          (metaTag.attributes.name
            ? metaTag.attributes.name.includes("description")
            : metaTag.attributes.property.includes("description")) &&
          metaTag.attributes.content === "EMPTY_STRING"
        ) {
          return {}
        } else return metaTag
      }),
    }
    return filterMetaArray
  }
  
  export default FilterMetaTagDescription
  