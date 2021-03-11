// determine if current page is active or not
export const getActive = (isStatic, pageSlug, router) => {
  if (isStatic !== false) {
    return isStatic == router.pathname.replace(/^\//g, '')
  } else {
    const slugs = [].concat(router.query.slug)
    const currentPath = slugs
      ? slugs.join('/')
      : router.asPath.replace(/^\//g, '')
    return currentPath == pageSlug
  }
}

export const getStaticRoute = (name) => {
  switch (name) {
    case 'homePage':
      return ''
    case 'shopPage':
      return 'shop'
    default:
      return false
  }
}

export const getDynamicRoute = (name) => {
  switch (name) {
    case 'collection':
      return 'shop'
    case 'product':
      return 'products'
    default:
      return false
  }
}
