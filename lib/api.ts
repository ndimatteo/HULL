import { getSanityClient } from './sanity'
import axios, { AxiosRequestConfig } from 'axios'
import type { SeoSettings } from '@/lib/shared-types'
import type { PreviewOpts } from './sanity'
import type API from '@/lib/shared-types'

/*  ------------------------------ */
/*  Global Site Queries
/*  ------------------------------ */

// Construct our "menu items" GROQ
const link = `
  _key,
  _type,
  title,
  url,
  "page": page->{"type": _type, "slug": slug.current}
`

// Construct our "image meta" GROQ
export const imageMeta = `
  alt,
  asset,
  crop,
  customRatio,
  hotspot,
  "id": asset->assetId,
  "type": asset->mimeType,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  "lqip": asset->metadata.lqip
`

// Construct our "portable text content" GROQ
export const ptContent = `
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      "url": @.url,
      "isButton": @.isButton,
      "styles": @.styles{style, isLarge, isBlock},
      "page":@.page->{"type": _type, "slug": slug.current}
    }
  },
  _type == "figure" => {
    ${imageMeta}
  }
`

// Construct our "product" GROQ
const product = `
  {
    "slug": slug.current,
    "id": productID,
    title,
    price,
    comparePrice,
    description,
    "photos": {
      "main": galleryPhotos[]{
        forOption,
        photos[]{
          ${imageMeta}
        }
      },
      "listing": listingPhotos[]{
        forOption,
        "default": listingPhoto{
          ${imageMeta}
        },
        "hover": listingPhotoHover{
          ${imageMeta}
        }
      },
    },
    inStock,
    lowStock,
    useGallery,
    surfaceOption,
    options[]{
      name,
      position,
      values[]
    },
    optionSettings[]{
      forOption,
      color
    },
    "variants": *[_type == "productVariant" && productID == ^.productID && wasDeleted != true && isDraft != true]{
      "id": variantID,
      title,
      price,
      comparePrice,
      inStock,
      lowStock,
      options[]{
        name,
        position,
        value
      },
      seo
    },
    "klaviyoAccountID": *[_type == "generalSettings"][0].klaviyoAccountID
  }
`

// Construct our "blocks" GROQ
export const blocks = `
  _type == 'freeform' => {
    _type,
    _key,
    content[]{
      ${ptContent}
    },
    textAlign,
    maxWidth
  },
  _type == 'accordions' => {
    _type,
    _key,
    items[]{
      "id": _key,
      title,
      content[]{
        ${ptContent}
      }
    }
  },
  _type == 'productCard' => {
    _type,
    _key,
    product->${product}
  }
`

// Construct our content "modules" GROQ
export const modules = `
  _type == 'grid' => {
    _type,
    _key,
    size,
    columns[]{
      sizes[]{
        breakpoint,
        width,
        justify,
        align,
        start
      },
      blocks[]{
        ${blocks}
      }
    }
  },
  _type == 'hero' => {
    _type,
    _key,
    content[]{
      ${ptContent}
    },
    bgType,
    photos{
      ...,
      mobilePhoto{
        ${imageMeta}
      },
      desktopPhoto{
        ${imageMeta}
      }
    },
    video{
      id,
      title
    }
  },
  _type == 'marquee' => {
    _type,
    _key,
    items[]{
      _type == 'simple' => {
        _type,
        text
      },
      _type == 'photo' => {
        _type,
        "photo": {
          ${imageMeta}
        }
      },
      _type == 'product' => {
        _type,
        _id,
        "product": *[_type == "product" && _id == ^ ._ref][0]${product}
      }
    },
    speed,
    reverse,
    pausable
  },
  _type == 'dividerPhoto' => {
    _type,
    _key,
    photo{
      ${imageMeta}
    }
  },
  _type == 'productHero' => {
    _type,
    _key,
  },
  _type == 'collectionGrid' => {
    _type,
    _key,
  }
`

// All Products
export const allProducts = (preview?: PreviewOpts) => `
  *[_type == "product" && wasDeleted != true && isDraft != true${
    preview?.active ? ' && _id in path("drafts.**")' : ''
  }]${product} | order(title asc)
`

// Construct our "site" GROQ
const site = `
  "site": {
    "rootDomain": *[_type == "generalSettings"][0].siteURL,
    "cart": *[_type == "cartSettings"][0]{
      storeURL,
      message
    },
    "productCounts": [ {"slug": "all", "count": count(*[_type == "product"])} ] + *[_type == "collection"]{
      "slug": slug.current,
      "count": count(products)
    },
    "cookieConsent": *[_type == "cookieSettings"][0]{
      message,
      "link": link->{"type": _type, "slug": slug.current}
    },
    "header": *[_type == "headerSettings"][0]{
      "promo": *[_type == "promoSettings"][0]{
        display,
        text,
        "link": link->{"type": _type, "slug": slug.current}
      },
      menuDesktopLeft->{
        items[]{
          ${link},
          dropdownItems[]{
            ${link}
          },
          featured[]->${product}
        }
      },
      menuDesktopRight->{
        items[]{
          ${link},
          dropdownItems[]{
            ${link}
          },
          featured[]->${product}
        }
      },
      menuMobilePrimary->{
        items[]{
          ${link},
          dropdownItems[]{
            ${link}
          },
        }
      },
      menuMobileSecondary->{
        items[]{
          ${link},
          dropdownItems[]{
            ${link}
          },
        }
      }
    },
    "footer": *[_type == "footerSettings"][0]{
      "blocks": [
        {
          "title": blockTitle1,
          newsletter{
            "id": "footer",
            klaviyoListID,
            submit,
            successMsg[]{
              ${ptContent}
            },
            errorMsg[]{
              ${ptContent}
            },
            terms[]{
              ${ptContent}
            }
          }
        },
        {
          "title": blockTitle2,
          "menu": blockMenu2->{
            items[]{
              ${link}
            }
          }
        },
        {
          "title": blockTitle3,
          "menu": blockMenu3->{
            items[]{
              ${link}
            }
          }
        },
        {
          "title": blockTitle4,
          social[]{
            icon,
            url
          }
        }
      ]
    },
    "seo": *[_type == "seoSettings"][0]{
      siteTitle,
      metaTitle,
      metaDesc,
      shareTitle,
      shareDesc,
      shareGraphic
    },
  }
`

