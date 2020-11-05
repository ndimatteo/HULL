// determine if current page is active or not
export const getActive = (isStatic, pageSlug, router) => {
  if (isStatic) {
    return isStatic == router.pathname.replace(/^\//g, '')
  } else {
    const slugs = [].concat(router.query.slug)
    const currentPath = slugs
      ? slugs.join('/')
      : router.asPath.replace(/^\//g, '')
    return currentPath == pageSlug
  }
}

const getStaticRoute = (name) => {
  switch (name) {
    case 'homePage':
      return ''
    case 'samplePage':
      return '666'
    default:
      return false
  }
}

export default getStaticRoute
