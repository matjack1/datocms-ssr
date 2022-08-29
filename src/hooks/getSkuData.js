import { buildClient, LogLevel } from "@datocms/cma-client-browser";

export default async function getSkuData(sku) {
  const client = buildClient({
    apiToken: "7f672cb51a4f9c2dce0c59b466b8c6",
    logLevel: LogLevel.BASIC,
  });

  try {
    const record = await client.items.list({
      filter: {
        type: "313716",
        fields: {
          code: {
            eq: sku,
          },
        },
      },
    });
    return record[0];
  } catch (e) {
    throw e;
  }
}
