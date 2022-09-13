exports.createPages = async function ({ page, actions, graphql }) {
  const { createPage } = actions;
  const { data } = await graphql(`
    query CreatePageQuery {
      site: datoCmsSite {
        locale
        locales
      }
      page: allDatoCmsPage(filter: { slug: { ne: null } }) {
        nodes {
          id
          slug
          locale
          root
          treeParent {
            slug
            root
            treeParent {
              slug
              root
            }
          }
        }
      }
      skus: allDatoCmsSku(filter: { slug: { ne: null } }) {
        nodes {
          id
          slug
          locale
          category {
            id
          }
        }
      }

      categories: allDatoCmsCategory(filter: { slug: { ne: null } }) {
        nodes {
          id
          slug
          locale
          root
          treeChildren {
            id
            treeChildren {
              id
            }
          }
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

  const i18nPath = {
    en: {
      search: "search",
    },
    it: {
      search: "cerca",
    },
  };

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
    let ids = [];
    ids.push(page.id);

    if (page.treeChildren.length > 0) {
      page.treeChildren.map((children) => {
        ids.push(children.id);
        if (children.treeChildren.length > 0)
          children.treeChildren.map((childofChild) => {
            ids.push(childofChild.id);
          });
      });
    }

    if (page.treeParent)
      !isRoot(page)
        ? actions.createPage({
            path: getCategoryPath(page),
            component: require.resolve(`./src/templates/categoryPage.js`),
            context: {
              id: page.id,
              locale: page.locale,
              parentId: page.treeParent.id,
              ids: ids,
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
        categoryId: page.category.id,
      },
    });
  });

  data.page.nodes.map((page) => {
    if (page.root) {
      actions.createPage({
        path:
          data.site.locale === page.locale
            ? `${i18nPath[page.locale].search}/`
            : `${page.slug}/${i18nPath[page.locale.toLowerCase()].search}/`,
        component: require.resolve("./src/templates/search.js"),
        context: {
          locale: page.locale,
          channel: page.slug,
          title: i18nPath[page.locale].search,
        },
      });
    }
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  if (page.path.match(/^\/account/)) {
    page.matchPath = `/account/*`;
    // Update the page.
    createPage(page);
  }
};
