import axios from 'axios'
import sanity from './sanity'
import sanityImage from '@sanity/image-url'

/*  ------------------------------ */
/*  Global Site Queries
/*  ------------------------------ */

// Construct our "site" GROQ query
const site = `
  "site": {
    "rootDomain": *[_type == "generalSettings"][0].siteURL,
    "seo": *[_type == "seoSettings"][0]{
      title,
      description,
      handle,
      share
    },
		"social": *[_type == "generalSettings"][0]{
      "items": social[]{
        icon,
        url
      }
    },
  }
`

// Construct our "menus" GROQ query
const menus = `
  "menus": {
    "header": *[_type == "menu" && slug.current == "header"][0]{
      items[]{
        _key,
        _type,
        title,
        link,
        isButton,
        "type": page._ref,
        "page":page->{"type": _type, "slug": slug.current},
        items[]{
          _key,
          _type,
          title,
          link,
          isButton,
          "type": page._ref,
          "page":page->{"type": _type, "slug": slug.current},
        },
      },
    },
    "footer": *[_type == "menu" && slug.current == "footer"][0]{
      items[]{
        _key,
        _type,
        title,
        link,
        isButton,
        "type": page._ref,
        "page":page->{"type": _type, "slug": slug.current},
        items[]{
          _key,
          _type,
          title,
          link,
          isButton,
          "type": page._ref,
          "page":page->{"type": _type, "slug": slug.current},
        },
      },
    }
  }
`

// Construct our "blockcontent" GROQ query
const blockContent = `
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      "type": @.page._ref,
      "slug": @.page->slug,
      "page": @.page->{"type": _type, "slug": slug.current}
    },
    _type == "button" => {
      "type": @.page._ref,
      "slug": @.page->slug,
      "page": @.page->{"type": _type, "slug": slug.current}
    }
  },
  _type == "figure" => {
    ...,
    alt,
    asset,
    "type": asset->mimeType,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  }
`

// Construct our "product" GROQ query
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
        "id": asset->assetId,
        asset,
        crop,
        hotspot,
        alt
      }
    },
    "listing": listingPhotos[]{
      forOption,
      "default": listingPhoto{
        "id": asset->assetId,
        asset,
        crop,
        hotspot,
        alt
      },
      "hover": listingPhotoHover{
        "id": asset->assetId,
        asset,
        crop,
        hotspot,
        alt
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
  }
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

// Fetch a static page document with our global data
export async function getStaticPage(pageData) {
  const data = await sanity.fetch(
    `
    {
      "page": ${pageData},
      ${menus},
      ${site}
    }
    `
  )

  return data
}

// Fetch our static error page
export async function getErrorPage() {
  const data = await sanity.fetch(
    `
    {
      "page": *[_type == 'errorPage'][0]{
        title,
        content[]{
          ${blockContent}
        }
      },
    }
    `
  )

  return data
}

// Fetch a specific dynamic page with our global data
export async function getPage(slug) {
  const slugs = [`/${slug}`, slug, `/${slug}/`]

  const data = await sanity.fetch(
    `
    {
      "page": *[_type == "page" && slug.current in $slugs][0]{
        title,
        "slug": slug.current,
        hero,
        content[]{
          _type == 'hero' => {
            _type,
            _key,
            photo
          },
          _type == 'textBlock' => {
            _type,
            _key,
            content[]{
              ${blockContent}
            }
          },
          _type == 'venuesList' => {
            _type,
			      _key,
            title,
            venues[]->{
              title,
              "slug": slug.current,
              "photo": photos[0],
              address,
              phone,
              website
            }
          },
          _type == 'eventsList' => {
            _type,
            _key,
            title,
            items[]{
              title,
              photo,
              date,
              description,
              website
            }
          },
          _type == 'accordionList' => {
            _type,
            _key,
            title,
            items[]{
              "id": _key,
              title,
              content[]{
                ${blockContent}
              }
            }
          },
          _type == 'formContact' => {
            _type,
            _key,
            formName,
            fromAddress,
            notificationEmails,
            templateID,
            submit,
            successMsg[]{
              ${blockContent}
            },
            errorMsg[]{
              ${blockContent}
            }
          },
          _type == 'formNewsletter' => {
            _type,
            _key,
            action,
            submit,
            successMsg[]{
              ${blockContent}
            },
            errorMsg[]{
              ${blockContent}
            },
            terms[]{
              ${blockContent}
            }
          }
        },
        seo
      },
      ${menus},
      ${site}
    }
    `,
    { slugs }
  )

  return data
}

// Fetch a specific collection with our global data
export async function getCollection(slug) {
  const data = await sanity.fetch(
    `
    {
      "page": *[_type == "collection" && slug.current == $slug][0]{
        title,
        "collection": slug.current
      },
      ${menus},
      ${site}
    }
    `,
    { slug }
  )

  return data
}

// Fetch a specific product with our global data
export async function getProduct(slug, variant = false) {
  const data = await sanity.fetch(
    `
    {
      "product": *[_type == "product" && slug.current == $slug && wasDeleted != true && isDraft != true][0]{
        ${product},
        "activeVariant": ${variant ? variant : defaultVariant},
        seo
      },
      ${menus},
      ${site}
    }
    `,
    { slug, variant }
  )

  return data
}

export async function getAllProducts() {
  const data = await sanity.fetch(
    `
      *[_type == "product" && wasDeleted != true && isDraft != true]{
        ${product},
        "activeVariant": ${defaultVariant}
      } | order(title asc)
    `
  )

  return data
}

export async function getCollectionProducts(collection) {
  const data = await sanity.fetch(
    `
      *[_type == "collection" && slug.current == "${collection}"][0]{
        products[]->[wasDeleted != true && isDraft != true]{
          ${product},
          "activeVariant": ${defaultVariant}
        }
      }
    `
  )

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
