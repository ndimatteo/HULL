import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
};

/**
 * Home
 *
 *
 */
export interface HomePage extends SanityDocument {
  _type: "homePage";

  /**
   * Overlay header with transparency? — `boolean`
   *
   * When toggled on, the header will appear with a transparent background over the first content module and text/logos will be white until scrolling is engaged.
   */
  hasTransparentHeader?: boolean;

  /**
   * Page Modules — `array`
   *
   *
   */
  modules?: Array<
    | SanityKeyed<Grid>
    | SanityKeyed<Hero>
    | SanityKeyed<Marquee>
    | SanityKeyed<DividerPhoto>
  >;

  /**
   * SEO / Share Settings — `seo`
   *
   *
   */
  seo?: Seo;
}

/**
 * Shop All Page
 *
 *
 */
export interface ShopPage extends SanityDocument {
  _type: "shopPage";

  /**
   * Overlay header with transparency? — `boolean`
   *
   * When toggled on, the header will appear with a transparent background over the first content module and text/logos will be white until scrolling is engaged.
   */
  hasTransparentHeader?: boolean;

  /**
   * Page Modules — `array`
   *
   *
   */
  modules?: Array<
    | SanityKeyed<CollectionGrid>
    | SanityKeyed<Grid>
    | SanityKeyed<Hero>
    | SanityKeyed<Marquee>
    | SanityKeyed<DividerPhoto>
  >;

  /**
   * Featured Products — `array`
   *
   * Show these products first, before sorting remaining products alphabetically
   */
  featuredProducts?: Array<SanityKeyedReference<Product>>;

  /**
   * SEO / Share Settings — `seo`
   *
   *
   */
  seo?: Seo;
}

/**
 * Error Page
 *
 *
 */
export interface ErrorPage extends SanityDocument {
  _type: "errorPage";

  /**
   * Overlay header with transparency? — `boolean`
   *
   * When toggled on, the header will appear with a transparent background over the first content module and text/logos will be white until scrolling is engaged.
   */
  hasTransparentHeader?: boolean;

  /**
   * Page Modules — `array`
   *
   *
   */
  modules?: Array<
    | SanityKeyed<Grid>
    | SanityKeyed<Hero>
    | SanityKeyed<Marquee>
    | SanityKeyed<DividerPhoto>
  >;

  /**
   * SEO / Share Settings — `seo`
   *
   *
   */
  seo?: Seo;
}

/**
 * Page
 *
 *
 */
export interface Page extends SanityDocument {
  _type: "page";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * URL Slug — `slug`
   *
   * (required)
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Overlay header with transparency? — `boolean`
   *
   * When toggled on, the header will appear with a transparent background over the first content module and text/logos will be white until scrolling is engaged.
   */
  hasTransparentHeader?: boolean;

  /**
   * Page Modules — `array`
   *
   *
   */
  modules?: Array<
    | SanityKeyed<Grid>
    | SanityKeyed<Hero>
    | SanityKeyed<Marquee>
    | SanityKeyed<DividerPhoto>
  >;

  /**
   * SEO / Share Settings — `seo`
   *
   *
   */
  seo?: Seo;
}

/**
 * Product
 *
 *
 */
export interface Product extends SanityDocument {
  _type: "product";

  /**
   * Product Title — `string`
   *
   *
   */
  productTitle?: string;

  /**
   * Product ID — `number`
   *
   *
   */
  productID?: number;

  /**
   * Price (cents) — `number`
   *
   *
   */
  price?: number;

  /**
   * Compare Price (cents) — `number`
   *
   *
   */
  comparePrice?: number;

  /**
   * In Stock? — `boolean`
   *
   *
   */
  inStock?: boolean;

  /**
   * Low Stock? — `boolean`
   *
   *
   */
  lowStock?: boolean;

  /**
   * SKU — `string`
   *
   *
   */
  sku?: string;

  /**
   * URL Slug — `slug`
   *
   *
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Options — `array`
   *
   *
   */
  options?: Array<SanityKeyed<ProductOption>>;

  /**
   * Draft Mode — `boolean`
   *
   *
   */
  isDraft?: boolean;

