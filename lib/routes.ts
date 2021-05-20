import type { NextRouter } from 'next/router'

// determine if current page is active or not
export const getActive = (
  isStatic: string | boolean,
  pageSlug: string,
  router: NextRouter
): boolean => {
  if (isStatic !== false) {
    return isStatic == router.pathname.replace(/^\//g, '')
  } else {
    const slug = router.query.slug
    const slugs = Array.isArray(slug) ? slug : [slug]
    const currentPath = slugs
      ? slugs.join('/')
      : router.asPath.replace(/^\//g, '')
    return currentPath == pageSlug
  }
}

export const getStaticRoute = (name: string): string | boolean => {
  switch (name) {
    case 'homePage':
      return ''
    case 'shopPage':
      return 'shop'
    default:
      return false
  }
}

export const getDynamicRoute = (name: string): string | boolean => {
  switch (name) {
    case 'collection':
      return 'shop'
    case 'product':
      return 'products'
    default:
      return false
  }
}