export type HomePageQuery = {
  hasTransparentHeader: boolean
  modules?: API['Module'][]
  seo?: SeoSettings
}

export const HOME_PAGE_QUERY = `
*[_type == "homePage"] | order(_updatedAt desc)[0]{
  hasTransparentHeader,
  modules[]{
    ${modules}
  },
  seo
}
`

export type ErrorPageQuery = {
  modules?: API['Module'][]
  seo?: SeoSettings
}

export const ERROR_PAGE_QUERY = `
*[_type == "errorPage"] | order(_updatedAt desc)[0]{
  modules[]{
    ${modules}
  },
  seo
}
`

export type ShopPageQuery = {
  hasTransparentHeader: boolean
  modules?: API['Module'][]
  products?: API['Product'][]
  featuredProducts?: API['Product'][]
  seo?: SeoSettings
}

/*  ------------------------------ */
/*  Sanity API Functions
/*  ------------------------------ */

type GetAllDocSlugsReturn = {
  slug: string
}[]

// Fetch all dynamic docs
export async function getAllDocSlugs(
  doc: string
): Promise<GetAllDocSlugsReturn> {
  const data = await getSanityClient().fetch(
    `*[_type == "${doc}"]{ "slug": slug.current }`
  )
  return data
}

// Fetch all our page redirects
export async function getAllRedirects() {
  const data = await getSanityClient().fetch(
    `*[_type == "redirect"]{ from, to }`
  )
  return data
}

export interface GetStaticPageRes<Data> {
  page: Data
  site?: API['SiteData']
}

// Fetch a static page with our global data
export async function getStaticPage<Data = unknown>(
  pageQuery: string,
  preview: PreviewOpts
): Promise<GetStaticPageRes<Data>> {
  const query = `
  {
    "page": ${pageQuery},
    ${site}
  }
  `

  return await getSanityClient(preview).fetch(query)
}

export type GetPageRes = {
  page: {
    modules: API['Module'][]
    seo: SeoSettings
  }
  site: API['SiteData']
}
// Fetch a specific dynamic page with our global data
export async function getPage(
  slug: string,
  preview: PreviewOpts
): Promise<GetPageRes> {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const query = `
    {
      "page": *[_type == "page" && slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[0]{
        hasTransparentHeader,
        modules[]{
          ${modules}
        },
        seo
      },
      ${site}
    }
    `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

export interface GetProductPageRes {
  page: {
    product?: API['Product']
    modules?: API['Module'][]
    seo?: SeoSettings
  }
  site?: API['SiteData']
}

// Fetch a specific product with our global data
export async function getProduct(
  slug: string | string[] | undefined,
  preview: PreviewOpts
): Promise<GetProductPageRes> {
  const query = `
    {
      "page": *[_type == "product" && slug.current == "${slug}" && wasDeleted != true && isDraft != true] | order(_updatedAt desc)[0]{
        hasTransparentHeader,
        modules[]{
          ${modules}
        },
        "product": ${product},
        seo
      },
      ${site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

export type GetCollectionRes = {
  page: {
    modules: API['Module'][]
    seo: SeoSettings
    products: API['Product'][]
  }
  site: API['SiteData']
}

// Fetch a specific collection with our global data
export async function getCollection(
  slug: string | string[] | undefined,
  preview: PreviewOpts
): Promise<GetCollectionRes> {
  const query = `
    {
      "page": *[_type == "collection" && slug.current == "${slug}"] | order(_updatedAt desc)[0]{
        hasTransparentHeader,
        modules[]{
          ${modules}
        },
        products[wasDeleted != true && isDraft != true${
          preview?.active ? ' && _id in path("drafts.**")' : ''
        }]->${product},
        seo
      },
      ${site}
    }
  `

  const data = await getSanityClient(preview).fetch(query)

  return data
}

type EmailData = {
  formName?: string
  fromAddress: string
  notificationEmails: string[]
  templateID: string
  name: string
  email: string
  subject: string
  message: string
}

// SendGrid Post function, used by our API route (so we don't expose our API key)
export async function postEmail(apiKey: string, data: EmailData) {
  const {
    formName = 'Contact Form',
    fromAddress,
    notificationEmails,
    templateID,
    name,
    email,
    subject,
    message,
  } = data

  const toAddresses = notificationEmails.map((email) => ({
    email: email,
  }))

  const options: AxiosRequestConfig = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    data: {
      personalizations: [
        {
          to: toAddresses,
          subject: subject,
          dynamic_template_data: {
            formName: formName,
            name: name,
            email: email,
            subject: subject,
            message: message,
          },
        },
      ],
      from: {
        email: fromAddress,
      },
      template_id: templateID,
    },
    url: 'https://api.sendgrid.com/v3/mail/send',
  }

  const post = await axios(options)
    .then((response) => {
      console.log('SendGrid Success')
      return response
    })
    .catch((err) => {
      console.log('SendGrid Failed')
      return err.response
    })

  return post
}