  /**
   * Deleted from Shopify? — `boolean`
   *
   *
   */
  wasDeleted?: boolean;

  /**
   * Display Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Description — `simplePortableText`
   *
   *
   */
  description?: SimplePortableText;

  /**
   * Gallery — `array`
   *
   * Define a Gallery for your product, or for a subset of variants
   */
  galleryPhotos?: Array<SanityKeyed<ProductGalleryPhotos>>;

  /**
   * Options Settings — `array`
   *
   * Define additional settings for product options
   */
  optionSettings?: Array<SanityKeyed<ProductOptionSettings>>;

  /**
   * Use Galleries — `string`
   *
   * Display an inline gallery, instead of a thumbnail for listings
   */
  useGallery?: "true" | "false";

  /**
   * Surface Option — `string`
   *
   * Surface one of the product options for this product on Collection pages
   */
  surfaceOption?: "";

  /**
   * Listing Thumbnails — `array`
   *
   *
   */
  listingPhotos?: Array<SanityKeyed<ProductListingPhotos>>;

  /**
   * Cart Thumbnails — `array`
   *
   *
   */
  cartPhotos?: Array<SanityKeyed<ProductCartPhotos>>;

  /**
   * Overlay header with transparency? — `boolean`
   *
   * When toggled on, the header will appear with a transparent background over the first content module and text/logos will be white until scrolling is engaged.
   */
  hasTransparentHeader?: boolean;

  /**
   * Page Modules — `array`
   *
   *
   */
  modules?: Array<
    | SanityKeyed<ProductHero>
    | SanityKeyed<Grid>
    | SanityKeyed<Hero>
    | SanityKeyed<Marquee>
    | SanityKeyed<DividerPhoto>
  >;

  /**
   * SEO / Share Settings — `seo`
   *
   *
   */
  seo?: Seo;
}

/**
 * Variant
 *
 *
 */
export interface ProductVariant extends SanityDocument {
  _type: "productVariant";

  /**
   * Product Title — `string`
   *
   *
   */
  productTitle?: string;

  /**
   * Variant Title — `string`
   *
   *
   */
  variantTitle?: string;

  /**
   * Product ID — `number`
   *
   *
   */
  productID?: number;

  /**
   * Variant ID — `number`
   *
   *
   */
  variantID?: number;

  /**
   * Price (cents) — `number`
   *
   *
   */
  price?: number;

  /**
   * Compare Price (cents) — `number`
   *
   *
   */
  comparePrice?: number;

  /**
   * In Stock? — `boolean`
   *
   *
   */
  inStock?: boolean;

  /**
   * Low Stock? — `boolean`
   *
   *
   */
  lowStock?: boolean;

  /**
   * SKU — `string`
   *
   *
   */
  sku?: string;

  /**
   * Options — `array`
   *
   *
   */
  options?: Array<SanityKeyed<ProductOptionValue>>;

  /**
   * Draft Mode — `boolean`
   *
   *
   */
  isDraft?: boolean;

  /**
   * Deleted from Shopify? — `boolean`
   *
   *
   */
  wasDeleted?: boolean;

  /**
   * Display Title — `string`
   *
   *
   */
  title?: string;

  /**
   * SEO / Share Settings — `seo`
   *
   *
   */
  seo?: Seo;
}

/**
 * Collection
 *
 *
 */
export interface Collection extends SanityDocument {
  _type: "collection";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * URL Slug — `slug`
   *
   * (required)
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Overlay header with transparency? — `boolean`
   *
   * When toggled on, the header will appear with a transparent background over the first content module and text/logos will be white until scrolling is engaged.
   */
  hasTransparentHeader?: boolean;

  /**
   * Page Modules — `array`
   *
   *
   */
  modules?: Array<
    | SanityKeyed<CollectionGrid>
    | SanityKeyed<Grid>
    | SanityKeyed<Hero>
    | SanityKeyed<Marquee>
    | SanityKeyed<DividerPhoto>
  >;

  /**
   * Products Grid — `array`
   *
   *
   */
  products?: Array<SanityKeyedReference<Product>>;

