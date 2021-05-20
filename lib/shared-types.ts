export * from '@/lib/__generated__/sanity-types'
import type * as GeneratedTypes from '@/lib/__generated__/sanity-types'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { GetStaticPropsContext } from 'next'

/*****************************************************
 * These types are manually created to match sanity groq queries
 *****************************************************/

interface Page {
  type: string
  slug: string
}

// Links
type LinkStyles = {
  style: string
  isLarge: boolean
  isBlock: boolean
}

interface LinkPage extends Page {}

type LinkData = {
  title: string
  isButton?: boolean
  url?: string
  page: LinkPage
  styles?: LinkStyles
}

// Promo
interface PromoData extends Omit<GeneratedTypes.PromoSettings, 'link'> {
  link?: LinkPage
}

// Menu
interface MenuItem {
  _key: string
  featured?: Product[]
  title: string
  dropdownItems?: MenuItem[]
  page: Page
}

type MenuItems = MenuItem[]

// Header
interface HeaderMenu {
  items: MenuItems
}

interface HeaderData
  extends Omit<
    GeneratedTypes.HeaderSettings,
    | 'menuDesktopLeft'
    | 'menuDesktopRight'
    | 'menuMobilePrimary'
    | 'menuMobileSecondary'
  > {
  promo: PromoData
  menuDesktopLeft: HeaderMenu
  menuDesktopRight: HeaderMenu
  menuMobilePrimary: HeaderMenu
  menuMobileSecondary: HeaderMenu
}

// Footer
type FooterNewsletterBlock = {
  id?: string
  klaviyoListID?: string
  terms?: string
  submit?: GeneratedTypes.SimplePortableText
  successMsg?: GeneratedTypes.ComplexPortableText
  errorMsg?: GeneratedTypes.ComplexPortableText
}

interface FooterBlock {
  title: string
  newsletter?: FooterNewsletterBlock
  social?: GeneratedTypes.SocialLink[]
  menu: {
    items: MenuItems
  }
}

interface FooterData {
  blocks: FooterBlock[]
}

// Photos
interface Photo extends GeneratedTypes.Figure {
  id: number
  type: string
  aspectRatio: number
  lqip: string
}

interface DividerPhoto extends GeneratedTypes.DividerPhoto {
  photo: Photo
}

// Products
type ProductOptions = {
  name: string
  position: number
  values: number[]
}[]

interface Variant {
  id: string
  title: string
  price: number
  comparePrice: number
  sku: string
  inStock: boolean
  lowStock: boolean
  options: {
    name: string
    position: number
    value: number
  }[]
  seo: GeneratedTypes.Seo
}

interface Product {
  id: string
  slug: string
  title: string
  price: number
  comparePrice: number
  description: GeneratedTypes.SimplePortableText
  sku: string
  options: ProductOptions
  variants: Variant[]
  surfaceOption: string
  inStock?: boolean
  lowStock?: boolean
  useGallery?: string
  optionSettings: {
    forOption: ForOption
    color: string
  }[]
  photos: {
    main: {
      forOption: ForOption
      photos?: Photo[]
    }[]
    listing: {
      forOption: ForOption
      default?: Photo
      hover?: Photo
    }[]
  }
  klaviyoAccountID?: string
}

// Modules
type Module =
  | GeneratedTypes.ProductHero
  | GeneratedTypes.CollectionGrid
  | Marquee
  | DividerPhoto
  | Grid
  | Hero

type GridColumnProductBlock = GeneratedTypes.SanityKeyed<{
  _type: 'productCard'
  product: Product
}>

type GridColumnBlock =
  | GeneratedTypes.SanityKeyed<GeneratedTypes.Freeform>
  | GeneratedTypes.SanityKeyed<Accordions>
  | GridColumnProductBlock

interface GridColumn extends Omit<GeneratedTypes.GridColumn, 'blocks'> {
  blocks?: Array<GridColumnBlock>
}

interface Grid extends Omit<GeneratedTypes.Grid, 'columns'> {
  columns?: Array<GridColumn>
}

interface Accordions extends Omit<GeneratedTypes.Accordions, 'items'> {
  items?: Array<GeneratedTypes.Accordion & { id: string }>
}

