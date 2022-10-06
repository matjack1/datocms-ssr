const defaultLocale = "it";

const i18nPath = {
  it: {
    category: "categoria",
    search: "cerca",
    product: "prodotto",
  },
  en: {
    category: "category",
    search: "search",
    product: "product",
  },
};

export function getCategoryPath(page, locale) {
  const pageLocale = locale || page.locale;
  let lang =
    pageLocale === defaultLocale ? "/" : `/${pageLocale.toLowerCase()}/`;
  let path = `${page.slug}/`;

  if (page.treeParent.root) {
    return lang + path;
  }
  path = `${page.treeParent.slug}/${path}`;
  return lang + path;
}

export function getPagePath(page, locale) {
  const pageLocale = locale || page.locale;
  let lang =
    pageLocale === defaultLocale ? "/" : `/${pageLocale.toLowerCase()}/`;
  let path = `${
    page._allSlugLocales.find((x) => x.locale === pageLocale).value
  }`;
  if (page.root) {
    return lang + `${path}/`;
  }

  path = `${
    page.treeParent._allSlugLocales.find((x) => x.locale === pageLocale).value
  }/${path}`;
  if (page.treeParent.root) {
    return lang + `${path}/`;
  }
  path = `${
    page.treeParent.treeParent._allSlugLocales.find(
      (x) => x.locale === pageLocale
    ).value
  }${path}`;
  return lang + `${path}/`;
}

export function getHomePath(locale) {
  return locale === defaultLocale ? "/" : `/${locale.toLowerCase()}/`;
}

export function getCartPath() {
  return "/cart/";
}

export function getSearchPath(locale) {
  console.log("locale", locale);
  return locale === defaultLocale
    ? `/${i18nPath[locale].search}/`
    : `/${locale.toLowerCase()}/${i18nPath[locale].search}/`;
}

export function getProductPath(product) {
  console.log(product);
  const locale = product.locale || defaultLocale;
  return locale === defaultLocale
    ? `/${i18nPath[locale].product}/${
        product.slug
          ? product.slug.toLowerCase()
          : product.code
          ? product.code.toLowerCase()
          : product.sku_code.toLowerCase()
      }/`
    : `/${locale.toLowerCase()}/${i18nPath[locale].product}/${
        product.slug
          ? product.slug.toLowerCase()
          : product.code
          ? product.code.toLowerCase()
          : product.sku_code.toLowerCase()
      }/`;
}