  /**
   * SEO / Share Settings — `seo`
   *
   *
   */
  seo?: Seo;
}

/**
 * General Settings
 *
 *
 */
export interface GeneralSettings extends SanityDocument {
  _type: "generalSettings";

  /**
   * Live Site URL — `url`
   *
   * The root domain or subdomain of your website.
   */
  siteURL?: string;

  /**
   * Klaviyo Site ID (Public API Key) — `string`
   *
   * For product waitlist and newsletter forms.
   */
  klaviyoAccountID?: string;
}

/**
 * Cookie Consent Settings
 *
 *
 */
export interface CookieSettings extends SanityDocument {
  _type: "cookieSettings";

  /**
   * cookiePolicyNote — `note`
   *
   *
   */
  cookiePolicyNote?: Note;

  /**
   * Message — `text`
   *
   * Your cookie consent message.
   */
  message?: string;

  /**
   * Link — `reference`
   *
   * Show a link to "Learn More" about your cookie policy.
   */
  link?: SanityReference<HomePage | ShopPage | Page | Collection | Product>;
}

/**
 * Promo Bar Settings
 *
 *
 */
export interface PromoSettings extends SanityDocument {
  _type: "promoSettings";

  /**
   * Display — `string`
   *
   * Choose where the promo bar is displayed
   */
  display?: " " | "all" | "home";

  /**
   * Text — `string`
   *
   * The text to show on the banner
   */
  text?: string;

  /**
   * Link — `reference`
   *
   * (optional) Select a page to link the promo banner to
   */
  link?: SanityReference<HomePage | ShopPage | Page | Collection | Product>;
}

/**
 * Header Settings
 *
 *
 */
export interface HeaderSettings extends SanityDocument {
  _type: "headerSettings";

  /**
   * navNote — `note`
   *
   *
   */
  navNote?: Note;

  /**
   * Desktop Menu (Left) — `reference`
   *
   *
   */
  menuDesktopLeft?: SanityReference<Menu>;

  /**
   * Desktop Menu (Right) — `reference`
   *
   *
   */
  menuDesktopRight?: SanityReference<Menu>;

  /**
   * Mobile Menu (Primary) — `reference`
   *
   *
   */
  menuMobilePrimary?: SanityReference<Menu>;

  /**
   * Mobile Menu (Secondary) — `reference`
   *
   *
   */
  menuMobileSecondary?: SanityReference<Menu>;
}

/**
 * Footer Settings
 *
 *
 */
export interface FooterSettings extends SanityDocument {
  _type: "footerSettings";

  /**
   * Block Title — `string`
   *
   *
   */
  blockTitle1?: string;

  /**
   * Newsletter — `newsletter`
   *
   *
   */
  newsletter?: Newsletter;

  /**
   * Block Title — `string`
   *
   *
   */
  blockTitle2?: string;

  /**
   * Block Menu — `reference`
   *
   *
   */
  blockMenu2?: SanityReference<Menu>;

  /**
   * Block Title — `string`
   *
   *
   */
  blockTitle3?: string;

  /**
   * Block Menu — `reference`
   *
   *
   */
  blockMenu3?: SanityReference<Menu>;

  /**
   * Block Title — `string`
   *
   *
   */
  blockTitle4?: string;

  /**
   * Social Links — `array`
   *
   *
   */
  social?: Array<SanityKeyed<SocialLink>>;
}

/**
 * Cart Settings
 *
 *
 */
export interface CartSettings extends SanityDocument {
  _type: "cartSettings";

  /**
   * Shopify Checkout URL — `url`
   *
   * The custom domain or subdomain connected to your Shopify store.
   */
  storeURL?: string;

  /**
   * Cart Message — `string`
   *
   * Display a message below the checkout button
   */
  message?: string;
}

/**
 * Default SEO / Share
 *
 *
 */
export interface SeoSettings extends SanityDocument {
  _type: "seoSettings";

  /**
   * Site Title — `string`
   *
   * The name of your site, usually your company/brand name.
   */
  siteTitle?: string;

