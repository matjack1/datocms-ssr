import { buildClient, LogLevel } from "@datocms/cma-client-browser";
const token = "7f672cb51a4f9c2dce0c59b466b8c6";

export default async function getSkuData(skus) {
  var query = `query RollDice($skus: [String]) {
    allSkus(first: 100, filter: {code: {in: $skus}}) {
      id
      name
      code
      slug
      minimum
      multiple
      size
      material
      color
      pallet
      ecolabel
      biodegradable
      sanitizer
      haccp
      detergentType
      detergentUsage
      documents {
        url
        title
      }
      images {
        id
        responsiveImage(imgixParams: {fit: crop, ar: "1:1",w: 600, h: 600 }) {
          srcSet           
            webpSrcSet
            sizes
            src
            width
            height
            aspectRatio
            alt
            title
            bgColor
            base64
        }  
      }}
    }`;

  return fetch("https://graphql.datocms.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { skus },
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("DATA", skus, res.data);
      return res.data.allSkus;
    })
    .catch((error) => {
      console.log(error);
    });
}
