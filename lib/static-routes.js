// determine if current page is active or not
export const getActive = (isStatic, pageSlug, router) => {
  if (isStatic) {
    return isStatic == router.pathname.replace(/^\//g, '')
  } else {
    const currentPath = router.query.slug
      ? router.query.slug.join('/')
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