  /**
   * Default Meta Title — `string`
   *
   * Title used for search engines and browsers.
   */
  metaTitle?: string;

  /**
   * Default Meta Description — `text`
   *
   * Description for search engines.
   */
  metaDesc?: string;

  /**
   * Default Share Title — `string`
   *
   * TItle used for social sharing cards.
   */
  shareTitle?: string;

  /**
   * Default Share Description — `text`
   *
   * Description for social sharing cards.
   */
  shareDesc?: string;

  /**
   * Default Share Graphic — `image`
   *
   * Share graphics will be cropped to 1200x630
   */
  shareGraphic?: {
    _type: "image";
    asset: SanityAsset;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };
}

/**
 * Menu
 *
 *
 */
export interface Menu extends SanityDocument {
  _type: "menu";

  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Slug — `slug`
   *
   * required
   */
  slug?: { _type: "slug"; current: string };

  /**
   * Nav Items — `array`
   *
   *
   */
  items?: Array<
    SanityKeyed<NavPage> | SanityKeyed<NavLink> | SanityKeyed<NavDropdown>
  >;
}

/**
 * Redirect
 *
 *
 */
export interface Redirect extends SanityDocument {
  _type: "redirect";

  /**
   * From — `string`
   *
   *
   */
  from?: string;

  /**
   * To — `string`
   *
   *
   */
  to?: string;

  /**
   * Is Permanent? — `boolean`
   *
   *
   */
  isPermanent?: boolean;
}

export type Grid = {
  _type: "grid";
  /**
   * Grid Size — `number`
   *
   *
   */
  size?: number;

  /**
   * Columns — `array`
   *
   *
   */
  columns?: Array<SanityKeyed<GridColumn>>;
};

export type GridColumn = {
  _type: "gridColumn";
  /**
   * Sizes — `array`
   *
   *
   */
  sizes?: Array<SanityKeyed<GridSize>>;

  /**
   * Blocks — `array`
   *
   *
   */
  blocks?: Array<
    SanityKeyed<Freeform> | SanityKeyed<Accordions> | SanityKeyed<ProductCard>
  >;
};

export type GridSize = {
  _type: "gridSize";
  /**
   * gridNote — `note`
   *
   *
   */
  gridNote?: Note;

  /**
   * Breakpoint — `string`
   *
   *
   */
  breakpoint?: " " | "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * Width — `number`
   *
   *
   */
  width?: number;

  /**
   * Justify — `string`
   *
   * Control the X-axis positioning
   */
  justify?: "justify-self-start" | "justify-self-center" | "justify-self-end";

  /**
   * Align — `string`
   *
   * Control the Y-axis positioning
   */
  align?: "self-start" | "self-center" | "self-end";

  /**
   * Start (offset) — `number`
   *
   *
   */
  start?: number;
};

export type Hero = {
  _type: "hero";
  /**
   * Overlay Content — `complexPortableText`
   *
   *
   */
  content?: ComplexPortableText;

  /**
   * Background Type — `string`
   *
   *
   */
  bgType?: "photo" | "video";

  /**
   * photos — `object`
   *
   *
   */
  photos?: {
    _type: "photos";
    /**
     * Background Photo (mobile) — `figure`
     *
     *
     */
    mobilePhoto?: Figure;

    /**
     * Background Photo (desktop) — `figure`
     *
     *
     */
    desktopPhoto?: Figure;
  };

  /**
   * video — `object`
   *
   *
   */
  video?: {
    _type: "video";
    /**
     * Background Video — `string`
     *
     * Alternatively, enter a vimeo ID to show a looping video instead
     */
    id?: string;

    /**
     * Background Video Title — `string`
     *
     * Short title/description of the video
     */
    title?: string;
  };
};

export type Marquee = {
  _type: "marquee";
  /**
   * Items — `array`
   *
   *
   */
  items?: Array<
    | SanityKeyed<{
        _type: "simple";
        /**
         * Text — `string`
         *
         *
         */
        text?: string;
      }>
    | SanityKeyed<Figure>
    | SanityKeyedReference<Product>
  >;

  /**
   * Speed — `number`
   *
   * Pick a number between 0-1 (0.5 is the default)
   */
  speed?: number;

  /**
   * Reverse direction? — `boolean`
   *
   *
   */
  reverse?: boolean;

  /**
   * Pause on hover? — `boolean`
   *
   *
   */
  pausable?: boolean;
};

