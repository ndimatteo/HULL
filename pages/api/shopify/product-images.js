import sanityClient from '@sanity/client'
import axios from 'axios'

import { queries } from '@data'
import { buildSrc } from '@lib/helpers'

const sanity = sanityClient({
  dataset: process.env.SANITY_PROJECT_DATASET,
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: false,
})

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  const {
    body: { productID, cartPhotos },
  } = req

  // bail if no productID or Cart Photos added
  if (!productID || !cartPhotos?.length) {
    return res.status(200).json({
      error:
        'Must be a POST request with a Product ID that contains Cart Thumbnails',
    })
  }

  // Fetch product variants and expand our cart photo references
  const product = await sanity.fetch(
    `*[_type == "product" && productID == ${productID}][0]{
      "variants": *[_type == "productVariant" && productID == ${productID}]{
        variantID,
        options[]{
          name,
          value
        }
      },
      cartPhotos[]{
        forOption,
        "default": cartPhoto{
          ${queries.imageMeta}
        }
      }
    }`
  )

  // Check if we have more than one photo set or, one set for variants
  const hasVariantPhotos =
    product.cartPhotos.length > 1 ||
    product.cartPhotos.some((set) => set.forOption)

  // associate our variants with each photo set
  const variantPhotoSets = product.cartPhotos.map((set) => {
    const optName = set.forOption?.split(':')[0]
    const optValue = set.forOption?.split(':')[1]
    const newVariants = product.variants.filter((v) =>
      v.options.some((opt) => opt.name === optName && opt.value === optValue)
    )

    return {
      variants: newVariants,
      photo: set.default,
    }
  })

  const generateSrc = (asset) => buildSrc(asset, { width: 800, height: 800 })

  const shopifyConfig = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': process.env.SHOPIFY_API_PASSWORD,
  }

  // Write our images to Shopify
  const shopifyProduct = await axios({
    url: `https://${process.env.SHOPIFY_STORE_ID}.myshopify.com/admin/api/2021-04/products/${productID}.json`,
    method: 'PUT',
    headers: shopifyConfig,
    data: {
      product: {
        id: productID,
        images: hasVariantPhotos
          ? variantPhotoSets.map((set) => ({
              src: generateSrc(set.photo),
              variant_ids: set.variants.map((v) => v.variantID),
            }))
          : [{ src: generateSrc(product.cartPhotos[0].default) }],
      },
    },
  }).then((res) => res.data)

  res.statusCode = 200
  res.json(shopifyProduct)
}
