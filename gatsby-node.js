exports.createPages = async function ({ actions, graphql }) {
  const { createPage } = actions;
  const { data } = await graphql(`
    query CreatePageQuery {
      site: datoCmsSite {
        locale
        locales
      }

      skus: allDatoCmsSku(filter: { slug: { ne: null } }) {
        nodes {
          id
          slug
          locale
        }
      }

      categories: allDatoCmsCategory(filter: { slug: { ne: null } }) {
        nodes {
          id
          slug
          locale
          root
          treeParent {
            id
            slug
            root
            treeParent {
              id
              slug
              root
            }
          }
        }
      }
    }
  `);

  function isRoot(page) {
    return page.root;
  }

  function getCategoryPath(category) {
    let lang =
      category.locale === data.site.locale
        ? ""
        : `${category.locale.toLowerCase()}/`;
    let path = `${category.slug}/`;

    if (category.treeParent.root) {
      return lang + path;
    }
    path = `${category.treeParent.slug}/${path}`;
    return lang + path;
  }

  data.categories.nodes.map((page) => {
    !isRoot(page)
      ? actions.createPage({
          path: getCategoryPath(page),
          component: require.resolve(`./src/templates/categoryPage.js`),
          context: {
            id: page.id,
            locale: page.locale,
            parentId: page.treeParent.id,
          },
        })
      : null;
  });

  data.skus.nodes.map((page) => {
    actions.createPage({
      path: `prodotto/${page.slug}/`,
      component: require.resolve(`./src/templates/skuPage.js`),
      context: {
        id: page.id,
        locale: page.locale,
      },
    });
  });
};