export type DividerPhoto = {
  _type: "dividerPhoto";
  /**
   * Photo — `figure`
   *
   *
   */
  photo?: Figure;
};

export type Newsletter = {
  _type: "newsletter";
  /**
   * klaviyoNote — `note`
   *
   *
   */
  klaviyoNote?: Note;

  /**
   * Klaviyo List ID — `string`
   *
   * Your Klaviyo List to subscribe emails to
   */
  klaviyoListID?: string;

  /**
   * Submit Text — `string`
   *
   *
   */
  submit?: string;

  /**
   * Success Message — `complexPortableText`
   *
   *
   */
  successMsg?: ComplexPortableText;

  /**
   * Error Message — `complexPortableText`
   *
   *
   */
  errorMsg?: ComplexPortableText;

  /**
   * Agreement Statement — `simplePortableText`
   *
   *
   */
  terms?: SimplePortableText;
};

export type ProductHero = {
  _type: "productHero";
  /**
   * Display Product Hero? — `boolean`
   *
   *
   */
  active?: boolean;
};

export type CollectionGrid = {
  _type: "collectionGrid";
  /**
   * Display Collection Grid? — `boolean`
   *
   *
   */
  active?: boolean;
};

export type Freeform = {
  _type: "freeform";
  /**
   *   — `complexPortableText`
   *
   *
   */
  content?: ComplexPortableText;

  /**
   * Max Width — `string`
   *
   * Apply a max-width to this block, inside the column (helps with legibility)
   */
  maxWidth?:
    | " "
    | "max-w-prose"
    | "max-w-xs"
    | "max-w-sm"
    | "max-w-md"
    | "max-w-lg"
    | "max-w-xl"
    | "max-w-2xl"
    | "max-w-3xl"
    | "max-w-4xl"
    | "max-w-5xl"
    | "max-w-6xl"
    | "max-w-7xl";

  /**
   * Text Alignment — `string`
   *
   * Change the alignment of text (and other items) inside this block
   */
  textAlign?: "text-start" | "text-center" | "text-end" | "text-justify";
};

export type Accordions = {
  _type: "accordions";
  /**
   * Accordions — `array`
   *
   *
   */
  items?: Array<SanityKeyed<Accordion>>;
};

export type ProductCard = {
  _type: "productCard";
  /**
   * Product — `reference`
   *
   *
   */
  product?: SanityReference<Product>;
};

export type Seo = {
  _type: "seo";
  /**
   * Meta Title — `string`
   *
   * Title used for search engines and browsers.
   */
  metaTitle?: string;

  /**
   * Meta Description — `text`
   *
   * Description for search engines.
   */
  metaDesc?: string;

  /**
   * Share Title — `string`
   *
   * TItle used for social sharing cards.
   */
  shareTitle?: string;

  /**
   * Share Description — `text`
   *
   * Description for social sharing cards.
   */
  shareDesc?: string;

  /**
   * Share Graphic — `image`
   *
   * Share graphics will be cropped to 1200x630
   */
  shareGraphic?: {
    _type: "image";
    asset: SanityAsset;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };
};

export type ProductGalleryPhotos = {
  _type: "productGalleryPhotos";
  /**
   * Wich Variants is this for? — `string`
   *
   *
   */
  forOption?: "";

  /**
   * Gallery Photo(s) — `array`
   *
   *
   */
  photos?: Array<SanityKeyed<Figure>>;
};

export type ProductListingPhotos = {
  _type: "productListingPhotos";
  /**
   * Wich Variants is this for? — `string`
   *
   *
   */
  forOption?: "";

  /**
   * Thumbnail — `figure`
   *
   *
   */
  listingPhoto?: Figure;

  /**
   * Thumbnail (hover) — `figure`
   *
   *
   */
  listingPhotoHover?: Figure;
};

