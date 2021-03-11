import axios from 'axios'
import sanity, { sanityPreview } from './sanity'
import sanityImage from '@sanity/image-url'

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

// Construct our "site" GROQ
const site = `
  "site": {
    "rootDomain": *[_type == "generalSettings"][0].siteURL,
    "header": *[_type == "headerSettings"][0]{
      "promo": *[_type == "promoSettings"][0]{
        display,
        text,
        "link": link->{"type": _type, "slug": slug.current}
      },
      menuLeft->{
        items[]{
          ${link},
          dropdownItems[]{
            ${link}
          }
        }
      },
      menuRight->{
        items[]{
          ${link},
          dropdownItems[]{
            ${link}
          }
        }
      },
      menuMobile->{
        items[]{
          ${link},
          dropdownItems[]{
            ${link}
          }
        }
      }
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
      "page":@.page->{"type": _type, "slug": slug.current}
    }
  },
  _type == "figure" => {
    ${imageMeta}
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
      start
    },
    blocks[]{
      ${blocks}
    }
  }
},
_type == 'marquee' => {
  _type,
  _key,
  text,
  speed,
  reverse,
  pausable
}
`

// Construct our "product" GROQ
const product = `
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
`

// Construct our default variant GROQ query
const defaultVariant = `*[_type == "productVariant" && productID == ^.productID && wasDeleted != true && inStock == true] | order(options[0].value asc) [0].variantID`

/*  ------------------------------ */
/*  Sanity API Functions
/*  ------------------------------ */

// Define our Sanity image builder
export const imageBuilder = sanityImage(sanity)

// Fetch all dynamic docs
export async function getAllDocSlugs(doc) {
  const data = await sanity.fetch(
    `*[_type == "${doc}"]{ "slug": slug.current }`
  )
  return data
}

// Fetch all our page redirects
export async function getAllRedirects() {
  const data = await sanity.fetch(`*[_type == "redirect"]{ from, to }`)
  return data
}

export async function getSiteURL() {
  const data = await sanity.fetch(`*[_type == "generalSettings"][0].siteURL`)

  return data
}

// Fetch a static page document with our global data
export async function getStaticPage(pageData, preview) {
  const query = `
  {
    "page": ${pageData},
    ${site}
  }
  `

  const data = preview?.active
    ? await sanityPreview(preview.token).fetch(query)
    : await sanity.fetch(query)

  return data
}

// Fetch a specific dynamic page with our global data
export async function getPage(slug, preview) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const query = `
    {
      "page": *[_type == "page" && slug.current in ${JSON.stringify(
        slugs
      )}] | order(_updatedAt desc)[0]{
        "slug": slug.current,
        modules[]{
          ${modules}
        },
        seo
      },
      ${site}
    }
    `

  const data = preview?.active
    ? await sanityPreview(preview.token).fetch(query)
    : await sanity.fetch(query)

  return data
}

// Fetch a specific collection with our global data
export async function getCollection(slug, preview) {
  const query = `
  {
    "page": *[_type == "collection" && slug.current == "${slug}"] | order(_updatedAt desc)[0]{
      "collection": slug.current,
      modules[]{
        ${modules}
      },
      seo
    },
    ${site}
  }
  `

  const data = preview?.active
    ? await sanityPreview(preview.token).fetch(query)
    : await sanity.fetch(query)

  return data
}

// Fetch a specific product with our global data
export async function getProduct(slug, variant = false, preview) {
  const query = `
    {
      "product": *[_type == "product" && slug.current == "${slug}" && wasDeleted != true && isDraft != true] | order(_updatedAt desc)[0]{
        ${product},
        "activeVariant": ${variant ? variant : defaultVariant},
        modules[]{
          ${modules}
        },
        seo
      },
      ${site}
    }
  `

  const data = preview?.active
    ? await sanityPreview(preview.token).fetch(query)
    : await sanity.fetch(query)

  return data
}

export async function getAllProducts(preview) {
  const query = `
    *[_type == "product" && wasDeleted != true && isDraft != true${
      preview?.active ? ' && _id in path("drafts.**")' : ''
    }]{
      ${product},
      "activeVariant": ${defaultVariant}
    } | order(title asc)
  `

  const data = preview?.active
    ? await sanityPreview(preview.token).fetch(query)
    : await sanity.fetch(query)

  return data
}

export async function getCollectionProducts(collection, preview) {
  const query = `
    *[_type == "collection" && slug.current == "${collection}"][0]{
      products[]->[wasDeleted != true && isDraft != true${
        preview?.active ? ' && _id in path("drafts.**")' : ''
      }]{
        ${product},
        "activeVariant": ${defaultVariant}
      }
    }
  `

  const data = preview?.active
    ? await sanityPreview(preview.token).fetch(query)
    : await sanity.fetch(query)

  return data.products
}

/*  ------------------------------ */
/*  Other API Functions
/*  ------------------------------ */

// SendGrid Post function, used by our API route (so we don't expose our API key)
export async function postEmail(apiKey, data) {
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

  const options = {
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
