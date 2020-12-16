// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Document types
import homePage from './documents/page-home'
import shopPage from './documents/page-shop'
import samplePage from './documents/page-sample'
import errorPage from './documents/page-error'
import page from './documents/page'
import product from './documents/shopify-product'
import productVariant from './documents/shopify-variant'
import collection from './documents/shopify-collection'

import generalSettings from './documents/settings-general'
import seoSettings from './documents/settings-seo'
import menu from './documents/menu'
import redirect from './documents/redirect'

// Module types
import textBlock from './modules/text'
import accordionList from './modules/accordion-list'
import formNewsletter from './modules/form-newsletter'
import formContact from './modules/form-contact'

// Object types
import seo from './objects/seo'

import productGalleryPhotos from './objects/product-gallery-photos'
import productListingPhotos from './objects/product-listing-photos'
import productCartPhotos from './objects/product-cart-photos'
import productOption from './objects/product-option'
import productOptionValue from './objects/product-option-value'

import navDropdown from './objects/nav-dropdown'
import navPage from './objects/nav-page'
import navLink from './objects/nav-link'
import socialLink from './objects/social-link'

import simplePortableText from './objects/portable-simple'
import complexPortableText from './objects/portable-complex'

import accordion from './objects/accordion'
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
    shopPage,
    samplePage,
    errorPage,
    page,
    product,
    productVariant,
    collection,

    generalSettings,
    seoSettings,
    menu,
    redirect,

    // Module types
    textBlock,
    accordionList,
    formNewsletter,
    formContact,

    // Object types
    seo,

    productGalleryPhotos,
    productListingPhotos,
    productCartPhotos,
    productOption,
    productOptionValue,

    navDropdown,
    navPage,
    navLink,
    socialLink,

    simplePortableText,
    complexPortableText,

    accordion,
    figure,
    button,
    horizontalRule
  ])
})