export type ProductCartPhotos = {
  _type: "productCartPhotos";
  /**
   * Wich Variants is this for? — `string`
   *
   *
   */
  forOption?: "";

  /**
   * Thumbnail — `figure`
   *
   *
   */
  cartPhoto?: Figure;
};

export type ProductOption = {
  _type: "productOption";
  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Position — `number`
   *
   *
   */
  position?: number;

  /**
   * Values — `array`
   *
   *
   */
  values?: Array<SanityKeyed<string>>;
};

export type ProductOptionValue = {
  _type: "productOptionValue";
  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Value — `string`
   *
   *
   */
  value?: string;

  /**
   * Position — `number`
   *
   *
   */
  position?: number;
};

export type ProductOptionSettings = {
  _type: "productOptionSettings";
  /**
   * Wich option is this for? — `string`
   *
   *
   */
  forOption?: "";

  /**
   * Color Swatch — `color`
   *
   *
   */
  color?: Color;
};

export type NavDropdown = {
  _type: "navDropdown";
  /**
   * Title — `string`
   *
   * Text to Display
   */
  title?: string;

  /**
   * Dropdown Items — `array`
   *
   *
   */
  dropdownItems?: Array<SanityKeyed<NavPage> | SanityKeyed<NavLink>>;

  /**
   * featuredNote — `note`
   *
   *
   */
  featuredNote?: Note;

  /**
   * Featured Products — `array`
   *
   *
   */
  featured?: Array<SanityKeyedReference<Product>>;
};

export type NavPage = {
  _type: "navPage";
  /**
   * Title — `string`
   *
   * Display Text
   */
  title?: string;

  /**
   * Page — `reference`
   *
   *
   */
  page?: SanityReference<HomePage | ShopPage | Page | Collection | Product>;
};

export type NavLink = {
  _type: "navLink";
  /**
   * Title — `string`
   *
   * Display Text
   */
  title?: string;

  /**
   * URL — `url`
   *
   * enter an external URL
   */
  url?: string;
};

export type SocialLink = {
  _type: "socialLink";
  /**
   * Icon — `string`
   *
   *
   */
  icon?:
    | "Apple"
    | "Facebook"
    | "Instagram"
    | "Soundcloud"
    | "Spotify"
    | "Twitter"
    | "YouTube"
    | "Github";

  /**
   * URL — `url`
   *
   *
   */
  url?: string;
};

export type SimplePortableText = Array<SanityKeyed<SanityBlock>>;

export type ComplexPortableText = Array<
  SanityKeyed<SanityBlock> | SanityKeyed<Figure> | SanityKeyed<HorizontalRule>
>;

export type Accordion = {
  _type: "accordion";
  /**
   * Title — `string`
   *
   *
   */
  title?: string;

  /**
   * Content — `simplePortableText`
   *
   *
   */
  content?: SimplePortableText;
};

export type Figure = {
  _type: "figure";
  asset: SanityAsset;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;

  /**
   * Display Size (aspect ratio) — `number`
   *
   *
   */
  customRatio?: number;

  /**
   * Alternative text — `string`
   *
   * Important for SEO and accessiblity.
   */
  alt?: string;
};

export type HorizontalRule = {
  _type: "horizontalRule";
  /**
   * horizontalRule — `string`
   *
   *
   */
  horizontalRule?: string;
};

export type Documents =
  | HomePage
  | ShopPage
  | ErrorPage
  | Page
  | Product
  | ProductVariant
  | Collection
  | GeneralSettings
  | CookieSettings
  | PromoSettings
  | HeaderSettings
  | FooterSettings
  | CartSettings
  | SeoSettings
  | Menu
  | Redirect;

/**
 * This interface is a stub. It was referenced in your sanity schema but
 * the definition was not actually found. Future versions of
 * sanity-codegen will let you type this explicity.
 */
type Note = any;

/**
 * This interface is a stub. It was referenced in your sanity schema but
 * the definition was not actually found. Future versions of
 * sanity-codegen will let you type this explicity.
 */
type Color = any;
