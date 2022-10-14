// Install the API client: https://www.algolia.com/doc/api-client/getting-started/install/javascript/?client=javascript
const { GraphQLClient } = require("graphql-request");
const algoliasearch = require("algoliasearch");
const { buildClient } = require("@datocms/cma-client-node");
const datoClient = new buildClient({
  apiToken: "484b21ec92d70e11950acf0a2a890c",
});

// Get your Algolia Application ID and (admin) API key from the dashboard: https://www.algolia.com/account/api-keys
// and choose a name for your index. Add these environment variables to a `.env` file:
const ALGOLIA_APP_ID = "L90C68T5L3";
const ALGOLIA_API_KEY = "c9bc1edbfe003fbd627f5a2be38ff296";
const ALGOLIA_INDEX_NAME = "dev_SKUS";
const ALGOLIA_LANGUAGE = "it";

// Start the API client
// https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const token = "484b21ec92d70e11950acf0a2a890c";
const endpoint = "https://graphql.datocms.com/";

// Init GraphQL client
const datoGraphClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const handler = async (event, context) => {
  const language = ALGOLIA_LANGUAGE;
  const algoliaIndex = await client.initIndex(ALGOLIA_INDEX_NAME);
  const data = JSON.parse(event.body);

  const foundsku = await algoliaIndex
    .getObject(`${data.entity.id}`)
    .then((object) => {
      return object;
    })
    .catch((err) => {
      return false;
    });

  const id = data.entity.id;

  const QUERY = `
    {
        allSkus(filter: {id: { eq: ${id} }}) {
          objectID: id
          code
          category {
            name
            id
            slug
            parent {
                id
                name
                slug
            }
          }
          detergentType
          detergentUsage
          ecolabel
          gloveType
          haccp
          images {
            id
            responsiveImage(imgixParams: {fit: crop, ar: "1:1"}) {
              alt
              title
              src
            }
          }
          minimum
          multiple
          name
          description
          packaging
          pallet
          sanitizer
          ranking
          size
          slug
        }
    }
    `;

  // Fetch records
  const datoRecord = await datoGraphClient.request(QUERY).catch((err) => {
    console.error("Failed to fetch CMS data.", "\n", err.stack);
  });

  console.log("datoRecord",datoRecord)

  if (data.entity.id === "2222222") {
    if (foundsku && data.event_type === "publish") {
      console.log("-update found-");
      try {
        await algoliaIndex
          .saveObjects([tmpObj])
          // Wait for the indexing task to complete
          // https://www.algolia.com/doc/api-reference/api-methods/wait-task/
          .wait()
          .then((response) => {
            console.log(response);
            // Search the index for "Fo"
            // https://www.algolia.com/doc/api-reference/api-methods/search/
            // algoliaIndex
            //   .search("Fo")
            //   .then((objects) => console.log(objects))
            //   .catch();
          });
        return true;
      } catch (err) {
        console.log("err", err);
        return false;
      }
    } else if (foundsku && data.event_type === "delete") {
      console.log("delete found");
      try {
        await algoliaIndex
          .deleteObject(data.entity.id)
          // Wait for the indexing task to complete
          // https://www.algolia.com/doc/api-reference/api-methods/wait-task/
          .wait()
          .then((response) => {
            console.log(response);
            // Search the index for "Fo"
            // https://www.algolia.com/doc/api-reference/api-methods/search/
            // algoliaIndex
            //   .search("Fo")
            //   .then((objects) => console.log(objects))
            //   .catch();
          });
        return true;
      } catch (err) {
        console.log("err", err);
        return false;
      }
    } else if (!foundsku) {
      try {
        await algoliaIndex
          .deleteObject(data.entity.id)
          // Wait for the indexing task to complete
          // https://www.algolia.com/doc/api-reference/api-methods/wait-task/
          .wait()
          .then((response) => {
            console.log(response);
            // Search the index for "Fo"
            // https://www.algolia.com/doc/api-reference/api-methods/search/
            // algoliaIndex
            //   .search("Fo")
            //   .then((objects) => console.log(objects))
            //   .catch();
          });
        return true;
      } catch (err) {
        console.log("err", err);
        return false;
      }
    }
  }

  // allrecords.map(async (sku, index) => {
  //   setTimeout(async () => {
  //     console.log(index);

  //     const id = sku.id;

  //     const QUERY = `
  //     {
  //         allSkus(filter: {id: { eq: ${id} }}) {
  //           objectID: id
  //           code
  //           category {
  //             name
  //             id
  //             slug
  //             parent {
  //                 id
  //                 name
  //                 slug
  //             }
  //           }
  //           detergentType
  //           detergentUsage
  //           ecolabel
  //           gloveType
  //           haccp
  //           images {
  //             id
  //             responsiveImage(imgixParams: {fit: crop, ar: "1:1"}) {
  //               alt
  //               title
  //               src
  //             }
  //           }
  //           minimum
  //           multiple
  //           name
  //           description
  //           packaging
  //           pallet
  //           sanitizer
  //           ranking
  //           size
  //           slug
  //         }
  //     }
  //     `;

  //     // Fetch records
  //     const data = await client.request(QUERY).catch((err) => {
  //       haltExecution = true;
  //       console.error("Failed to fetch CMS data.", "\n", err.stack);
  //     });
  //     if (haltExecution || !data) return;

  //     obj.table.push(data.allSkus[0]);

  //     var json = JSON.stringify(obj);

  //     fs.readFile(
  //       "myjson.json",
  //       "utf8",
  //       function readFileCallback(err, data) {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           json = JSON.stringify(obj); //convert it back to json
  //           fs.writeFile("myjson.json", json, (err) => {
  //             if (err) throw err;
  //             console.log("Data written to file");
  //           });
  //         }
  //       }
  //     );
  //   }, 1500 * index);
  // })

  return {
    statusCode: 200,
    body: "Success",
  };
};

module.exports.handler = handler;

//
