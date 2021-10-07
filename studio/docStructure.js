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

export default [
  ...S.defaultInitialValueTemplateItems().filter(
    doc => !singletons.includes(doc.spec.id)
  )
]
