// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Document types
import homePage from './documents/page-home'
import samplePage from './documents/page-sample'
import errorPage from './documents/page-error'
import page from './documents/page'
import product from './documents/shopify-product'
import productVariant from './documents/shopify-variant'

import generalSettings from './documents/settings-general'
import seoSettings from './documents/settings-seo'
import menu from './documents/menu'
import redirect from './documents/redirect'

// Module types
import hero from './modules/hero'
import textBlock from './modules/text'

// Object types
import seo from './objects/seo'

import productOption from './objects/product-option'

import navDropdown from './objects/nav-dropdown'
import navPage from './objects/nav-page'
import navLink from './objects/nav-link'
import socialLink from './objects/social-link'

import simplePortableText from './objects/portable-simple'
import complexPortableText from './objects/portable-complex'

import figure from './objects/figure'
import button from './objects/button'
import horizontalRule from './objects/horizontal-rule'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'content',

  // schema types
  types: schemaTypes.concat([
    // Document types
    homePage,
    samplePage,
    errorPage,
    page,
    product,
    productVariant,

    generalSettings,
    seoSettings,
    menu,
    redirect,

    // Module types
    hero,
    textBlock,

    // Object types
    seo,

    productOption,

    navDropdown,
    navPage,
    navLink,
    socialLink,

    simplePortableText,
    complexPortableText,

    figure,
    button,
    horizontalRule
  ])
})
