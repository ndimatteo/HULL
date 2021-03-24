import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

// Document types
import homePage from './documents/page-home'
import shopPage from './documents/page-shop'
import errorPage from './documents/page-error'
import page from './documents/page'
import product from './documents/shopify-product'
import productVariant from './documents/shopify-variant'
import collection from './documents/shopify-collection'

import generalSettings from './documents/settings-general'
import cookieSettings from './documents/settings-cookie'
import promoSettings from './documents/settings-promo'
import headerSettings from './documents/settings-header'
import footerSettings from './documents/settings-footer'
import cartSettings from './documents/settings-cart'
import seoSettings from './documents/settings-seo'
import menu from './documents/menu'
import redirect from './documents/redirect'

// Module types
import grid from './modules/grid'
import gridColumn from './modules/grid-column'
import gridSize from './modules/grid-size'
import hero from './modules/hero'
import marquee from './modules/marquee'
import dividerPhoto from './modules/divider-photo'
import newsletter from './modules/newsletter'
import productHero from './modules/product-hero'
import collectionGrid from './modules/collection-grid'

// Block types
import freeform from './blocks/freeform'
import accordions from './blocks/accordions'
import productCard from './blocks/product-card'

// Object types
import seo from './objects/seo'

import productGalleryPhotos from './objects/product-gallery-photos'
import productListingPhotos from './objects/product-listing-photos'
import productCartPhotos from './objects/product-cart-photos'
import productOption from './objects/product-option'
import productOptionValue from './objects/product-option-value'
import productOptionSettings from './objects/product-option-settings'

import navDropdown from './objects/nav-dropdown'
import navPage from './objects/nav-page'
import navLink from './objects/nav-link'
import socialLink from './objects/social-link'

import simplePortableText from './objects/portable-simple'
import complexPortableText from './objects/portable-complex'

import accordion from './objects/accordion'
import figure from './objects/figure'
import horizontalRule from './objects/horizontal-rule'

/*  ------------------------------------------ */
/*  Your Schema documents / modules / objects
/*  ------------------------------------------ */
export default createSchema({
  // The name of our schema
  name: 'content',

  types: schemaTypes.concat([
    /* ----------------- */
    /* 1: Document types */
    homePage,
    shopPage,
    errorPage,
    page,
    product,
    productVariant,
    collection,

    generalSettings,
    cookieSettings,
    promoSettings,
    headerSettings,
    footerSettings,
    cartSettings,
    seoSettings,
    menu,
    redirect,

    /* --------------- */
    /* 2: Module types */
    grid,
    gridColumn,
    gridSize,
    hero,
    marquee,
    dividerPhoto,
    newsletter,
    productHero,
    collectionGrid,

    /* -------------- */
    /* 3: Block types */
    freeform,
    accordions,
    productCard,

    /* ----------------------- */
    /* 4: Generic Object types */
    seo,

    productGalleryPhotos,
    productListingPhotos,
    productCartPhotos,
    productOption,
    productOptionValue,
    productOptionSettings,

    navDropdown,
    navPage,
    navLink,
    socialLink,

    simplePortableText,
    complexPortableText,

    accordion,
    figure,
    horizontalRule
  ])
})