interface Hero
  extends Omit<GeneratedTypes.SanityKeyed<GeneratedTypes.Hero>, 'photos'> {
  photos: {
    mobilePhoto: Photo
    desktopPhoto: Photo
  }
}

interface Marquee
  extends Omit<GeneratedTypes.SanityKeyed<GeneratedTypes.Marquee>, 'items'> {
  items:
    | { _type: string; text?: string }[]
    | { _type: string; photo?: Photo }[]
    | { _type: string; _id: string; product?: Product }[]
}

// Site
interface SiteData {
  rootDomain: string
  cart: GeneratedTypes.CartSettings
  productCounts: {
    slug: string
    count: number
  }[]
  seo: GeneratedTypes.SeoSettings & {
    siteIcon: SanityImageSource
  }
  cookieConsent: GeneratedTypes.CookieSettings
  header: HeaderData
  footer: FooterData
}

// API Responses
interface ProductInventoryRes {
  inStock: boolean
  lowStock: boolean
  variants: {
    id: string
    inStock: boolean
    lowStock: boolean
  }[]
}

// Utils
export type OnClick = (event: React.MouseEvent<HTMLElement>) => void
export type ForOption = string | undefined
export interface _GetStaticPropsContext
  extends Omit<GetStaticPropsContext, 'previewData'> {
  previewData: {
    token?: string
  }
}

// API
export type API = {
  Page: Page
  LinkStyles: LinkStyles
  LinkPage: LinkPage
  LinkData: LinkData
  PromoData: PromoData
  MenuItem: MenuItem
  MenuItems: MenuItems
  HeaderMenu: HeaderMenu
  HeaderData: HeaderData
  FooterNewsletterBlock: FooterNewsletterBlock
  FooterBlock: FooterBlock
  FooterData: FooterData
  Photo: Photo
  ProductOptions: ProductOptions
  Variant: Variant
  Product: Product
  SiteData: SiteData
  Module: Module
  DividerPhoto: DividerPhoto
  Grid: Grid
  GridColumnBlock: GridColumnBlock
  GridColumnProductBlock: GridColumnProductBlock
  Accordions: Accordions
  Hero: Hero
  Marquee: Marquee
  ProductInventoryRes: ProductInventoryRes
  OnClick: OnClick
  GetStaticPropsContext: _GetStaticPropsContext
}

export default API

/*****************************************************
 * Manual Shopify API Response Types
 *****************************************************/

export interface ShopifyVariant {
  id: string
  product_id: string
  title: string
  price: string
  sku: string | null
  position: number
  inventory_policy: string
  compare_at_price: string | null
  fulfillment_service: string
  inventory_management: string
  option1: string | null
  option2: string | null
  option3: string | null
  created_at: string
  updated_at: string
  taxable: boolean
  barcode: string
  grams: number
  image_id: number
  weight: number
  weight_unit: string
  inventory_item_id: number
  inventory_quantity: number
  old_inventory_quantity: number
  presentment_prices: {
    price: {
      amount: string
      currency_code: string
    }
    compare_at_price: string | null
  }[]
  requires_shipping: boolean
  admin_graphql_api_id: string
}

export interface ShopifyProductOption {
  id: string
  product_id: number
  name: string
  position: number
  values: string[]
}

export interface ShopifyImage {
  id: number
  product_id: number
  position: number
  created_at: string
  updated_at: string
  alt: null
  width: number
  height: number
  src: string
  variant_ids: (number | undefined)[]
  admin_graphql_api_id: string
}

export interface ShopifyProduct {
  product: {
    id: string
    title: string
    body_html: string
    vendor: string
    product_type: string
    created_at: string
    sku: string
    handle: string
    updated_at: string
    published_at: string
    template_suffix: null
    status: string | 'active' | 'draft' | 'archived'
    published_scope: string
    tags: string
    admin_graphql_api_id: string
    variants: (ShopifyVariant | null)[]
    options: (ShopifyProductOption | null)[]
    images: (ShopifyImage | null)[]
    image: ShopifyImage | null
  }
}
