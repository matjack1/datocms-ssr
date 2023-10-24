module.exports = {
  siteMetadata: {
    title: `socaf-b2b`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-theme-ui",
    {
      resolve: `gatsby-source-datocms`,
      options: {
        // You can find your read-only API token under the Settings > API tokens
        // section of your administrative area. Make sure to grant both CDA and CMA permissions.
        apiToken: `cb2554ca3881543364519352673b00`,
  
        // The project environment to read from. Defaults to the primary environment:
        environment: `main`,
  
        // If you are working on development/staging environment, you might want to
        // preview the latest version of records instead of the published one:
        previewMode: false,
  
        // Disable automatic reloading of content when some change occurs on DatoCMS:
        disableLiveReload: false,
  
        // Custom API base URL (you probably don't need this!)
        // apiUrl: 'https://site-api.datocms.com',
  
        // Only source nodes for a specific set of locales. This can limit the memory usage by
        // reducing the amount of nodes created. Useful if you have a large project in DatoCMS
        // and only want to get the data from one selected locale
        // localesToGenerate: ['it', 'en'],
  
        // Setup locale fallbacks
        // In this example, if some field value is missing in Italian, fall back to English
        localeFallbacks: {
          it: ['en'],
        },
  
        // Limits page size and can be used to avoid build timeouts.
        // Default is 500
        pageSize: 100,
      },
    },
  ],
};
