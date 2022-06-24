import S from '@sanity/base/structure-builder'

const singletons = [
  'generalSettings',
  'cookieSettings',
  'promoSettings',
  'headerSettings',
  'footerSettings',
  'shopSettings',
  'seoSettings',
  'media.tag' // for media plugin
]

const shopify = ['product', 'productVariant']

export default [
  ...S.defaultInitialValueTemplateItems().filter(
    doc => !singletons.includes(doc.spec.id) && !shopify.includes(doc.spec.id)
  )
]
