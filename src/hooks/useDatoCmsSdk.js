import { buildClient } from "@datocms/cma-client-browser";

export const useDatoCmsSdk = () => {
  return buildClient({ apiToken: "7f672cb51a4f9c2dce0c59b466b8c6" });
};
